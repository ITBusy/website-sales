import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FacebookAuthProvider, GoogleAuthProvider} from '@angular/fire/auth'
import {catchError, firstValueFrom, map, throwError} from "rxjs";
import {HttpClient} from '@angular/common/http';
import baseUrl from "./baseUrl";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private _authFiresService: AngularFireAuth,
    private _http: HttpClient,
  ) {
  }

  public async signInWithGoogle(): Promise<any> {
    return await this._authFiresService.signInWithPopup(new GoogleAuthProvider())
      .then(data => {
        let user = JSON.stringify(data.user);
        return JSON.parse(user).stsTokenManager.accessToken
      }).then((res: string) => {
        return this.transferenceService(res).then(token => token).catch(err => throwError(err))
      })
      .catch(err => throwError(err));
  }

  signInWithFacebook() {
    this._authFiresService.signInWithPopup(new FacebookAuthProvider()).then(data => console.log(data.user))
  }

  private transferenceService(idToken: string): Promise<Object> {
    return firstValueFrom(this._http.post(`${baseUrl}/google`, idToken).pipe(
      map(data => data),
      catchError((err) => throwError(err))));
  }
}
