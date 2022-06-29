import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ProductDtoInterface} from "../entity/entity";
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient) {
  }

  public createProduct(productDto: ProductDtoInterface): Observable<any> {
    return this._http.post<any>(`${baseUrl}/product/`, productDto).pipe(
      map(res => res),
      catchError(err => throwError(err.error))
    );
  }

  public findAllProducts(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/product/`).pipe(
      map(res => res.data),
      catchError(err => throwError(err.error))
    );
  }

  public findProductById(id: any): Observable<any> {
    return this._http.get<any>(`${baseUrl}/product/${id}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err.error))
    );
  }

  public updateProduct(productDto: ProductDtoInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/product/`, productDto).pipe(
      map(res => res),
      catchError(err => throwError(err.error))
    );
  }

  public deleteImageById(id: number): Observable<any> {
    return this._http.delete<any>(`${baseUrl}/image-product/${id}`).pipe(
      map(res => res),
      catchError(err => throwError(err))
    );
  }

  public findImageById(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/image-product/${id}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err))
    );
  }

  public findProductByManufacturerId(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/product/manufacturer/${id}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err.error))
    );
  }

  public updateActiveProduct(productDto: ProductDtoInterface): Observable<any> {
    return this._http.put<any>(`${baseUrl}/product/active`, productDto).pipe(
      map(res => res),
      catchError(err => throwError(err.data))
    );
  }
}
