import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoginService} from 'src/app/services/login.service';
import {I18nService} from "../../../services/i18n.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any;
  public lang: string;

  constructor(public _login: LoginService, private _router: Router, private _i18NService: I18nService, private _translate: TranslateService) {
    _translate.setDefaultLang('vi');
    _translate.use('vi');
  }

  ngOnInit(): void {
    this.user = this._login.getUser();
    this.lang = localStorage.getItem('lang') || 'vi';
    this._i18NService.changeLocale(this.lang);
  }

  logout(): void {
    this._login.logout();
    this._router.navigate(['account/login']).then();
    // window.location.reload();
  }

  languages(target: any) {
    localStorage.setItem("lang", target.value);
    this.lang = target.value;
    this._i18NService.changeLocale(target.value);
    // window.location.reload();
  }
}
