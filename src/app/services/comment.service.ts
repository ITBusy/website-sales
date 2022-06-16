import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CommentInterface} from '../entity/entity';
import {catchError, map, Observable, throwError} from "rxjs";
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _http: HttpClient) {
  }

  public createComment(comment: CommentInterface): Observable<any> {
    return this._http.post<any>(`${baseUrl}/comment/`, comment).pipe(
      map(result => result),
      catchError(err => throwError(err.error))
    );
  }

  public findAllComments(pid: number): Observable<any> {
    return this._http.get<any>(`${baseUrl}/comment/product/${pid}`).pipe(
      map(res => res.data),
      catchError(err => throwError(err))
    );
  }
}
