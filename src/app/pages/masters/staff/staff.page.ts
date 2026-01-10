import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.page.html',
  styleUrls: ['./staff.page.scss'],
  standalone: false
})
export class StaffPage implements OnInit {
  staffList: any[] = [];

  constructor(
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const staffRef = collection(this.firestore, 'staff');
    collectionData(staffRef, { idField: 'id' }).subscribe(res => {
      this.staffList = res;
    });
  }

  getRoleColor(role: string) {
    switch (role?.toLowerCase()) {
      case 'admin': return 'danger';
      case 'waiter': return 'success';
      case 'chef': return 'warning';
      default: return 'medium';
    }
  }

  async deleteStaff(id: string) {
    const docRef = doc(this.firestore, `staff/${id}`);
    await deleteDoc(docRef);
  }

  async showToast(msg: string, color: any) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }

  isModalOpen = false;
  editingMember: any = null;
  staffForm = {
    name: '',
    email: '',
    role: 'Waiter'
  };

  openAddStaff() {
    this.editingMember = null;
    this.staffForm = { name: '', email: '', role: 'Waiter' };
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
    if (!this.staffForm.name || !this.staffForm.email) {
      this.showToast('Name and Email are required', 'warning');
      return;
    }

    try {
      if (this.editingMember) {
        const docRef = doc(this.firestore, `staff/${this.editingMember.id}`);
        await updateDoc(docRef, this.staffForm);
        this.showToast('Staff updated successfully', 'success');
      } else {
        const colRef = collection(this.firestore, 'staff');
        await addDoc(colRef, { ...this.staffForm, status: 'Active', createdAt: new Date() });
        this.showToast('Staff added successfully', 'success');
      }
      this.isModalOpen = false;
    } catch (e) {
      this.showToast('Operation failed', 'danger');
    }
  }
}
