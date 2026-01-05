import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuItemsPageRoutingModule } from './menu-items-routing.module';

import { MenuItemsPage } from './menu-items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuItemsPageRoutingModule
  ],
  declarations: [MenuItemsPage]
})
export class MenuItemsPageModule {}
