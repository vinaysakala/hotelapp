import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc,deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-role',
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
  standalone:false
})
export class RolePage implements OnInit {
  roleName: string = '';
  roles: any = [];

  constructor(
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.roles = collectionData(collection(this.firestore, 'roles'), { idField: 'id' });
  }

  async addRole() {
    const roleId = this.roleName.toLowerCase().replace(/\s/g, '_');
    await setDoc(doc(this.firestore, `roles/${roleId}`), {
      roleName: this.roleName,
      canManageTables: false,
      canViewKDS: false,
      canViewSales: false,
      canBilling: false
    });
    this.roleName = '';
  }

  async confirmDelete(role: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Role',
      message: `Are you sure you want to delete "${role.roleName}" role ?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => { this.deleteRole(role.id); }
        }
      ]
    });
    await alert.present();
  }

  private async deleteRole(id: string) {
    try {
      await deleteDoc(doc(this.firestore, `roles/${id}`));
      this.showToast('Role deleted successfully');
    } catch (error) {
      this.showToast('Error deleting role', 'danger');
    }
  }

  async showToast(msg: string, color = 'success') {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color });
    toast.present();
  }
}

