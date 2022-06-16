import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-page-admin',
  templateUrl: './page-admin.component.html',
  styleUrls: ['./page-admin.component.css']
})
export class PageAdminComponent implements OnInit {
  public lang: any;

  constructor(public translate: TranslateService) {
    this.translate.setDefaultLang('vi');
    this.translate.use(localStorage.getItem('lang') || 'vi')
  }

  ngOnInit(): void {
  }

}
