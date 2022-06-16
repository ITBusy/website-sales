import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from 'src/app/services/product.service';
import {OrderInterface, ProductDtoInterface} from "../../../entity/entity";
import {CartService} from "../../../services/cart.service";
import {LoginService} from "../../../services/login.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public displayImage: string;
  public indexFirst: number = 0;
  public indexLast: number = 3;
  public productDetail: ProductDtoInterface;
  public gateway: any[];
  private productID: number;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _productService: ProductService,
              private _orderService: CartService,
              private _loginService: LoginService) {
  }

  ngOnInit(): void {
    this.productID = this._activatedRoute.snapshot.queryParams['productID'];
    this.getAllProduct(this.productID);
  }

  minus(valueInput: any) {
    if (valueInput.value > 1) {
      valueInput.value = Number(valueInput.value) - 1;
    } else {
      valueInput.value = 1;
    }
  }

  plus(valueInput: any) {
    valueInput.value = Number(valueInput.value) + 1;
  }

  public getAllProduct(productID: number) {
    this._productService.findProductById(productID).subscribe((result: ProductDtoInterface) => {
      this.productDetail = result;
      this.displayImage = result.imageUrl[0].imageUrl;
      this.gateway = result.gateway.split(';');
    });
  }

  nextImage() {
    this.indexFirst = this.indexLast;
    if (this.indexLast >= this.productDetail.imageUrl.length) {
      this.indexLast = this.productDetail.imageUrl.length;
      this.indexFirst = this.productDetail.imageUrl.length - 3;
      return;
    }
    this.indexLast = this.indexLast + 3;
  }

  previousImage() {
    if (this.indexFirst <= 0) {
      this.indexFirst = 0;
      return;
    }
    this.indexLast = this.indexFirst;
    this.indexFirst = this.indexLast - 3;
  }

  displayImg(imageUrl: string) {
    this.displayImage = imageUrl;
  }

  addToCart(value: string) {
    this.getDataToCart(Number(value));
  }

  byToProduct(value: string) {
    this.getDataToCart(Number(value));
    this._router.navigate(['/zayShopping/cart']).then(() => window.location.reload());
  }

  getDataToCart(value: number) {
    this._orderService.createOrder(this.getDataOrder(value)).subscribe(() => {
      Swal.fire({
        position: 'top-end',
        heightAuto: false,
        customClass: 'swal-height',
        html: `<small>
                  Đã Thêm Sản Phẩm
                  <small style="color: #59ab6e; font-weight: bold">${this.productDetail.name}</small>
                  Vào Giỏ Hàng
                </small>`,
        showConfirmButton: false,
        width: 400,
        timer: 2500
      }).then();
    });
  }

  getDataOrder(value: number): OrderInterface {
    return {
      deliveryAddress: null,
      notes: '',
      recipientName: '',
      phoneNumber: '',
      orderDate: new Date(),
      deliveryDate: null,
      recipientDate: null,
      status: 'Cart',
      total: 0,
      userOrder: this._loginService.getUser(),
      product: this.productDetail,
      quantity: value
    }
  }
}
