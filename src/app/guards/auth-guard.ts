import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { PermissionService } from '../services/permission';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore, 
    private permissionService: PermissionService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return resolve(false);
        }

        try {
          const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
          const userData = userDoc.data();
          if (userData?.['status'] !== 'Active') {
            await signOut(this.auth);
            this.router.navigate(['/login'], { queryParams: { status: 'inactive' } });
            return resolve(false);
          }
          
          const requiredPermission = route.data['permission'];
          if (requiredPermission) {
            const hasPerm = await this.permissionService.can(requiredPermission);
            if (!hasPerm) {
              this.router.navigate(['/tabs/tab1']);
              return resolve(false);
            }
          }
          resolve(true);
        } catch (error) {
          console.error("Guard Error:", error);
          resolve(false);
        }
      });
    });
  }
}
