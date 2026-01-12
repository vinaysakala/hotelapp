import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { NavController, ActionSheetController } from '@ionic/angular'; // Added ActionSheetController

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
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController 
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

  async handleTableClick(table: any) {
    if (table.status === 'Occupied') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: `Table ${table.tableName}`,
        subHeader: 'Select Action',
        mode: 'ios',
        buttons: [
          {
            text: 'Add / View Items',
            icon: 'restaurant-outline',
            handler: () => {
              this.goToOrderEntry(table);
            }
          },
          {
            text: 'Generate Bill',
            icon: 'receipt-outline',
            cssClass: 'billing-button',
            handler: () => {
              this.goToBilling(table);
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    } else {
      this.goToOrderEntry(table);
    }
  }

  private goToOrderEntry(table: any) {
    this.navCtrl.navigateForward(['/order-entry'], {
      queryParams: { 
        tableId: table.id, 
        tableName: table.tableName 
      }
    });
  }

  private goToBilling(table: any) {
    this.navCtrl.navigateForward(['/billing'], {
      queryParams: { 
        tableId: table.id, 
        tableName: table.tableName 
      }
    });
  }
}