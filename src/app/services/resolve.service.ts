import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot,} from '@angular/router';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ResolveService implements Resolve<any> {
  constructor(private _login: LoginService, private _router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._login.isLoggedIn() && this._login.getUserRoles() === 'ADMIN') {
      this._router.navigate(['zayShopping/admin']);
    } else if (
      this._login.isLoggedIn() &&
      this._login.getUserRoles() === 'SHIPPER'
    ) {
      this._router.navigate(['zayShopping/shipper']);
    } else {
      this._router.navigate(['zayShopping']);
    }
  }
}
