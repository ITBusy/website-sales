import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AccountComponent} from './account.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {SignWithComponent} from './component/sign-with/sign-with.component';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../../environments/environment.prod";

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: '',
        redirectTo: '/account/login',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    SignWithComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  exports: [AccountComponent, RouterModule],
})
export class AccountModule {
}
