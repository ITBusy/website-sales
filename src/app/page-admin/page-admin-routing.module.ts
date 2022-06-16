import { ManagerManufacturerComponent } from './pages/manager-manufacturer/manager-manufacturer.component';
import { PageAdminComponent } from './page-admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManagerCategoryComponent } from './pages/manager-category/manager-category.component';
import { ManagerProductComponent } from './pages/manager-product/manager-product.component';
import { ManagerUserComponent } from './pages/manager-user/manager-user.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { ManagerOrdersComponent } from './pages/manager-orders/manager-orders.component';
import { PersonInfoComponent } from './pages/person-info/person-info.component';
import { SilderComponent } from './pages/silder/silder.component';

const routes: Routes = [
  {
    path: '',
    component: PageAdminComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'Mcategories', component: ManagerCategoryComponent },
      { path: 'Morders', component: ManagerOrdersComponent },
      { path: 'Mproduct', component: ManagerProductComponent },
      { path: 'personInfo', component: PersonInfoComponent },
      { path: 'Muser', component: ManagerUserComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'Mmanufacturer', component: ManagerManufacturerComponent },
      { path: 'silder', component: SilderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageAdminRoutingModule {
}
