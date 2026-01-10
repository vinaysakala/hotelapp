import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.page.html',
  styleUrls: ['./menu-items.page.scss'],
  standalone: false
})
export class MenuItemsPage implements OnInit {

  categories: any[] = [];
  menuItems: any[] = [];
  filteredMenuItems: any[] = [];
  selectedCat: string = 'all';
  isModalOpen = false;
  editingItem: any = null;
  itemForm = {
    name: '',
    price: null,
    categoryId: '',
    type: 'Veg'
  };

  constructor(
    private firestore: Firestore,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 1000, color: color });
    await toast.present();
  }


  loadInitialData() {
    const catRef = collection(this.firestore, 'categories');
    const menuRef = collection(this.firestore, 'menuItems');

    // Load Categories
    collectionData(catRef, { idField: 'id' }).subscribe(res => {
      this.categories = res;
    });

    // Load Menu Items
    collectionData(menuRef, { idField: 'id' }).subscribe(res => {
      this.menuItems = res;
      this.filteredMenuItems = res;
    });
  }

  getCategoryName(id: string) {
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.name : 'No Category';
  }

  async deleteItem(id: string) {
    const itemDoc = doc(this.firestore, `menuItems/${id}`);
    await deleteDoc(itemDoc);
    this.showToast('Item deleted', 'danger');
  }

  // 5. Search & Filter Logic
  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredMenuItems = this.menuItems.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }

  filterByCategory(catId: string) {
    this.selectedCat = catId;
    if (catId === 'all') {
      this.filteredMenuItems = this.menuItems;
    } else {
      this.filteredMenuItems = this.menuItems.filter(item => item.categoryId === catId);
    }
  }



  async updateItem(id: string, newData: any) {
    if (!newData.name || !newData.price) {
      this.showToast('Name and Price are required', 'warning');
      return;
    }

    try {
      const itemDocRef = doc(this.firestore, `menuItems/${id}`);
      await updateDoc(itemDocRef, {
        name: newData.name,
        price: newData.price,
        categoryId: newData.categoryId || '',
        type: newData.type || 'Veg'
      });
      this.showToast('Item updated successfully!', 'success');
    } catch (error) {
      console.error(error);
      this.showToast('Failed to update item', 'danger');
    }
  }

  openAddMenuItem() {
    this.editingItem = null;
    this.itemForm = { name: '', price: null, categoryId: '', type: 'Veg' };
    this.isModalOpen = true;
  }

  editItem(item: any) {
    this.editingItem = item;
    this.itemForm = { ...item }; // Copy existing data into form
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async saveItem() {
    if (!this.itemForm.name || !this.itemForm.price) {
      this.showToast('Please fill required fields', 'warning');
      return;
    }
    if (this.editingItem) {
      const docRef = doc(this.firestore, `menuItems/${this.editingItem.id}`);
      await updateDoc(docRef, this.itemForm);
    } else {
      const colRef = collection(this.firestore, 'menuItems');
      await addDoc(colRef, { ...this.itemForm, createdAt: new Date() });
    }

    this.isModalOpen = false;
    this.showToast('Menu updated!', 'success');
  }
}
