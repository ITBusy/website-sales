import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference,} from '@angular/fire/compat/storage';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import Swal from 'sweetalert2';
import {environment} from 'src/environments/environment.prod';
import {FormGroupService} from "../../../services/form-group.service";
import {UsersService} from "../../../services/users.service";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css'],
})
export class ManagerUserComponent implements OnInit {
  public selectedFile: File[] = [];
  public ref: AngularFireStorageReference;
  public downloadURL: string;
  public user: any;
  public uploadStatus: boolean = false;
  public localUrl: string = environment.imageDefaults;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalUpdate') closeModalUpdate: ElementRef;
  createUser: FormGroup;
  updateUs: FormGroup;
  public submitted: boolean = true;

  constructor(
    private storage: AngularFireStorage,
    private _userService: UsersService,
    private _fb: FormBuilder,
    public formService: FormGroupService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.createUser = this._fb.group({
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
      address: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required]),
      authorities: new FormControl('CLIENT'),
    });
    this.updateUs = this._fb.group({
      id: new FormControl('', Validators.required),
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
      address: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required]),
      authorities: new FormControl('CLIENT'),
    });
  }

  uploadFiles(event: any) {
    this.selectedFile = event.target.files;
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.localUrl = event.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  onload() {
    if (this.createUser.invalid) {
      this.submitted = false;
      return;
    } else {
      this.getAllUsers();
      console.log('select file: ', this.selectedFile);
      if (this.selectedFile.length > 0) {
        this.uploadStatus = true;
        for (let i = 0; i < this.selectedFile.length; i++) {
          const element = this.selectedFile[i];
          const id = Math.random().toString(36).substring(2);
          this.ref = this.storage.ref(`Avatar/${id}`);
          this.ref
            .put(element)
            .then((data) => {
              return data.ref.getDownloadURL();
            })
            .then((downloadURL) => {
              this.downloadURL = downloadURL;
              this.uploadStatus = false;
              // create a new user
              this._userService
                .createUser(this.getDataCreate(this.downloadURL))
                .subscribe(
                  (data) => {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: data.message,
                      showConfirmButton: false,
                      timer: 1500,
                    }).then((r) => {
                      this.getAllUsers();
                      this.createUser.reset();
                      this.closeModal.nativeElement.click();
                    });
                  },
                  (error) => {
                    Swal.fire('Error message', error.message, 'error').then();
                  }
                );
              return downloadURL;
            })
            .catch((error) => {
              console.log(`File to upload error: ${error}`);
            });
        }
      } else {
        // create user
        this._userService
          .createUser(this.getDataCreate(this.localUrl))
          .subscribe(
            (data) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
                timer: 1500,
              }).then(r => {
                this.getAllUsers();
                this.createUser.reset();
                this.closeModal.nativeElement.click();
              });
            },
            (error) => {
              Swal.fire('Error message', error.message, 'error').then();
            }
          );
      }
    }
  }

  updateUser(id: number) {
    this._userService.getUserById(id).subscribe(
      (result: any) => {
        this.updateUs.controls['id'].setValue(result.data.id);
        this.updateUs.controls['username'].setValue(result.data.username);
        this.updateUs.controls['fullName'].setValue(result.data.fullName);
        this.updateUs.controls['email'].setValue(result.data.email);
        this.updateUs.controls['authorities'].setValue(
          result.data.authorities[0].authority
        );
        this.updateUs.controls['address'].setValue(result.data.address);
        this.updateUs.controls['phoneNumber'].setValue(
          result.data.phoneNumber
        );
        this.localUrl = result.data.imageUrl;
      },
      (error) => alert(error.message)
    );
  }

  getAllUsers() {
    this._userService.getAllUsers().subscribe((data: any) => {
      this.user = data.data;
      // console.log(this.user);
    });
  }


  updateUserBtn() {
    if (this.updateUs.invalid) {
      this.submitted = false;
      return;
    } else {
      this.getAllUsers();
      // console.log('select file: ', this.selectedFile);
      if (this.selectedFile.length > 0) {
        this.uploadStatus = true;
        for (let i = 0; i < this.selectedFile.length; i++) {
          const element = this.selectedFile[i];
          const id = Math.random().toString(36).substring(2);
          this.ref = this.storage.ref(`Avatar/${id}`);
          this.ref
            .put(element)
            .then((data) => {
              return data.ref.getDownloadURL();
            })
            .then((downloadURL) => {
              this.downloadURL = downloadURL;
              this.uploadStatus = false;
              //update user
              this._userService
                .updateUser(this.getDataUpdate(this.downloadURL))
                .subscribe(
                  (data) => {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: data.message,
                      showConfirmButton: false,
                      timer: 1500,
                    }).then((r) => {
                      this.getAllUsers();
                      this.updateUs.reset();
                      this.closeModalUpdate.nativeElement.click();
                    });
                  },
                  (error) => {
                    Swal.fire('Error message', error.message, 'error').then();
                  }
                );
              return downloadURL;
            })
            .catch((error) => {
              console.log(`File to upload error: ${error}`);
            });
        }
      } else {
        // update user
        this._userService
          .updateUser(this.getDataUpdate(this.localUrl))
          .subscribe(
            (data) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                this.getAllUsers();
                this.updateUs.reset();
                this.closeModalUpdate.nativeElement.click();
              });
            },
            (error) => {
              Swal.fire('Error message', error.message, 'error').then();
            }
          );
      }
    }
  }

  userDetail(id: number) {

  }

  private getDataUpdate(localUrl: any) {
    return {
      id: this.updateUs.get('id')?.value,
      username: this.updateUs.get('username')?.value,
      password: this.updateUs.get('password')?.value,
      fullName: this.updateUs.get('fullName')?.value,
      email: this.updateUs.get('email')?.value,
      phoneNumber: this.updateUs.get('phoneNumber')?.value,
      address: this.updateUs.get('address')?.value,
      imageUrl: localUrl,
      authority: this.updateUs.get('authorities')?.value,
    };
  }

  private getDataCreate(localUrl: any) {
    return {
      username: this.createUser.get('username')?.value,
      password: this.createUser.get('password')?.value,
      fullName: this.createUser.get('fullName')?.value,
      email: this.createUser.get('email')?.value,
      phoneNumber: this.createUser.get('phoneNumber')?.value,
      address: this.createUser.get('address')?.value,
      imageUrl: localUrl,
      authority: this.createUser.get('authorities')?.value,
    };
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
};
