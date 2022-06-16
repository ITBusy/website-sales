import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any;
  public lang: any;

  constructor(public _login: LoginService, private _router: Router) {

  }

  ngOnInit(): void {
    this.user = this._login.getUser();

  }

  logout(): void {
    this._login.logout();
    this._router.navigate(['account/login']);
    // window.location.reload();
  }

  languages(target: any) {
    localStorage.setItem("lang", target.value);
    window.location.reload();
  }
}
