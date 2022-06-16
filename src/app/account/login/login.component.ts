import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {UserInterface} from 'src/app/entity/entity';
import {LoginService} from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../account.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: UserInterface = {
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    imageUrl: '',
    authority: '',
  };

  constructor(
    private _router: Router,
    private _login: LoginService,
    private _fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    if (this._login.isLoggedIn() && this._login.getUserRoles() === 'ADMIN') {
      this._router.navigate(['zayShopping/admin']).then();
    } else if (this._login.isLoggedIn() && this._login.getUserRoles() === 'SHIPPER') {
      this._router.navigate(['zayShopping/shipper']).then();
    } else if (this._login.isLoggedIn() && this._login.getUserRoles() === 'CLIENT') {
      this._router.navigate(['zayShopping']).then();
    } else {
      this._router.navigate(['account/login']).then();
    }
    this.loginForm = this._fb.group({
      username: [''],
      password: [''],
      remenber: [false],
    });
  }

  onLogin() {
    if (
      this.loginForm.value.username === '' &&
      this.loginForm.value.password == ''
    ) {
      Swal.fire({
        text: 'Please enter username and password',
        icon: 'error',
        timer: 1600,
        confirmButtonColor: '#487eb0',
      });
    } else if (
      this.loginForm.value.username === '' ||
      this.loginForm.value.password === ''
    ) {
      Swal.fire({
        text: `Please enter ${
          this.loginForm.value.username === '' ? 'username' : 'password'
        }`,
        icon: 'error',
        timer: 1600,
        confirmButtonColor: '#487eb0',
      });
    } else {
      this.user.username = this.loginForm.value.username;
      this.user.password = this.loginForm.value.password;
      this._login.generateToken(this.user).subscribe(
        (data: any) => {
          // console.log(data.token);
          this._login.loginUser(data.token);
          this._login.getCurrentUser().subscribe((user: any) => {
            this._login.setUser(user);
            const role = this._login.getUserRoles();
            Swal.fire({
              titleText: 'Login successfully',
              icon: 'success',
              timer: 1600,
              showConfirmButton: false,
            }).then(() => {
              if (role === 'ADMIN') {
                this._router.navigate(['zayShopping/admin']).then();
              } else if (role === 'SHIPPER') {
                this._router.navigate(['zayShopping/shipper']).then();
              } else {
                this._router.navigate(['zayShopping']).then();
              }
            });
          });
        },
        (error: any) => {
          Swal.fire({
            titleText: 'Username or password incorrect',
            icon: 'error',
            timer: 1600,
          });
        }
      );
    }
  }
}
