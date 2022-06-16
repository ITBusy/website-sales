import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {OrderDetailsInterface, OrderDtoInterface, OrderInterface, ShipperOrderInterface} from "../entity/entity";
import {catchError, map, Observable, throwError} from "rxjs";
import baseUrl from "./baseUrl";
import {LoginService} from "./login.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _http: HttpClient, private _loginService: LoginService) {
  }

  public createOrder(order: OrderInterface): Observable<any> {
    return this._http.post<any>(`${baseUrl}/order/`, order).pipe(
      map(res => res),
      catchError(err => throwError(err.error))
    );
  }

  public findAllOrderDetails(username: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/order-details/${username}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err))
    );
  }

  public getAmount(orderId: number): Observable<any> {
    return this._http.get(`${baseUrl}/order/total/${orderId}`).pipe(
      map(res => res),
      catchError(err => throwError(err))
    );
  }

  public updateOrderDetail(orderDetail: OrderDetailsInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/order/order-detail`, orderDetail).pipe(
      map(res => res),
      catchError(err => throwError(err.error))
    );
  }

  public findByOrderDetailID(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/order-detail/${id}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err.error))
    );
  }

  public deleteById(id: number): Observable<any> {
    return this._http.delete<any>(`${baseUrl}/order/order-detail/${id}`).pipe(
      map(res => res),
      catchError(err => throwError(err.error))
    );
  }

  public updateOrder(order: OrderInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/order/`, order).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public findAllOrderByUsernameAndStatusOtherCart(username: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/${username}`).pipe(
      map(result => result.data),
      catchError(err => throwError(err))
    );
  }

  //*****
  public findAllOrderByUsernameAndStatus(username: string, status: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/status/${username}/${status}`).pipe(
      map(result => {
        if (result != null) {
          return result.data;
        } else {
          return 0;
        }
      }),
      catchError(err => throwError(err))
    );
  }

  public findAllOrder(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/all`).pipe(
      map(result => result.data),
      catchError(err => throwError(err))
    );
  }

  public updateStatusAndCreateShipperOrder(shipper: ShipperOrderInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/order/update-status`, shipper).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public updateOrderByStatusCompleted(orderID: number): Observable<any> {
    let formData = new FormData();
    formData.append("orderID", JSON.stringify(orderID));
    return this._http.put<any>(`${baseUrl}/order/update-status/completed`, formData).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public updateOrderByStatusCancelled(orderDto: OrderDtoInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/order/update-status/cancelled`, orderDto).pipe(
      map(result => result),
      catchError(err => throwError(err))
    );
  }

  public countCart(username: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/count-cart/${username}`).pipe(
      map(result => result),
      catchError(err => throwError(err))
    );
  }
}
