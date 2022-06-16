import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageUserComponent} from './page-user.component';
import {AbountComponent} from './pages/abount/abount.component';
import {CartComponent} from './pages/cart/cart.component';
import {CategoryComponent} from './pages/category/category.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {ContactComponent} from './pages/contact/contact.component';
import {DetailComponent} from './pages/detail/detail.component';
import {HomeComponent} from './pages/home/home.component';
import {ProfileComponent} from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: PageUserComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
      {
        path: 'about',
        component: AbountComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'detail',
        component: DetailComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageUserRoutingModule {
}
