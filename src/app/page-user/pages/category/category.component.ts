import {Component, OnInit} from '@angular/core';
import {ManufacturerService} from 'src/app/services/manufacturer.service';
import {ProductService} from 'src/app/services/product.service';
import {ManufacturerInterface, OrderInterface, ProductDtoInterface} from "../../../entity/entity";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from 'src/app/services/cart.service';
import {LoginService} from 'src/app/services/login.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public manufacturer: ManufacturerInterface[] = [];
  public products: ProductDtoInterface[] = [];
  public manufacturerID: number;
  public page: number;
  public search: string;


  constructor(private _manufacturerService: ManufacturerService,
              private _productService: ProductService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _loginService: LoginService,
              private _cartService: CartService) {
  }

  ngOnInit(): void {
    this.manufacturerID = this._activatedRoute.snapshot.queryParams['manufacturer'];
    if (this.manufacturerID === undefined) {
      this.getAllProducts();
    } else {
      this.findProductByManufacturerId(this.manufacturerID);
    }
    this.getAllManufacturers();


  }

  public getAllManufacturers() {
    this._manufacturerService.findAllManufacturer().subscribe((result: ManufacturerInterface[]) => {
      this.manufacturer = result
    });
  }

  // public findProductByManufacturerId() {
  //   this._router.queryParams.subscribe((param: any) => {
  //     this._productService.findProductByManufacturerId(param.manufacturer).subscribe((result: ProductDtoInterface[]) => {
  //       this.products = result;
  //     });
  //   });

  public getAllProducts() {
    return this._productService.findAllProducts().subscribe((result: ProductDtoInterface[]) => {
      this.products = result.filter(r => r.active)
    });
  }

  public findProductByManufacturerId(manufacturerID: number) {
    this._productService.findProductByManufacturerId(manufacturerID).subscribe((result: ProductDtoInterface[]) => {
      if (result) {
        this.products = result.filter(r => r.active);
        this.page = 1;
      }
    });
  }

  addCart(pid: number) {
    this._productService.findProductById(pid).subscribe((result: ProductDtoInterface) => {
      this._cartService.createOrder(this.getDataOrder(result)).subscribe((r) => {
        Swal.fire({
          position: 'top-end',
          heightAuto: false,
          customClass: 'swal-height',
          html: `<small>
                  Đã Thêm Sản Phẩm
                  <small style="color: #59ab6e; font-weight: bold">${result.name}</small>
                  Vào Giỏ Hàng
                </small>`,
          showConfirmButton: false,
          width: 400,
          timer: 2500
        }).then();
      });
    });
  }

  getDataOrder(product: ProductDtoInterface): OrderInterface {
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
      product: product,
      quantity: 1
    }
  }

  openProductDetail(pid: number) {
    this._router.navigate([
        '/zayShopping/detail'],
      {queryParams: {productID: pid}}
    );

  }

  onPage($event: number) {
    this.page = $event;
    window.scrollTo(0, 0);
  }
}
