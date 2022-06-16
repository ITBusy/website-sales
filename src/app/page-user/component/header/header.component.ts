import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import {CartService} from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any;
  public count_cart: number;

  constructor(public _login: LoginService,
              private _router: Router,
              private _cartService: CartService) {
  }

  ngOnInit(): void {
    this.user = this._login.getUser();
  }

  logout() {
    this._login.logout();
    // window.location.reload();
    this._router.navigate(['account/login']).then();
  }
}
