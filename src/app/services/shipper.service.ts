import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root'
})
export class ShipperService {

  constructor(private _http: HttpClient) {
  }

  public findAllByUsername(username: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/shipper-order-all/${username}`).pipe(
      map(response => response.data),
      catchError(err => throwError(err))
    );
  }

  public findShipperByOrderId(orderId: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/order/shipper-order/${orderId}`).pipe(
      map(response => response.data),
      catchError(err => throwError(err))
    );
  }
}
