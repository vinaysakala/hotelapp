import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, setDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { initializeApp, deleteApp } from 'firebase/app';
import { environment } from '../../../../environments/environment';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
  standalone: false
})
export class StaffPage implements OnInit {
  staffList: any[] = [];
  roles: any = [];

  constructor(
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const staffRef = collection(this.firestore, 'users');
    collectionData(staffRef, { idField: 'id' }).subscribe(res => {
      this.staffList = res;
    });

    const rolesRef = collection(this.firestore, 'roles');
    this.roles = collectionData(rolesRef, { idField: 'id' });
  }

  getRoleColor(role: string) {
    const r = role?.toLowerCase();
    if (r === 'admin') return 'danger';
    if (r === 'waiter' || r === 'captain') return 'success';
    if (r === 'chef') return 'warning';
    return 'tertiary';
  }

  async deleteStaff(id: string) {
    const docRef = doc(this.firestore, `users/${id}`);
    await deleteDoc(docRef);
  }

  async showToast(msg: string, color: any) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }

  isModalOpen = false;
  editingMember: any = null;
  staffForm = {
    fullname: '',
    username: '',
    email: '',
    role: 'Waiter'
  };

  openAddStaff() {
    this.editingMember = null;
    this.staffForm = { fullname: '', username: '', email: '', role: 'Waiter' };
    this.isModalOpen = true;
  }

  editStaff(member: any) {
    this.editingMember = member;
    this.staffForm = { ...member };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  async saveStaff() {
    const loading = await this.loadingCtrl.create({ message: 'Creating Staff...' });
    await loading.present();
    if (!this.staffForm.fullname || !this.staffForm.username || !this.staffForm.email || !this.staffForm.role) {
      this.showToast('All fields are required', 'warning');
      return;
    }

    let secondaryApp;
    try {
      const config = environment.firebaseConfig;
      secondaryApp = initializeApp(config, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        this.staffForm.email,
        '123456' // Default password
      );
      const uid = userCredential.user.uid;

      const userDocRef = doc(this.firestore, `users/${uid}`);

      await setDoc(userDocRef, {
        uid: uid,
        fullname: this.staffForm.fullname,
        email: this.staffForm.email,
        username: this.staffForm.username,
        role: this.staffForm.role,
        status: 'Active',
        createdAt: new Date()
      });

      await deleteApp(secondaryApp);
      this.showToast('Staff added to Unified Users', 'success');
      this.isModalOpen = false;
      await loading.dismiss();
    } catch (error: any) {
      await loading.dismiss();
      if (secondaryApp) await deleteApp(secondaryApp);
      this.showToast(error.message, 'danger');
    }
  }

  async toggleStaffStatus(member: any) {
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const docRef = doc(this.firestore, `users/${member.id}`);
      await updateDoc(docRef, { status: newStatus });
      this.showToast(
        `${member.username} is now ${newStatus}`,
        newStatus === 'Active' ? 'success' : 'warning'
      );
    } catch (e) {
      this.showToast('Failed to update status', 'danger');
    }
  }
}
