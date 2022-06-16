import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {LoginService} from 'src/app/services/login.service';
import {OrderDetailsInterface} from "../../../entity/entity";
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormGroupService} from "../../../services/form-group.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  disable: number;
  public orderDetails: OrderDetailsInterface[] = [];
  @ViewChild("VAT") VAT: ElementRef;
  @ViewChild("amount") amount: ElementRef;
  @ViewChild("total") total: ElementRef;
  @ViewChild("shipper") shipper: ElementRef;
  public orderForm: FormGroup;
  public submitted: boolean = true;

  constructor(private _cartService: CartService,
              private _loginService: LoginService,
              private _fb: FormBuilder,
              public _formService: FormGroupService) {
  }

  ngOnInit(): void {
    this.findAllOrderDetails();
    this.orderForm = this._fb.group({
      oid: new FormControl('', Validators.required),
      deliveryAddress: new FormControl('', Validators.required),
      recipientName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
    })
  }


  public plus(e: any, orderDetailsId: number, inputValue) {
    inputValue.value = Number.parseInt(inputValue.value) + 1;
    // e.path[3].children[1].value = Number(e.path[3].children[1].value) + 1;
    // this.disable = e.path[3].children[1].value;
    // this.updateOrderDetail(e.path[3].children[1].value, orderDetailsId);
    this.updateOrderDetail(inputValue.value, orderDetailsId);
  }

  public minus(e: any, orderDetailsId: number, inputValue) {
    inputValue.value = Number.parseInt(inputValue.value) - 1;
    // e.path[3].children[1].value = Number(e.path[3].children[1].value) - 1;
    // this.disable = e.path[3].children[1].value;
    // this.updateOrderDetail(e.path[3].children[1].value, orderDetailsId);
    this.updateOrderDetail(inputValue.value, orderDetailsId);
  }

  public keydownEvent($event: KeyboardEvent) {
    return !(!(
        ($event.keyCode > 95 && $event.keyCode < 106) ||
        ($event.keyCode > 47 && $event.keyCode < 58) ||
        $event.keyCode === 8
      ) ||
      ($event.shiftKey && $event.keyCode >= 48 && $event.keyCode <= 57));
  }

  public findAllOrderDetails() {
    this._cartService.findAllOrderDetails(this._loginService.getUser().username).subscribe(
      (result: OrderDetailsInterface[]) => {
        this.orderDetails = result;
        this.getTotal(this.orderDetails[0]?.orderDetailsId);
        this.orderForm.controls['oid'].setValue(this.orderDetails[0]?.order?.oid)
      });
  }

  public getTotal(orderDetailsID: number) {
    this._cartService.getAmount(orderDetailsID).subscribe((result) => {
      let amount = result + ((result / 100) * 10) + 300000;
      this.VAT.nativeElement.innerText = ((result / 100) * 10).toLocaleString('vn', {
        style: undefined,
        currency: 'VND'
      });
      this.amount.nativeElement.innerText = amount.toLocaleString('vn', {
        style: undefined,
        currency: 'VND'
      }) + ' VND';
      let t = (((result / 100) * 10) + result) / 100 * 0.2;
      this.shipper.nativeElement.innerText = t.toLocaleString('vn', {
        style: undefined,
        currency: 'VND'
      });
      this.total.nativeElement.innerText = result.toLocaleString('vn', {
        style: undefined,
        currency: 'VND'
      });
    });
  }

  public updateOrderDetail(quantity: number, orderDetailID: number) {
    this._cartService.findByOrderDetailID(orderDetailID).subscribe(
      (result: OrderDetailsInterface) => {
        result.quantity = quantity;
        this._cartService.updateOrderDetail(this.getDataOrderDetail(result)).subscribe(() => this.findAllOrderDetails())
      }
    )
  }

  public getDataOrderDetail(orderDetail: OrderDetailsInterface): OrderDetailsInterface {
    return {
      orderDetailsId: orderDetail.orderDetailsId,
      order: null,
      product: null,
      price: 0,
      quantity: orderDetail.quantity
    }
  }

  updateQuantity(e: any, orderDetailsId) {
    if (e.target.value == undefined || e.target.value == '' || e.target.value == null) {
      this.updateOrderDetail(0, orderDetailsId);
    } else {
      this.updateOrderDetail(e.target.value, orderDetailsId);
    }

  }

  deleteById(orderDetailsId: number) {
    this._cartService.deleteById(orderDetailsId).subscribe((result) => {
      Swal.fire({
        position: 'top-end',
        heightAuto: false,
        customClass: 'swal-height',
        html: `<small>
                  Đã Xoá Sản Phẩm
                  <small style="color: #59ab6e; font-weight: bold">${result.data.name}</small>
                  Khỏi Giỏ Hàng
                </small>`,
        showConfirmButton: false,
        width: 400,
        timer: 2500
      }).then(() => this.findAllOrderDetails());
    });
  }

  public getDataOrder(notes: string): any {
    let t = Number.parseInt(this.total.nativeElement.innerText.replaceAll(',', '')) + Number.parseInt(this.VAT.nativeElement.innerText.replaceAll(',', ''))
    return {
      oid: this.orderForm.get('oid')?.value,
      deliveryAddress: this.orderForm.get('deliveryAddress')?.value.trim(),
      recipientName: this.orderForm.get('recipientName')?.value.trim(),
      phoneNumber: this.orderForm.get('phoneNumber')?.value.trim(),
      // deliveryDate: new Date(),
      status: 'Waiting for confirmation',
      total: t,
      notes: notes
    }
  }

  updateOrder() {
    if (this.orderForm.invalid) {
      this.submitted = false;
      return;
    } else {
      Swal.fire({
        input: 'textarea',
        inputLabel: 'Yều Cầu',
        inputPlaceholder: 'Type your message here...',
        inputAttributes: {
          'aria-label': 'Type your message here'
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this._cartService.updateOrder(this.getDataOrder(result.value)).subscribe((r) => {
            Swal.fire({
              imageUrl: './assets/img/OIP.jpg',
              imageHeight: 120,
              text: 'Cảm ơn bạn đã tiếp tục tin tưởng mà bạn đã mua hàng của chúng tôi.' +
                ' Thành công của chúng tôi dựa vào hài lòng và sự ủng hộ của những khách hàng như bạn.'
            }).then(() => {
              console.log(r.data)
              this.orderForm.reset();
              this.findAllOrderDetails();
            });
          }, error => alert(error));
        }
      });
    }
  }
}
