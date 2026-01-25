import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private userPermissions: any = null;

  constructor(private auth: Auth, private firestore: Firestore) {}


  async can(permissionField: string): Promise<boolean> {
    const perms = await this.getPermissions();
    return perms ? !!perms[permissionField] : false;
  }

  async getPermissions() {
    if (this.userPermissions) return this.userPermissions;
    const user = this.auth.currentUser;
    if (!user) return null;
    const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
    const roleName = userDoc.data()?.['role'];
    const rolesRef = collection(this.firestore, 'roles');
    const q = query(rolesRef, where("roleName", "==", roleName));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      this.userPermissions = querySnapshot.docs[0].data();
      return this.userPermissions;
    }
    return null;
  }

  clearCache() {
    this.userPermissions = null;
  }
}
