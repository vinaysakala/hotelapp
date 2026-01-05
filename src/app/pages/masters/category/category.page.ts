import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { updateDoc } from '@angular/fire/firestore';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: false
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  searchTerm: string = '';
  public filteredCategories: any[] = [];

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  constructor(
    private firestore: Firestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    const loading = await this.loadingCtrl.create({
      message: 'loading data...',
      spinner: 'crescent'
    });
    await loading.present();
    const catRef = collection(this.firestore, 'categories');
    collectionData(catRef, { idField: 'id' }).subscribe(res => {
      this.categories = res;
      this.filteredCategories = res;
    });
    await loading.dismiss();
  }

  async openAddModal() {
    const alert = await this.alertCtrl.create({
      header: 'New Category',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Category Name (e.g. Starters)' },
        { name: 'icon', type: 'text', placeholder: 'Icon Name (e.g. pizza)' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => { this.saveCategory(data); }
        }
      ]
    });
    await alert.present();
  }

  async saveCategory(data: any) {
    if (!data.name) return;
    const catRef = collection(this.firestore, 'categories');
    await addDoc(catRef, {
      name: data.name,
      icon: data.icon || 'restaurant',
      status: 'Active',
      createdAt: new Date()
    });
  }

  async deleteCategory(id: string) {
    const catDoc = doc(this.firestore, `categories/${id}`);
    await deleteDoc(catDoc);
  }

  async editCategory(cat: any) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Category',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: cat.name,
          placeholder: 'Category Name'
        },
        {
          name: 'icon',
          type: 'text',
          value: cat.icon,
          placeholder: 'Icon Name (e.g., pizza)'
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: (data) => {
            this.updateCategory(cat.id, data);
          }
        }
      ]
    });

    await alert.present();
  }

  async updateCategory(id: string, newData: any) {
    if (!newData.name) return;
    try {
      const catDocRef = doc(this.firestore, `categories/${id}`);
      await updateDoc(catDocRef, {
        name: newData.name,
        icon: newData.icon || 'restaurant'
      });
      this.showToast('Category updated!', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Update failed', 'danger');
    }
  }

  filterCategories(event: any) {
    const val = event.target.value.toLowerCase();
    this.searchTerm = val;

    if (val && val.trim() !== '') {
      this.filteredCategories = this.categories.filter((item) => {
        return item.name.toLowerCase().indexOf(val) > -1;
      });
    } else {
      this.filteredCategories = this.categories;
    }
  }
}