import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, addDoc, collection, collectionData, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.page.html',
  styleUrls: ['./order-entry.page.scss'],
  standalone: false
})
export class OrderEntryPage implements OnInit {
  tableName: string = '';
  tableId: string = '';
  categories: any[] = [];
  menuItems: any[] = [];
  filteredItems: any[] = [];
  selectedCat: string = 'all';
  cart: any[] = [];
  cartTotal: number = 0;
  isCartModalOpen = false;
  cartAnimation = false;
  existingOrderId: string | null = null;

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
    private route: ActivatedRoute,
    private firestore: Firestore,
    private toastCtrl: ToastController,
    private router: Router,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'];
      this.tableName = params['tableName'];
      if (this.tableId) {
        this.loadData();
      }
    });
  }

  async loadData() {
    collectionData(collection(this.firestore, 'categories'), { idField: 'id' }).subscribe(res => this.categories = res);
    collectionData(collection(this.firestore, 'menuItems'), { idField: 'id' }).subscribe(res => {
      this.menuItems = res;
      this.filteredItems = res;
    });
    const orderRef = collection(this.firestore, 'liveOrders');
    const q = query(orderRef, where('tableId', '==', this.tableId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // We found an existing order for this table!
      const docData = querySnapshot.docs[0];
      this.existingOrderId = docData.id;
      this.cart = docData.data()['items'] || [];
      this.calculateTotal();
    }
  }
  removeFromCart(item: any) {
    const index = this.cart.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.cart[index].qty -= 1;
      if (this.cart[index].qty === 0) this.cart.splice(index, 1);
    }
    this.calculateTotal();
  }

  getQuantity(itemId: string): number {
    const item = this.cart.find(i => i.id === itemId);
    return item ? item.qty : 0;
  }

  calculateTotal() {
    this.cartTotal = this.cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  }

  filterByCategory(catId: string) {
    this.selectedCat = catId;
    this.filteredItems = catId === 'all' ? this.menuItems : this.menuItems.filter(i => i.categoryId === catId);
  }

  onSearch(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredItems = this.menuItems.filter(i => i.name.toLowerCase().includes(val));
  }

  viewCartModal() {
    this.isCartModalOpen = true;
  }

  async placeOrder() {
    if (this.cart.length === 0) {
      this.showToast('Cart is empty!', 'danger');
      return;
    }

    try {
      if (this.existingOrderId) {
        // UPDATE EXISTING ORDER
        const orderDocRef = doc(this.firestore, `liveOrders/${this.existingOrderId}`);
        await updateDoc(orderDocRef, {
          items: this.cart,
          total: this.cartTotal,
          status: 'Pending', // Notify kitchen of updates
          updatedAt: new Date()
        });
      } else {
        // CREATE NEW ORDER
        const orderRef = collection(this.firestore, 'liveOrders');
        await addDoc(orderRef, {
          tableId: this.tableId,
          tableName: this.tableName,
          items: this.cart,
          total: this.cartTotal,
          status: 'Pending',
          createdAt: new Date()
        });
      }

      // Update Table Status
      const tableDocRef = doc(this.firestore, `tables/${this.tableId}`);
      await updateDoc(tableDocRef, {
        status: 'Occupied',
        currentTotal: this.cartTotal
      });

      this.isCartModalOpen = false;
      this.showToast('Order sent to Kitchen!', 'success');
      this.navCtrl.navigateRoot('/tabs/tab1');

    } catch (error) {
      this.showToast('Error saving order', 'danger');
    }
  }
  
  addToCart(item: any) {
    const index = this.cart.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.cart[index].qty += 1;
    } else {
      this.cart.push({ ...item, qty: 1 });
    }
    this.calculateTotal();

    // Trigger Animation
    this.triggerCartAnimation();
  }

  triggerCartAnimation() {
    this.cartAnimation = true;
    // Remove the class after 300ms so it can be triggered again
    setTimeout(() => {
      this.cartAnimation = false;
    }, 300);
  }
}
