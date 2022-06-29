import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CartService} from 'src/app/services/cart.service';
import {LoginService} from 'src/app/services/login.service';
import {OrderDetailsInterface} from "../../../entity/entity";
import Swal from "sweetalert2";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormGroupService} from "../../../services/form-group.service";
import {SendMailService} from "../../../services/send-mail.service";

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
  public formLoading: boolean = false;

  constructor(private _cartService: CartService,
              private _loginService: LoginService,
              private _fb: FormBuilder,
              public _formService: FormGroupService,
              private _sendEmailService: SendMailService) {
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
                  <small style="color: #59ab6e; font-weight: bold">${result.data.product.name}</small>
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
            }).then((result) => {
              if (result.isConfirmed) {
                this.formLoading = true;
                let sendMailOrder = {
                  toMail: this._loginService.getUser().email,
                  contentHtml: this.template(this.orderDetails)
                }
                this._sendEmailService.sendMailOrder(sendMailOrder).subscribe(() => {
                  this.orderForm.reset();
                  this.findAllOrderDetails();
                  this.formLoading = false;
                }, (error) => alert(error))
              }
            });
          }, error => alert(error));
        }
      });
    }
  }

  public template(products: any[]) {
    return `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
<style>
    /* CONFIG STYLES Please do not delete and edit CSS styles below */
/* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
#outlook a {
    padding: 0;
}

.ExternalClass {
    width: 100%;
}

.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
    line-height: 100%;
}

.es-button {
    mso-style-priority: 100 !important;
    text-decoration: none !important;
}

a[x-apple-data-detectors] {
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
}

.es-desk-hidden {
    display: none;
    float: left;
    overflow: hidden;
    width: 0;
    max-height: 0;
    line-height: 0;
    mso-hide: all;
}

[data-ogsb] .es-button {
    border-width: 0 !important;
    padding: 10px 20px 10px 20px !important;
}

/*
END OF IMPORTANT
*/
s {
    text-decoration: line-through;
}

html,
body {
    width: 100%;
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
}

table {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
}

table td,
html,
body,
.es-wrapper {
    padding: 0;
    Margin: 0;
}

.es-content,
.es-header,
.es-footer {
    table-layout: fixed !important;
    width: 100%;
}

img {
    display: block;
    border: 0;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
}

table tr {
    border-collapse: collapse;
}

p,
hr {
    Margin: 0;
}

h1,
h2,
h3,
h4,
h5 {
    Margin: 0;
    line-height: 120%;
    mso-line-height-rule: exactly;
    font-family: 'trebuchet ms', helvetica, sans-serif;
}

p,
ul li,
ol li,
a {
    -webkit-text-size-adjust: none;
    -ms-text-size-adjust: none;
    mso-line-height-rule: exactly;
}

.es-left {
    float: left;
}

.es-right {
    float: right;
}

.es-p5 {
    padding: 5px;
}

.es-p5t {
    padding-top: 5px;
}

.es-p5b {
    padding-bottom: 5px;
}

.es-p5l {
    padding-left: 5px;
}

.es-p5r {
    padding-right: 5px;
}

.es-p10 {
    padding: 10px;
}

.es-p10t {
    padding-top: 10px;
}

.es-p10b {
    padding-bottom: 10px;
}

.es-p10l {
    padding-left: 10px;
}

.es-p10r {
    padding-right: 10px;
}

.es-p15 {
    padding: 15px;
}

.es-p15t {
    padding-top: 15px;
}

.es-p15b {
    padding-bottom: 15px;
}

.es-p15l {
    padding-left: 15px;
}

.es-p15r {
    padding-right: 15px;
}

.es-p20 {
    padding: 20px;
}

.es-p20t {
    padding-top: 20px;
}

.es-p20b {
    padding-bottom: 20px;
}

.es-p20l {
    padding-left: 20px;
}

.es-p20r {
    padding-right: 20px;
}

.es-p25 {
    padding: 25px;
}

.es-p25t {
    padding-top: 25px;
}

.es-p25b {
    padding-bottom: 25px;
}

.es-p25l {
    padding-left: 25px;
}

.es-p25r {
    padding-right: 25px;
}

.es-p30 {
    padding: 30px;
}

.es-p30t {
    padding-top: 30px;
}

.es-p30b {
    padding-bottom: 30px;
}

.es-p30l {
    padding-left: 30px;
}

.es-p30r {
    padding-right: 30px;
}

.es-p35 {
    padding: 35px;
}

.es-p35t {
    padding-top: 35px;
}

.es-p35b {
    padding-bottom: 35px;
}

.es-p35l {
    padding-left: 35px;
}

.es-p35r {
    padding-right: 35px;
}

.es-p40 {
    padding: 40px;
}

.es-p40t {
    padding-top: 40px;
}

.es-p40b {
    padding-bottom: 40px;
}

.es-p40l {
    padding-left: 40px;
}

.es-p40r {
    padding-right: 40px;
}

.es-menu td {
    border: 0;
}

.es-menu td a img {
    display: inline-block !important;
}

/* END CONFIG STYLES */
a {
    text-decoration: underline;
}

p,
ul li,
ol li {
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
    line-height: 150%;
}

ul li,
ol li {
    Margin-bottom: 15px;
    margin-left: 0;
}

.es-menu td a {
    text-decoration: none;
    display: block;
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
}

.es-wrapper {
    width: 100%;
    height: 100%;
    background-image: ;
    background-repeat: repeat;
    background-position: center top;
}

.es-wrapper-color {
    background-color: #efefef;
}

.es-header {
    background-color: transparent;
    background-image: ;
    background-repeat: repeat;
    background-position: center top;
}

.es-header-body {
    background-color: #fef5e4;
}

.es-header-body p,
.es-header-body ul li,
.es-header-body ol li {
    color: #999999;
    font-size: 14px;
}

.es-header-body a {
    color: #999999;
    font-size: 14px;
}

.es-content-body {
    background-color: #ffffff;
}

.es-content-body p,
.es-content-body ul li,
.es-content-body ol li {
    color: #333333;
    font-size: 14px;
}

.es-content-body a {
    color: #d48344;
    font-size: 14px;
}

.es-footer {
    background-color: transparent;
    background-image: ;
    background-repeat: repeat;
    background-position: center top;
}

.es-footer-body {
    background-color: #fef5e4;
}

.es-footer-body p,
.es-footer-body ul li,
.es-footer-body ol li {
    color: #333333;
    font-size: 14px;
}

.es-footer-body a {
    color: #333333;
    font-size: 14px;
}

.es-infoblock,
.es-infoblock p,
.es-infoblock ul li,
.es-infoblock ol li {
    line-height: 120%;
    font-size: 12px;
    color: #cccccc;
}

.es-infoblock a {
    font-size: 12px;
    color: #cccccc;
}

h1 {
    font-size: 30px;
    font-style: normal;
    font-weight: normal;
    color: #333333;
}

h2 {
    font-size: 28px;
    font-style: normal;
    font-weight: normal;
    color: #333333;
}

h3 {
    font-size: 24px;
    font-style: normal;
    font-weight: normal;
    color: #333333;
}

.es-header-body h1 a,
.es-content-body h1 a,
.es-footer-body h1 a {
    font-size: 30px;
}

.es-header-body h2 a,
.es-content-body h2 a,
.es-footer-body h2 a {
    font-size: 28px;
}

.es-header-body h3 a,
.es-content-body h3 a,
.es-footer-body h3 a {
    font-size: 24px;
}

a.es-button,
button.es-button {
    border-style: solid;
    border-color: #d48344;
    border-width: 10px 20px 10px 20px;
    display: inline-block;
    background: #d48344;
    border-radius: 0px;
    font-size: 16px;
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
    font-weight: normal;
    font-style: normal;
    line-height: 120%;
    color: #ffffff;
    width: auto;
    text-align: center;
}

.es-button-border {
    border-style: solid solid solid solid;
    border-color: #d48344 #d48344 #d48344 #d48344;
    background: #2cb543;
    border-width: 0px 0px 0px 0px;
    display: inline-block;
    border-radius: 0px;
    width: auto;
}

/* RESPONSIVE STYLES Please do not delete and edit CSS styles below. If you don't need responsive layout, please delete this section. */
@media only screen and (max-width: 600px) {

    p,
    ul li,
    ol li,
    a {
        line-height: 150% !important;
    }

    h1,
    h2,
    h3,
    h1 a,
    h2 a,
    h3 a {
        line-height: 120% !important;
    }

    h1 {
        font-size: 30px !important;
        text-align: center;
    }

    h2 {
        font-size: 26px !important;
        text-align: center;
    }

    h3 {
        font-size: 20px !important;
        text-align: center;
    }

    .es-header-body h1 a,
    .es-content-body h1 a,
    .es-footer-body h1 a {
        font-size: 30px !important;
    }

    .es-header-body h2 a,
    .es-content-body h2 a,
    .es-footer-body h2 a {
        font-size: 26px !important;
    }

    .es-header-body h3 a,
    .es-content-body h3 a,
    .es-footer-body h3 a {
        font-size: 20px !important;
    }

    .es-header-body p,
    .es-header-body ul li,
    .es-header-body ol li,
    .es-header-body a {
        font-size: 16px !important;
    }

    .es-content-body p,
    .es-content-body ul li,
    .es-content-body ol li,
    .es-content-body a {
        font-size: 16px !important;
    }

    .es-footer-body p,
    .es-footer-body ul li,
    .es-footer-body ol li,
    .es-footer-body a {
        font-size: 16px !important;
    }

    .es-infoblock p,
    .es-infoblock ul li,
    .es-infoblock ol li,
    .es-infoblock a {
        font-size: 12px !important;
    }

    *[class="gmail-fix"] {
        display: none !important;
    }

    .es-m-txt-c,
    .es-m-txt-c h1,
    .es-m-txt-c h2,
    .es-m-txt-c h3 {
        text-align: center !important;
    }

    .es-m-txt-r,
    .es-m-txt-r h1,
    .es-m-txt-r h2,
    .es-m-txt-r h3 {
        text-align: right !important;
    }

    .es-m-txt-l,
    .es-m-txt-l h1,
    .es-m-txt-l h2,
    .es-m-txt-l h3 {
        text-align: left !important;
    }

    .es-m-txt-r img,
    .es-m-txt-c img,
    .es-m-txt-l img {
        display: inline !important;
    }

    .es-button-border {
        display: block !important;
    }

    a.es-button,
    button.es-button {
        font-size: 20px !important;
        display: block !important;
        border-left-width: 0px !important;
        border-right-width: 0px !important;
    }

    .es-btn-fw {
        border-width: 10px 0px !important;
        text-align: center !important;
    }

    .es-adaptive table,
    .es-btn-fw,
    .es-btn-fw-brdr,
    .es-left,
    .es-right {
        width: 100% !important;
    }

    .es-content table,
    .es-header table,
    .es-footer table,
    .es-content,
    .es-footer,
    .es-header {
        width: 100% !important;
        max-width: 600px !important;
    }

    .es-adapt-td {
        display: block !important;
        width: 100% !important;
    }

    .adapt-img {
        width: 100% !important;
        height: auto !important;
    }

    .es-m-p0 {
        padding: 0px !important;
    }

    .es-m-p0r {
        padding-right: 0px !important;
    }

    .es-m-p0l {
        padding-left: 0px !important;
    }

    .es-m-p0t {
        padding-top: 0px !important;
    }

    .es-m-p0b {
        padding-bottom: 0 !important;
    }

    .es-m-p20b {
        padding-bottom: 20px !important;
    }

    .es-mobile-hidden,
    .es-hidden {
        display: none !important;
    }

    tr.es-desk-hidden,
    td.es-desk-hidden,
    table.es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important;
    }

    tr.es-desk-hidden {
        display: table-row !important;
    }

    table.es-desk-hidden {
        display: table !important;
    }

    td.es-desk-menu-hidden {
        display: table-cell !important;
    }

    .es-menu td {
        width: 1% !important;
    }

    table.es-table-not-adapt,
    .esd-block-html table {
        width: auto !important;
    }

    table.es-social {
        display: inline-block !important;
    }

    table.es-social td {
        display: inline-block !important;
    }

    .es-menu td a {
        font-size: 16px !important;
    }

    .es-desk-hidden {
        display: table-row !important;
        width: auto !important;
        overflow: visible !important;
        max-height: inherit !important;
    }
}

/* END RESPONSIVE STYLES */
</style>
</head>

<body>
<div class="es-wrapper-color">
                <!--[if gte mso 9]>
        \\t\\t\\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        \\t\\t\\t\\t<v:fill type="tile" color="#efefef"></v:fill>
        \\t\\t\\t</v:background>
        \\t\\t<![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="esd-email-paddings" valign="top">
                        <table class="es-content esd-header-popover" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" esd-custom-block-id="1754" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0"
                                            bgcolor="#ffffff" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p10b es-p20r es-p20l"
                                                        esd-general-paddings-checked="false" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="560"
                                                                        valign="top" align="center">
                                                                        <table
                                                                            style="border-radius: 0px; border-collapse: separate;"
                                                                            width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p10t es-p15b"
                                                                                        align="center">
                                                                                        <h1>Thanks for your order<br>
                                                                                        </h1>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p5t es-p5b es-p40r es-p40l"
                                                                                        align="center">
                                                                                        <p style="color: #333333;">
                                                                                            You'll receive an email when
                                                                                            your items are shipped. If
                                                                                            you have any questions, Call
                                                                                            us 1-800-1234-5678.</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="es-content esd-footer-popover" cellspacing="0" cellpadding="0" align="center">
                            <tbody>
                                <tr>
                                    <td class="esd-stripe" esd-custom-block-id="1758" align="center">
                                        <table class="es-content-body" width="600" cellspacing="0" cellpadding="0"
                                            bgcolor="#ffffff" align="center">
                                            <tbody id="product-orders">
                                                    <!-- bỏ product-->
                                                <tr>
                                                    <td class="esd-structure es-p10t es-p10b es-p20r es-p20l"
                                                        esd-general-paddings-checked="false" align="left">
                                                        <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="270" valign="top"><![endif]-->
                                                        <table class="es-left" cellspacing="0" cellpadding="0"
                                                            align="left">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="es-m-p0r es-m-p20b esd-container-frame"
                                                                        width="270" valign="top" align="center">
                                                                        <table width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text es-p20l"
                                                                                        align="left">
                                                                                        <h4>ITEMS ORDERED</h4>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td><td width="20"></td><td width="270" valign="top"><![endif]-->
                                                        <table cellspacing="0" cellpadding="0" align="right">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="270"
                                                                        align="left">
                                                                        <table width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text"
                                                                                        align="left">
                                                                                        <table style="width: 100%;"
                                                                                            class="cke_show_border"
                                                                                            cellspacing="1"
                                                                                            cellpadding="1" border="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td><span
                                                                                                            style="font-size:13px;">NAME</span>
                                                                                                    </td>
                                                                                                    <td style="text-align: center;"
                                                                                                        width="60"><span
                                                                                                            style="font-size:13px;"><span
                                                                                                                style="line-height: 100%;">QTY</span></span>
                                                                                                    </td>
                                                                                                    <td style="text-align: center;"
                                                                                                        width="100">
                                                                                                        <span
                                                                                                            style="font-size:13px;"><span
                                                                                                                style="line-height: 100%;">PRICE</span></span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="esd-structure es-p20r es-p20l"
                                                        esd-general-paddings-checked="false" align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="560"
                                                                        valign="top" align="center">
                                                                        <table width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-spacer es-p10b"
                                                                                        align="center"
                                                                                        style="font-size:0">
                                                                                        <table width="100%"
                                                                                            height="100%"
                                                                                            cellspacing="0"
                                                                                            cellpadding="0" border="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="border-bottom: 1px solid #efefef; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;">
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                ${this.forOrders(products)}
                                                <tr>
                                                    <td class="esd-structure es-p5t es-p30b es-p40r es-p20l"
                                                        align="left">
                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-container-frame" width="540"
                                                                        valign="top" align="center">
                                                                        <table width="100%" cellspacing="0"
                                                                            cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-block-text"
                                                                                        align="right">
                                                                                        <table style="width: 500px;"
                                                                                            class="cke_show_border"
                                                                                            cellspacing="1"
                                                                                            cellpadding="1" border="0"
                                                                                            align="right">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        Subtotal (3
                                                                                                        items):</td>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        ${this.total.nativeElement.innerText}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        Flat-rate
                                                                                                        Shipping:</td>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%; color: #d48344;">
                                                                                                        <strong>${this.shipper.nativeElement.innerText}</strong>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        VAT:</td>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        ${this.VAT.nativeElement.innerText}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%;">
                                                                                                        <strong>Order
                                                                                                            Total:</strong>
                                                                                                    </td>
                                                                                                    <td
                                                                                                        style="text-align: right; font-size: 18px; line-height: 150%; color: #d48344;">
                                                                                                        <strong>${this.amount.nativeElement.innerText}</strong>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                        <p style="line-height: 150%;">
                                                                                            <br></p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
    `
  }

  public forOrders(orders: OrderDetailsInterface[]) {
    let a = '';
    let productsTemplate: any = []
    for (const order of orders) {
      a = `<tr>
              <td class="esd-structure es-p5t es-p10b es-p20r es-p20l"
                  esd-general-paddings-checked="false" align="left">
                  <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="178" valign="top"><![endif]-->
                  <table class="es-left" cellspacing="0" cellpadding="0"
                      align="left">
                      <tbody>
                          <tr>
                              <td class="es-m-p0r es-m-p20b esd-container-frame"
                                  width="178" valign="top" align="center">
                                  <table width="100%" cellspacing="0"
                                      cellpadding="0">
                                      <tbody>
                                          <tr>
                                              <td class="esd-block-image"
                                                  align="center"
                                                  style="font-size:0"><a
                                                      href="http://localhost:4200/zayShopping/detail?productID=${order?.product?.pid}"
                                                      target="_blank"><img
                                                          src="${order.product?.imageMain}"
                                                          alt="Natural Balance L.I.D., sale 30%"
                                                          class="adapt-img"
                                                          title="Natural Balance L.I.D., sale 30%"
                                                          width="125"></a></td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <!--[if mso]></td><td width="20"></td><td width="362" valign="top"><![endif]-->
                  <table cellspacing="0" cellpadding="0" align="right">
                      <tbody>
                          <tr>
                              <td class="esd-container-frame" width="362"
                                  align="left">
                                  <table width="100%" cellspacing="0"
                                      cellpadding="0">
                                      <tbody>
                                          <tr>
                                              <td class="esd-block-text"
                                                  align="left">
                                                  <p><br></p>
                                                  <table style="width: 100%;"
                                                      class="cke_show_border"
                                                      cellspacing="1"
                                                      cellpadding="1" border="0">
                                                      <tbody>
                                                          <tr>
                                                              <td>
                                                              ${order?.product?.name}
                                                              </td>
                                                              <td style="text-align: center;"
                                                                  width="60">${order?.quantity}
                                                              </td>
                                                              <td style="text-align: center;"
                                                                  width="100">
                                                                  ${order?.quantity * order?.price}</td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                                  <p><br></p>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <!--[if mso]></td></tr></table><![endif]-->
              </td>
          </tr>
          <tr>
              <td class="esd-structure es-p20r es-p20l"
                  esd-general-paddings-checked="false" align="left">
                  <table width="100%" cellspacing="0" cellpadding="0">
                      <tbody>
                          <tr>
                              <td class="esd-container-frame" width="560"
                                  valign="top" align="center">
                                  <table width="100%" cellspacing="0"
                                      cellpadding="0">
                                      <tbody>
                                          <tr>
                                              <td class="esd-block-spacer es-p10b"
                                                  align="center"
                                                  style="font-size:0">
                                                  <table width="100%"
                                                      height="100%"
                                                      cellspacing="0"
                                                      cellpadding="0" border="0">
                                                      <tbody>
                                                          <tr>
                                                              <td
                                                                  style="border-bottom: 1px solid #efefef; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;">
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>`

      productsTemplate.push(a);
    }
    return productsTemplate;
  }
}


