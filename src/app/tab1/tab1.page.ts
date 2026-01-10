import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  tables: any[] = [];

  constructor(
    private firestore: Firestore,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const tableRef = collection(this.firestore, 'tables');
    collectionData(tableRef, { idField: 'id' }).subscribe(res => {
      this.tables = res;
    });
  }

  getCount(status: string) {
    return this.tables.filter(t => t.status === status).length;
  }

  handleTableClick(table: any) {
    // Navigate to the Order Entry page and pass the table ID
    this.navCtrl.navigateForward(['/order-entry'], {
      queryParams: { 
        tableId: table.id, 
        tableName: table.tableName 
      }
    });
  } 
}
