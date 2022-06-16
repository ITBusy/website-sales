import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryInterface} from 'src/app/entity/entity';
import {CategoryService} from 'src/app/services/category.service';
import {FormGroupService} from "../../../services/form-group.service";
import Swal from "sweetalert2";
import {customValidator} from "../../../services/test";

@Component({
  selector: 'app-manager-category',
  templateUrl: './manager-category.component.html',
  styleUrls: ['./manager-category.component.css']
})
export class ManagerCategoryComponent implements OnInit {

  @ViewChild('closeFormCreate') closeFormCreate: ElementRef;
  @ViewChild('closeFormUpdate') closeFormUpdate: ElementRef;
  public createCategory: FormGroup;
  public updateCategory: FormGroup;
  public category: CategoryInterface[] = [];
  public submitted: boolean = true;

  constructor(private _fb: FormBuilder,
              private _categoryService: CategoryService,
              public _formService: FormGroupService) {
  }

  ngOnInit(): void {
    this.createCategory = this._fb.group({
      name: new FormControl('', [Validators.required,
        customValidator(/^([a-zA-Z]{2,})(\s[a-zA-Z]{2,})*$/).isAlphabet])
    });
    this.updateCategory = this._fb.group({
      cId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required,
        customValidator(/^([a-zA-Z]{2,})(\s[a-zA-Z]{2,})*$/).isAlphabet])
    });
    this.getAllCategory();
  }

  public getAllCategory() {
    this._categoryService.findAllCategory().subscribe(category => {
      this.category = category;
    });
  }

  createCategoryBtn() {
    if (this.createCategory.invalid) {
      this.submitted = false;
      return;
    } else {
      this._categoryService.createCategory(this.createCategory.value).subscribe((result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.getAllCategory();
          this.createCategory.reset();
          this.closeFormCreate.nativeElement.click();
        });
      }, (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.message,
          showConfirmButton: false,
          timer: 1500,
        }).then();
      })
    }
  }

  getDataUpdate(cId: number) {
    this._categoryService.findCategoryById(cId).subscribe(
      (result) => {
        this.updateCategory.controls['cId'].setValue(result.cId);
        this.updateCategory.controls['name'].setValue(result.name);
      }
    );
  }

  updateCategoryBtn() {
    if (this.updateCategory.invalid) {
      this.submitted = false;
      return;
    } else {
      this._categoryService.updateCategory(this.updateCategory.value).subscribe((result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.getAllCategory();
          this.updateCategory.reset();
          this.closeFormUpdate.nativeElement.click();
        });
      }, (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.message,
          showConfirmButton: false,
          timer: 1500,
        }).then();
      })
    }
  }
}

