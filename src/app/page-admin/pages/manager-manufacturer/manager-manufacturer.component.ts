import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ManufacturerService} from 'src/app/services/manufacturer.service';
import {ManufacturerInterface} from "../../../entity/entity";
import {FormGroupService} from "../../../services/form-group.service";
import {customValidator} from "../../../services/test";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manager-manufacturer',
  templateUrl: './manager-manufacturer.component.html',
  styleUrls: ['./manager-manufacturer.component.css']
})
export class ManagerManufacturerComponent implements OnInit {
  public createManufacturer: FormGroup;
  public updateManufacturer: FormGroup;
  @ViewChild('closeFormCreate') closeFormCreate: ElementRef;
  @ViewChild('closeFormUpdate') closeFormUpdate: ElementRef;
  public manufacturer: ManufacturerInterface[];
  public submitted: boolean = true;

  constructor(private _fb: FormBuilder,
              private _manufacturerService: ManufacturerService,
              public _formService: FormGroupService) {
  }

  ngOnInit(): void {
    this.createManufacturer = this._fb.group({
      name: new FormControl('', [Validators.required,
        customValidator(/^([a-zA-Z]{2,})(\s[a-zA-Z]{2,})*$/).isAlphabet])
    });
    this.updateManufacturer = this._fb.group({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required,
        customValidator(/^([a-zA-Z]{2,})(\s[a-zA-Z]{2,})*$/).isAlphabet])
    });
    this.getAllManufacturers();
  }

  public getAllManufacturers() {
    this._manufacturerService.findAllManufacturer().subscribe((result) => {
      this.manufacturer = result;
    })
  }

  public updateManufacturerBtn() {
    if (this.updateManufacturer.invalid) {
      this.submitted = false;
      return;
    } else {
      this._manufacturerService.updateManufacturer(this.updateManufacturer.value).subscribe((result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.getAllManufacturers();
          this.updateManufacturer.reset();
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

  public createManufacturerBtn() {
    if (this.createManufacturer.invalid) {
      this.submitted = false;
      return;
    } else {
      this._manufacturerService.createManufacturer(this.createManufacturer.value).subscribe((result) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.getAllManufacturers();
          this.createManufacturer.reset();
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

  public getDataUpdate(id: number) {
    this._manufacturerService.findManufacturerById(id).subscribe(
      (result) => {
        this.updateManufacturer.controls['id'].setValue(result.id);
        this.updateManufacturer.controls['name'].setValue(result.name.toLowerCase());
      }
    );
  }
}
