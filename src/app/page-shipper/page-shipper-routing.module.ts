import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CartComponent} from './page/cart/cart.component';
import {ProfileComponent} from "./page/profile/profile.component";
import {PageShipperComponent} from "./page-shipper.component";
import {StatisticsComponent} from "./page/statistics/statistics.component";

const routes: Routes = [
  {
    path: '',
    component: PageShipperComponent,
    children: [
      {
        path: 'cart', component: CartComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'statistics', component: StatisticsComponent
      },
      {
        path: '', redirectTo: '/zayShopping/shipper/cart', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageShipperRoutingModule {
}
