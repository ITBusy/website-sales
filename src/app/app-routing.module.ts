import {ModuleWithProviders, NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ResolveService} from "./services/resolve.service";
import {AuthGuard} from "./services/auth.guard";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ShipperGuard} from "./services/shipper.guard";

const routes: Routes = [
  {path: '', resolve: {ResolveService}, children: []},
  {
    path: 'zayShopping',
    loadChildren: () =>
      import('./page-user/page-user.module').then((m) => m.PageUserModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'zayShopping/admin',
    loadChildren: () =>
      import('./page-admin/page-admin-routing.module').then(
        (m) => m.PageAdminRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'zayShopping/shipper',
    loadChildren: () =>
      import('./page-shipper/page-shipper.module').then(
        (m) => m.PageShipperModule
      ),
    canActivate: [ShipperGuard],
  },
  {path: '**', component: NotFoundComponent},
];
const Routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules});

@NgModule({
  imports: [Routing],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
