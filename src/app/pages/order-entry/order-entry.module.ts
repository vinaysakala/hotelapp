import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderEntryPageRoutingModule } from './order-entry-routing.module';

import { OrderEntryPage } from './order-entry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderEntryPageRoutingModule
  ],
  declarations: [OrderEntryPage]
})
export class OrderEntryPageModule {}
