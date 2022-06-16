import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class ShipperGuard implements CanActivate {
  constructor(private _router: Router, private _login: LoginService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._login.isLoggedIn() && this._login.getUserRoles() === 'SHIPPER') {
      return true;
    } else {
      this._router.navigate(['/account']).then();
      return false;
    }
  }

}
