import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireModule} from '@angular/fire/compat';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PageAdminRoutingModule} from './page-admin-routing.module';
import {PageAdminComponent} from './page-admin.component';
import {HeaderComponent} from './component/header/header.component';
import {MenuLeftComponent} from './component/menu-left/menu-left.component';
import {ManagerUserComponent} from './pages/manager-user/manager-user.component';
import {ManagerCategoryComponent} from './pages/manager-category/manager-category.component';
import {PersonInfoComponent} from './pages/person-info/person-info.component';
import {StatisticsComponent} from './pages/statistics/statistics.component';
import {ManagerManufacturerComponent} from './pages/manager-manufacturer/manager-manufacturer.component';
import {ManagerOrdersComponent} from './pages/manager-orders/manager-orders.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {SilderComponent} from './pages/silder/silder.component';
import {environment} from 'src/environments/environment.prod';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ManagerProductComponent} from "./pages/manager-product/manager-product.component";
import {CutChainPipe} from './pipe/cut-chain.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18N/', '.json');
}

@NgModule({
  declarations: [
    PageAdminComponent,
    HeaderComponent,
    MenuLeftComponent,
    ManagerUserComponent,
    ManagerProductComponent,
    ManagerCategoryComponent,
    PersonInfoComponent,
    StatisticsComponent,
    ManagerManufacturerComponent,
    ManagerOrdersComponent,
    DashboardComponent,
    SilderComponent,
    CutChainPipe,
  ],
  imports: [
    CommonModule,
    PageAdminRoutingModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
      }
    )
  ],
  providers: [HttpClient],
  exports: [
    MenuLeftComponent,
    HeaderComponent
  ]
})
export class PageAdminModule {
}
