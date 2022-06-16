import {Component, OnInit} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {LoginService} from 'src/app/services/login.service';
import {ShipperService} from 'src/app/services/shipper.service';
import {ShipperOrderDtoInterface} from "../../../entity/entity";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public shipperOrder: ShipperOrderDtoInterface[] = [];

  constructor(private _shipperService: ShipperService,
              private _loginService: LoginService,
              private _cartService: CartService) {
  }

  ngOnInit(): void {
    this.findAllByUsername();
  }

  public findAllByUsername() {
    this._shipperService.findAllByUsername(this._loginService.getUser().username).subscribe(
      (result: ShipperOrderDtoInterface[]) => {
        this.shipperOrder = result;
      });
  }

  updateOrderByStatusCompleted(oid: number) {
    this._cartService.updateOrderByStatusCompleted(oid).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          text: 'Chúc mừng bạn đã hoàn thành đơn hàng',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          showLoaderOnConfirm: false
        }).then(() => {
          this.findAllByUsername();
        });
      }
    );
  }
}
