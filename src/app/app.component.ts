import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {filter, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'asm_frontend';
  private subscription: Subscription;

  constructor(public translate: TranslateService, private _router: Router) {
    this.translate.setDefaultLang('vi');
    this.translate.use(localStorage.getItem('lang') || 'vi')
  }

  ngOnInit(): void {
    this.subscription = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => window.scrollTo(0, 0));

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
