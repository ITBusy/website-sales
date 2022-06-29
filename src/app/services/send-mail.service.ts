import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  constructor(private _http: HttpClient) {
  }

  public sendMail(toForm: string, name: string): Observable<any> {
    return this._http.get<any>(`${baseUrl}/user/send-mail/${toForm}/${name}`).pipe(
      map(res => res),
      catchError((error => throwError(error)))
    );
  }

  public sendMailOrder(sendMailOrder: any): Observable<any> {
    return this._http.post<any>(`${baseUrl}/order/send-mail-order`, sendMailOrder).pipe(
      map(res => res),
      catchError(err => throwError(err))
    );
  }
}
