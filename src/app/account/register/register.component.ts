import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
import {ResponseObject} from 'src/app/entity/entity';
import Swal from 'sweetalert2';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  submitted = true;
  register: FormGroup;

  constructor(
    private _router: Router,
    private _userService: UsersService,
    private _fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.register = this._fb.group(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(\w){1,25}$/),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        fullName: new FormControl('', [
          Validators.required,
          customValidators.isAlphabet,
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        repassword: new FormControl('', [Validators.required]),
      },
      {validator: customValidators.confirmPassword('password', 'repassword')}
    );
  }

  form(name: string) {
    return this.register.controls[name];
  }

  onregister() {
    if (this.register.invalid) {
      this.submitted = false;
      return;
    } else {
      this.submitted = true;
      this._userService.createUser(this.register.value).subscribe(
        (data: ResponseObject) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: data.message,
            showConfirmButton: false,
            timer: 1500,
          }).then((result) => {
            if (result.dismiss == Swal.DismissReason.timer) {
              this._router.navigate(['account/login']).then();
            }
          });
        },
        (error) => {
          alert(error.message);
        }
      );
    }
  }
}

const customValidators = {
  removeAscent: (str: string) => {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  },
  isAlphabet: (control: AbstractControl): { [key: string]: boolean } | null => {
    let regex = new RegExp(/^([A-Za-z]{2,}\s[A-Za-z]{2,})(\s[A-Za-z]{1,})*$/);
    if (control.value !== '') {
      if (!regex.test(customValidators.removeAscent(control.value))) {
        return {isAlphabet: true};
      }
    }
    return null;
  },
  confirmPassword: function (controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmPassword']
      ) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmPassword: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
  },
};
