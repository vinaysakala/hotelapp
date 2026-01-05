import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuItemsPage } from './menu-items.page';

const routes: Routes = [
  {
    path: '',
    component: MenuItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuItemsPageRoutingModule {}
