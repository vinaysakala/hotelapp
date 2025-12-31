import { Component, OnInit } from '@angular/core';
import { Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})

export class Tab3Page implements OnInit {
  userData: any = '';
  constructor(
    private auth: Auth,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private firestore: Firestore
  ) { }

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getUserProfile(user.uid);
      } else {
        console.log('No user logged in');
      }
    });
  }

  async getUserProfile(uid: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        this.userData = userDocSnap.data();
      } else {
        console.log('No user document found!');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async onSignOut() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Signing out...' });
            await loading.present();

            try {
              await signOut(this.auth);
              await loading.dismiss();
              // Navigate to login and prevent going back
              this.router.navigateByUrl('/login', { replaceUrl: true });
            } catch (error) {
              await loading.dismiss();
              console.error('Logout error', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
