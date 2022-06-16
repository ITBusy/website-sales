import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageShipperRoutingModule} from './page-shipper-routing.module';
import {PageShipperComponent} from './page-shipper.component';
import {HeaderComponent} from "./component/header/header.component";
import {MenuLeftComponent} from "./component/menu-left/menu-left.component";
import {CartComponent} from './page/cart/cart.component';
import {ProfileComponent} from './page/profile/profile.component';
import {StatisticsComponent} from './page/statistics/statistics.component';


@NgModule({
  declarations: [
    PageShipperComponent,
    HeaderComponent,
    MenuLeftComponent,
    CartComponent,
    ProfileComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    PageShipperRoutingModule,
  ],
  exports: [PageShipperComponent]
})
export class PageShipperModule {
}
