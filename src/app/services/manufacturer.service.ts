import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import baseUrl from "./baseUrl";
import {ManufacturerInterface} from "../entity/entity";

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private _http: HttpClient) {
  }

  public createManufacturer(manufacturer: ManufacturerInterface): Observable<any> {
    return this._http.post<any>(`${baseUrl}/manufacturer/`, manufacturer).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public updateManufacturer(manufacturer: ManufacturerInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/manufacturer/`, manufacturer).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public findAllManufacturer(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/manufacturer/`).pipe(
      map((result) => result.data),
      catchError(err => throwError(err.error))
    );
  }

  public findManufacturerById(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/manufacturer/${id}`).pipe(
      map((result) => result.data),
      catchError(err => throwError(err.error))
    );
  }
}
