import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

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
  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  constructor(private route: ActivatedRoute, private firestore: Firestore, private toastCtrl: ToastController,   private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'];
      this.tableName = params['tableName'];
    });
    this.loadData();
  }

  loadData() {
    // Load Categories
    collectionData(collection(this.firestore, 'categories'), { idField: 'id' }).subscribe(res => this.categories = res);
    // Load Menu
    collectionData(collection(this.firestore, 'menuItems'), { idField: 'id' }).subscribe(res => {
      this.menuItems = res;
      this.filteredItems = res;
    });
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

  isCartModalOpen = false;

  viewCartModal() {
    this.isCartModalOpen = true;
  }

  async placeOrder() {
    const orderRef = collection(this.firestore, 'liveOrders');

    // 1. Save the order data
    await addDoc(orderRef, {
      tableId: this.tableId,
      tableName: this.tableName,
      items: this.cart,
      total: this.cartTotal,
      status: 'Pending', // For the Kitchen Display System
      createdAt: new Date()
    });

    // 2. Update the Table Status in Firestore
    const tableDocRef = doc(this.firestore, `tables/${this.tableId}`);
    await updateDoc(tableDocRef, {
      status: 'Occupied',
      currentTotal: this.cartTotal
    });

    // 3. Cleanup and Navigate back
    this.isCartModalOpen = false;
    this.cart = [];
    this.showToast('Order sent to Kitchen!', 'success');
    this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
  }

  cartAnimation = false;

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
