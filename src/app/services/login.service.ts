import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {UserInterface} from '../entity/entity';
import baseUrl from './baseUrl';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  day: number = 1;

  constructor(private _http: HttpClient) {
  }

  public getCurrentUser(): Observable<UserInterface> {
    return this._http.get<UserInterface>(`${baseUrl}/current-user`).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  public generateToken(user: UserInterface): Observable<UserInterface> {
    return this._http
      .post<UserInterface>(`${baseUrl}/generate-token`, user)
      .pipe(
        map((res) => res),
        catchError((err) => throwError(err))
      );
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('us');
    return true;
  }

  public loginUser(token: string) {
    this.setWithExpiry('token', token, this.day);
    return true;
  }

  public isLoggedIn(): boolean {
    const tokenStr = this.getWithExpiry('token');
    if (tokenStr === undefined || tokenStr === null || tokenStr === '') {
      return false;
    } else {
      return true;
    }
  }

  public getToken() {
    return this.getWithExpiry('token');
  }

  public getUser() {
    let userStr = this.getWithExpiry('us');
    if (userStr != null) {
      return userStr;
    } else {
      this.logout();
      return null;
    }
  }

  public setUser(user: UserInterface) {
    this.setWithExpiry('us', user, this.day);
  }

  public getUserRoles() {
    // console.log(this.getUser().authority);
    return this.getUser().authority;
  }

  public async checkExists(id: number): Promise<boolean | undefined> {
    return await this._http.post<boolean>(`${baseUrl}/exists`, id).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    ).toPromise();
  }

  private setWithExpiry(key: string, value: any, day: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + day * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  private getWithExpiry(key: string) {
    const itemstr = localStorage.getItem(key);

    if (!itemstr) return null;
    const item = JSON.parse(itemstr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      this.logout();
      return null;
    }
    return item.value;
  }
}
