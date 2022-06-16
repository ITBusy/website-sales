import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: HttpClient) {
  }

  public createCategory(category: any): Observable<any> {
    return this._http.post<any>(`${baseUrl}/category/`, category).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public updateCategory(category: any): Observable<any> {
    return this._http.put<any>(`${baseUrl}/category/`, category).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public findAllCategory(): Observable<any> {
    return this._http.get<any>(`${baseUrl}/category/`).pipe(
      map((result) => result.data),
      catchError(err => throwError(err.error))
    );
  }

  public findCategoryById(id: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/category/${id}`).pipe(
      map((result) => result.data),
      catchError(err => throwError(err.error))
    );
  }
}
