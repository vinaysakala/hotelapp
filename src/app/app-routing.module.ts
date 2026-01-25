import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../app/guards/auth-guard';

const routes: Routes = [
  {
    // 1. Define the redirect for the empty path
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/masters/category/category.module').then(m => m.CategoryPageModule)
  },
  {
    path: 'menu-items',
    loadChildren: () => import('./pages/masters/menu-items/menu-items.module').then(m => m.MenuItemsPageModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('./pages/masters/tables/tables.module').then(m => m.TablesPageModule)
  },
  {
    path: 'staff',
    loadChildren: () => import('./pages/masters/staff/staff.module').then(m => m.StaffPageModule)
  },
  {
    path: 'order-entry',
    loadChildren: () => import('./pages/order-entry/order-entry.module').then(m => m.OrderEntryPageModule)
  },
  {
    path: 'kds',
    loadChildren: () => import('./pages/kds/kds.module').then(m => m.KdsPageModule)
  },
  {
    path: 'billing',
    loadChildren: () => import('./pages/billing/billing.module').then(m => m.BillingPageModule)
  },
  {
    path: 'role',
    loadChildren: () => import('./pages/masters/role/role.module').then(m => m.RolePageModule)
  },
  {
    path: 'permission/:id',
    loadChildren: () => import('./pages/masters/permission/permission.module').then( m => m.PermissionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
