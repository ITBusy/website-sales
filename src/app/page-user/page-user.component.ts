import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {CartService} from "../services/cart.service";

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.css']
})
export class PageUserComponent implements OnInit {
  public count_cart: number;

  constructor(private _loginService: LoginService,
              private _cartService: CartService) {
  }


  ngOnInit(): void {
  }

  public getCountCarter() {
    this._cartService.countCart(this._loginService.getUser().username).subscribe((result) => {
      this.count_cart = result;
    });
  }
}
