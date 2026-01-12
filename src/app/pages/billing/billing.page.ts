import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
  standalone:false
})
export class BillingPage implements OnInit {
  tableId: string = '';
  tableName: string = '';
  orderItems: any[] = [];
  subtotal = 0;
  tax = 0;
  grandTotal = 0;
  paymentMode = 'Cash';
  orderDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tableId = params['tableId'];
      this.tableName = params['tableName'];
      this.fetchActiveOrder();
    });
  }

  async fetchActiveOrder() {
    const ordersRef = collection(this.firestore, 'liveOrders');
    const q = query(ordersRef, where('tableId', '==', this.tableId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      this.orderItems = data['items'];
      this.calculateTotals();
    });
  }

  calculateTotals() {
    this.subtotal = this.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    this.tax = Math.round(this.subtotal * 0.05); // 5% GST
    this.grandTotal = this.subtotal + this.tax;
  }

  async settleBill() {
    // 1. Save to History
    await addDoc(collection(this.firestore, 'orderHistory'), {
      tableName: this.tableName,
      items: this.orderItems,
      total: this.grandTotal,
      paymentMode: this.paymentMode,
      completedAt: new Date()
    });

    // 2. Clear Table Status
    const tableRef = doc(this.firestore, `tables/${this.tableId}`);
    await updateDoc(tableRef, { status: 'Available', currentTotal: 0 });

    // 3. Delete from Live Orders
    const ordersRef = collection(this.firestore, 'liveOrders');
    const q = query(ordersRef, where('tableId', '==', this.tableId));
    const snap = await getDocs(q);
    snap.forEach(async (d) => await deleteDoc(doc(this.firestore, `liveOrders/${d.id}`)));

    const toast = await this.toastCtrl.create({ message: 'Table Cleared!', duration: 2000, color: 'success' });
    toast.present();
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}
