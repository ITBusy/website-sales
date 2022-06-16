import {Component, OnInit} from '@angular/core';
import {LoginService} from 'src/app/services/login.service';
import {CartService} from "../../../services/cart.service";
import {OrderDtoInterface} from "../../../entity/entity";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public orderList: OrderDtoInterface[] = [];
  public orderCompletedList: OrderDtoInterface[] = [];
  public orderCancelledList: OrderDtoInterface[] = [];

  constructor(private _cartService: CartService,
              private _loginService: LoginService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.findAllOrderByUsernameAndStatusEqualsCompleted();
    this.findAllOrderByUsernameAndStatusEqualsCancelled();
  }

  public findAll() {
    this._cartService.findAllOrderByUsernameAndStatusOtherCart(this._loginService.getUser().username)
      .subscribe((result: OrderDtoInterface[]) => {
        this.orderList = result;
      });
  }

  public findAllOrderByUsernameAndStatusEqualsCompleted() {
    this._cartService.findAllOrderByUsernameAndStatus(this._loginService.getUser().username, "Completed").subscribe(
      (result: OrderDtoInterface[]) => {
        this.orderCompletedList = result;
      }
    );
  }

  public findAllOrderByUsernameAndStatusEqualsCancelled() {
    this._cartService.findAllOrderByUsernameAndStatus(this._loginService.getUser().username, "Cancelled orders").subscribe(
      (result: OrderDtoInterface[]) => {
        this.orderCancelledList = result;
      }
    );
  }

  updateStatus(order: OrderDtoInterface) {
    order.status = "Cancelled orders";
    order.recipientDate = new Date();
    this._cartService.updateOrderByStatusCancelled(order).subscribe((result: OrderDtoInterface) => {
      this.findAll();
      this.findAllOrderByUsernameAndStatusEqualsCompleted();
      this.findAllOrderByUsernameAndStatusEqualsCancelled();
    });
  }
}
