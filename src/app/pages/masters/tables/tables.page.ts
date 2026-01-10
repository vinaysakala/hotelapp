import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
  standalone: false
})
export class TablesPage implements OnInit {
  tables: any[] = [];

  constructor(
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const tableRef = collection(this.firestore, 'tables');
    collectionData(tableRef, { idField: 'id' }).subscribe(res => {
      this.tables = res;
    });
  }

  async openAddTable() {
    const alert = await this.alertCtrl.create({
      header: 'New Table',
      inputs: [
        { name: 'tableName', type: 'text', placeholder: 'Table Name (e.g. Table 1)' },
        { name: 'capacity', type: 'number', placeholder: 'Capacity (e.g. 4)' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => { this.saveTable(data); }
        }
      ]
    });
    await alert.present();
  }

  async saveTable(data: any) {
    if (!data.tableName) return;
    const tableRef = collection(this.firestore, 'tables');
    await addDoc(tableRef, {
      tableName: data.tableName,
      capacity: data.capacity || 2,
      status: 'Available',
      createdAt: new Date()
    });
    this.showToast('Table added successfully');
  }

  async editTable(table: any) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Table',
      inputs: [
        { name: 'tableName', type: 'text', value: table.tableName },
        { name: 'capacity', type: 'number', value: table.capacity }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: (data) => {
            const docRef = doc(this.firestore, `tables/${table.id}`);
            updateDoc(docRef, data);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteTable(id: string) {
    const docRef = doc(this.firestore, `tables/${id}`);
    await deleteDoc(docRef);
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000 });
    toast.present();
  }

}
