import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '@angular/fire/auth';
import { PermissionService } from '../services/permission';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})

export class Tab3Page implements OnInit {

  showOld: boolean = false;
  showNew: boolean = false;
  showConfirm: boolean = false;
  isModalOpen = false;
  userData: any = null;
  pwForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };


  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private permission: PermissionService
  ) { }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    const user = this.auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
      if (userDoc.exists()) {
        this.userData = userDoc.data();
      }
    }
  }

  async logout() {
    const loading = await this.loadingCtrl.create({ message: 'Logging out...' });
    await loading.present();
    try {
      await signOut(this.auth);
      // Clear any local storage if you used it
      this.permission.clearCache()
      localStorage.clear();
      await loading.dismiss();
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      this.showToast('Logout failed', 'danger');
    }
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color
    });
    await toast.present();
  }

  async openChangePassword() {
    this.isModalOpen = true;
  }

  async updatePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.pwForm;
    const user = this.auth.currentUser;
    if (!oldPassword || !newPassword || !confirmPassword) {
      this.showToast('All fields are required', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      this.showToast('Passwords do not match', 'danger');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Updating...' });
    await loading.present();
    try {
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        await loading.dismiss();
        this.showToast('Password updated successfully!', 'success');
        this.isModalOpen = false;
        this.pwForm = { oldPassword: '', newPassword: '', confirmPassword: '' }; // Reset form
      }
    } catch (error: any) {
      await loading.dismiss();
      console.error(error);
      let msg = 'Error updating password';
      if (error.code === 'auth/wrong-password') msg = 'Incorrect current password';
      this.showToast(msg, 'danger');
    }
  }


  closeModal() {
    this.isModalOpen = false;
    this.showOld = false;
    this.showNew = false;
    this.showConfirm = false;
    this.pwForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }


}