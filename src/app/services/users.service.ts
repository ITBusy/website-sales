import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import baseUrl from "./baseUrl";
import {ResponseObject, UserInterface} from "../entity/entity";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private _http: HttpClient) {
  }

  public createUser(user: any): Observable<any> {
    return this._http.post<any>(`${baseUrl}/user/create-user`, user).pipe(
      map((res: any) => res),
      catchError((err) => throwError(err.error))
    );
  }

  public getAllUsers(): Observable<ResponseObject> {
    return this._http.get<ResponseObject>(`${baseUrl}/user/`).pipe(
      map((res) => res),
      catchError((err) => throwError(err.error))
    );
  }

  public getUserById(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/user/${id}`).pipe(
      map((res) => res),
      catchError((err) => throwError(err.error))
    );
  }

  public updateUser(user: UserInterface): Observable<ResponseObject> {
    return this._http.put<ResponseObject>(`${baseUrl}/user/update-user`, user).pipe(
      map((res) => res),
      catchError((err) => throwError(err.error))
    );
  }

  public loadShipper(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/user/role-name`).pipe(
      map((res) => res.data),
      catchError((err) => throwError(err.error))
    );
  }
}
