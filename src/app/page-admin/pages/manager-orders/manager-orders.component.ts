import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {OrderDtoInterface, ShipperOrderInterface, UserInterface} from "../../../entity/entity";
import {UsersService} from "../../../services/users.service";
import Swal from "sweetalert2";
import {ShipperService} from "../../../services/shipper.service";

@Component({
  selector: 'app-manager-orders',
  templateUrl: './manager-orders.component.html',
  styleUrls: ['./manager-orders.component.css']
})
export class ManagerOrdersComponent implements OnInit {
  public orderList: OrderDtoInterface[] = [];

  public order: OrderDtoInterface;
  public shipper: UserInterface[] = [];
  public userID: any;
  public orderShipper: any;
  public nameShipper: string;
  @ViewChild('closeAllot') closeAllot: ElementRef;

  constructor(private _cartService: CartService,
              private _userService: UsersService,
              private _shipperService: ShipperService) {
  }

  ngOnInit(): void {
    this.findAll();

  }

  public findAll(): void {
    this._cartService.findAllOrder().subscribe(
      (result: OrderDtoInterface[]) => {
        this.orderList = result;
      }
    )
  }

  public inFoDetail(oid: number) {
    return this.orderList.filter((e) => {
      if (e.oid == oid) {
        return e;
      }
      return null;
    })[0]
  }

  infoBtn(oid: number) {
    this.order = this.inFoDetail(oid);
    this.getNameShipper(oid);
    console.log(this.order)
  }

  public findAllShippers() {
    this._userService.loadShipper().subscribe((result: UserInterface[]) => {
      this.shipper = result;
      this.userID = result[0]?.id;
    });
  }

  allotDelivery(item: OrderDtoInterface) {
    this.findAllShippers();
    this.orderShipper = item;
  }

  allotShipper() {
    this._userService.getUserById(this.userID).subscribe((user) => {
      this._cartService.updateStatusAndCreateShipperOrder(this.getDataShipperOrder(user.data)).subscribe(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          text: 'Đã Phân Công Shipper Thành Công',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.orderShipper = null;
          this.findAll();
          this.closeAllot.nativeElement.click();
        });
      });
    });
  }

  getDataShipperOrder(shipperUser: UserInterface): ShipperOrderInterface {
    return {
      shipperOrderId: undefined,
      order: this.orderShipper,
      shipperUser: shipperUser,
      total: this.orderShipper?.total / 100 * 0.2,
      applicationTime: new Date(),
      reasonRTGs: ''
    }
  }

  public getNameShipper(orderId: number) {
    this._shipperService.findShipperByOrderId(orderId).subscribe(
      (result: ShipperOrderInterface) => {
        this.nameShipper = result?.shipperUser?.fullName;
        console.log(this.nameShipper);
      });
  }
}
