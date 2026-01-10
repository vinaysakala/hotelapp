import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, where, collectionData, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-kds',
  templateUrl: './kds.page.html',
  styleUrls: ['./kds.page.scss'],
  standalone:false
})
export class KdsPage implements OnInit {
  activeOrders: any[] = [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const ordersRef = collection(this.firestore, 'liveOrders');
    // Only show orders that are not yet "Ready"
    const q = query(ordersRef, where('status', '==', 'Pending'));
    
    collectionData(q, { idField: 'id' }).subscribe(res => {
      // Sort by oldest first so Chef handles first-in-first-out
      this.activeOrders = res.sort((a: any, b: any) => a.createdAt - b.createdAt);
    });
  }

  getTimeDifference(createdAt: any) {
    if (!createdAt) return 0;
    const now = new Date().getTime();
    const created = createdAt.toMillis();
    return Math.floor((now - created) / 60000);
  }

  async completeOrder(order: any) {
    const docRef = doc(this.firestore, `liveOrders/${order.id}`);
    await updateDoc(docRef, { status: 'Ready' });
    // Note: You could also trigger a notification to the waiter here!
  }

}
