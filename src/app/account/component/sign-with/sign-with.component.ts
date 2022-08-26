import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-sign-with',
  templateUrl: './sign-with.component.html',
  styleUrls: ['./sign-with.component.css']
})
export class SignWithComponent implements OnInit {

  constructor(
    private _adminService: AdminService,
    private _loginService: LoginService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
  }

  signInWithGoogle() {
    this._adminService.signInWithGoogle().then(data => {
      this._loginService.loginUser(data.token);
      this._loginService.getCurrentUser().subscribe((user: any) => {
        this._loginService.setUser(user);
        this._router.navigate(['zayShopping']).then();
      });
    });
  }

  signInWithFacebook() {
    this._adminService.signInWithFacebook();
  }
}
