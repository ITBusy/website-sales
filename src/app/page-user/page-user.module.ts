import {NgModule} from '@angular/core';
import {NgxPaginationModule} from "ngx-pagination";
import {CommonModule} from "@angular/common";

import {PageUserRoutingModule} from './page-user-routing.module';
import {PageUserComponent} from './page-user.component';
import {FooterComponent} from './component/footer/footer.component';
import {HeaderComponent} from './component/header/header.component';
import {ContactComponent} from './pages/contact/contact.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {DetailComponent} from './pages/detail/detail.component';
import {HomeComponent} from './pages/home/home.component';
import {CategoryComponent} from './pages/category/category.component';
import {CartComponent} from './pages/cart/cart.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {SliderComponent} from './component/slider/slider.component';
import {AbountComponent} from './pages/abount/abount.component';
import {CommentComponent} from './component/comment/comment.component';
import {CutChainPipe} from './pipe/cut-chain.pipe';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SortPipe } from './pipe/sort.pipe';


@NgModule({
  declarations: [
    PageUserComponent,
    FooterComponent,
    HeaderComponent,
    ContactComponent,
    ProfileComponent,
    DetailComponent,
    HomeComponent,
    CategoryComponent,
    CartComponent,
    CheckoutComponent,
    SliderComponent,
    AbountComponent,
    CommentComponent,
    CutChainPipe,
    SortPipe
  ],
  imports: [
    CommonModule,
    PageUserRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [PageUserComponent]
})
export class PageUserModule {
}
