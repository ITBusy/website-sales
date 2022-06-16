import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";
import {ProductService} from "../../../services/product.service";
import {CategoryService} from 'src/app/services/category.service';
import {ManufacturerService} from 'src/app/services/manufacturer.service';
import {
  CategoryInterface,
  ImageProductsInterface,
  ManufacturerInterface,
  ProductDtoInterface
} from "../../../entity/entity";
import {FormGroupService} from "../../../services/form-group.service";
import Swal from "sweetalert2";
import {deleteObject, getStorage, listAll, ref} from "@angular/fire/storage";


@Component({
  selector: 'app-manager-product',
  templateUrl: './manager-product.component.html',
  styleUrls: ['./manager-product.component.css']
})
export class ManagerProductComponent implements OnInit {

  public createProduct: FormGroup;
  public updateProduct: FormGroup;
  public selectedFile: File[] = [];
  public ref: AngularFireStorageReference;
  public category: CategoryInterface[] = [];
  public manufacturer: ManufacturerInterface[] = [];
  public submittedCreate: boolean = true;
  public submittedUpdate: boolean = true;
  public uploadStatus: boolean = false;
  public localUrl: ImageProductsInterface[] = [];
  @ViewChild('closeFormCreate') closeFormCreate: ElementRef;
  @ViewChild('closeFormUpdate') closeFormUpdate: ElementRef;
  public products: ProductDtoInterface[] = [];
  public imageMain: string;
  public imageMainFile: File;

  constructor(private _storage: AngularFireStorage,
              private _fb: FormBuilder,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _manufacturerService: ManufacturerService,
              public _formService: FormGroupService,
  ) {
  }

  ngOnInit(): void {
    this.createProduct = this._fb.group({
      name: new FormControl('', Validators.required),
      cpu: new FormControl('', Validators.required),
      gpu: new FormControl('', Validators.required),
      hardDiskDrive: new FormControl('', Validators.required),
      ramdisk: new FormControl('', Validators.required),
      monitors: new FormControl('', Validators.required),
      batteryCapacity: new FormControl('', Validators.required),
      warranty: new FormControl('12 Tháng', Validators.required),
      insights: new FormControl('', Validators.required),
      keyboardLights: new FormControl('Không', Validators.required),
      design: new FormControl('', Validators.required),
      sizeAndWeight: new FormControl('', Validators.required),
      launchDate: new FormControl('', Validators.required),
      operatingSystem: new FormControl('', Validators.required),
      gateway: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
      manufacturer: new FormGroup({
        id: new FormControl('', Validators.required)
      }),
      category: new FormGroup({
        cId: new FormControl('', Validators.required)
      }),
      imageUrl: new FormGroup({
        imageUrl: new FormControl('', Validators.required)
      }),
    });
    this.updateProduct = this._fb.group({
      pid: new FormControl(0, Validators.required),
      name: new FormControl('', Validators.required),
      cpu: new FormControl('', Validators.required),
      gpu: new FormControl('', Validators.required),
      hardDiskDrive: new FormControl('', Validators.required),
      ramdisk: new FormControl('', Validators.required),
      monitors: new FormControl('', Validators.required),
      batteryCapacity: new FormControl('', Validators.required),
      warranty: new FormControl('', Validators.required),
      insights: new FormControl('', Validators.required),
      keyboardLights: new FormControl('', Validators.required),
      design: new FormControl('', Validators.required),
      sizeAndWeight: new FormControl('', Validators.required),
      launchDate: new FormControl('', Validators.required),
      operatingSystem: new FormControl('', Validators.required),
      gateway: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
      manufacturer: new FormGroup({
        id: new FormControl('', Validators.required)
      }),
      category: new FormGroup({
        cId: new FormControl('', Validators.required)
      }),
      // imageUrl: new FormGroup({
      //   imageUrl: new FormControl('', Validators.required)
      // }),
    });
    this.getAllProducts();
    this.getAllCategory();
    this.getAllManufacturers();
  }

  uploadFiles(e: any) {
    this.selectedFile = e.files;
    let imageUrl: ImageProductsInterface;
    Object.keys(e.files).forEach(i => {
      const file = e.files[i];
      let reader = new FileReader();
      reader.onload = ((ev: any) => {
        imageUrl = {
          ip_id: 0,
          imageUrl: ev.target.result
        }
        this.localUrl.push(imageUrl);
      });
      reader.readAsDataURL(file);
    });
  }

  public getAllCategory() {
    this._categoryService.findAllCategory().subscribe(category => {
      this.category = category;
      this.createProduct.controls['category'].setValue({
        cId: this.category[0].cId
      });
    });
  }

  public getAllManufacturers() {
    this._manufacturerService.findAllManufacturer().subscribe((result) => {
      this.manufacturer = result;
      this.createProduct.controls['manufacturer'].setValue({
        id: this.manufacturer[0].id
      });
    });
  }

  public getAllProducts() {
    this._productService.findAllProducts().subscribe((result) => {
      this.products = result;
    }, (error) => alert(error.message));
  }

  createProductBtn() {
    if (this.createProduct.invalid) {
      this.submittedCreate = false;
      return;
    } else {
      if (this.selectedFile.length > 0) {
        let data: ImageProductsInterface[] = [];
        let imageUrl: ImageProductsInterface;
        this.uploadStatus = true;
        for (let i = 0; i < this.selectedFile.length; i++) {
          const element = this.selectedFile[i];
          const id = Math.random().toString(36).substring(2);
          this.ref = this._storage.ref(`products/${id}`);
          this.ref.put(element).then(data => {
            return data.ref.getDownloadURL();
          }).then((downloadURL) => {
            imageUrl = {
              ip_id: 0,
              imageUrl: downloadURL
            }
            data.push(imageUrl)
            if (data.length === this.selectedFile.length) {
              const code = this.createProduct.controls['name']?.value + "(" + Math.random().toString(36).substring(2) + ")";
              this.ref = this._storage.ref(`product/${code}`)
              this.ref.put(this.imageMainFile).then((dat) => dat.ref.getDownloadURL()).then((dow) => {
                this.uploadStatus = false;
                this._productService.createProduct(this.getDataCreate(data, dow)).subscribe((result) => {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: result.message,
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    this.localUrl = [];
                    this.imageMain = '';
                    this.getAllCategory();
                    this.getAllManufacturers();
                    this.createProduct.controls['warranty'].setValue("12 Tháng");
                    this.createProduct.controls['keyboardLights'].setValue("Không");
                    this.getAllProducts();
                    this.uploadStatus = false;
                    this.submittedCreate = true;
                    this.createProduct.reset();
                    this.closeFormCreate.nativeElement.click();
                  });
                }, (error) => Swal.fire('Error message', error.message, 'error').then())
              })
            }
            return downloadURL;
          });
        }
      }
    }
  }

  updateProductBtn() {
    if (this.updateProduct.invalid || this.localUrl == null) {
      this.submittedUpdate = false;
      return;
    } else {
      if (this.selectedFile.length > 0) {
        let data: ImageProductsInterface[] = [];
        let imageUrl: ImageProductsInterface;
        this.uploadStatus = true;
        for (let i = 0; i < this.selectedFile.length; i++) {
          const element = this.selectedFile[i];
          const id = Math.random().toString(36).substring(2);
          this.ref = this._storage.ref(`products/${id}`);
          this.ref.put(element).then(data => {
            return data.ref.getDownloadURL();
          }).then((downloadURL) => {
            imageUrl = {
              ip_id: 0,
              imageUrl: downloadURL
            }
            data.push(imageUrl);
            if (data.length === this.selectedFile.length) {
              this._productService.updateProduct(this.getDataUpdate(data)).subscribe((result) => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: result.message,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  this.localUrl = [];
                  this.getAllProducts();
                  this.uploadStatus = false;
                  this.submittedUpdate = true;
                  this.updateProduct.reset();
                  this.closeFormUpdate.nativeElement.click();
                });
              }, (error) => Swal.fire('Error message', error.message, 'error').then());
            }
            return downloadURL;
          });
        }
      } else {
        this._productService.updateProduct(this.getDataUpdate(this.localUrl)).subscribe((result) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: result.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.localUrl = [];
            this.getAllProducts();
            this.submittedUpdate = true;
            this.updateProduct.reset();
            this.closeFormUpdate.nativeElement.click();
          });
        }, (error) => Swal.fire('Error message', error.message, 'error').then())
      }
    }
  }

  findProductById(pId: number) {
    this.localUrl = [];
    this._productService.findProductById(pId).subscribe((result: ProductDtoInterface) => {
        this.updateProduct.controls['pid'].setValue(result.pid);
        this.updateProduct.controls['name'].setValue(result.name);
        this.updateProduct.controls['cpu'].setValue(result.cpu);
        this.updateProduct.controls['gpu'].setValue(result.gpu);
        this.updateProduct.controls['hardDiskDrive'].setValue(result.hardDiskDrive);
        this.updateProduct.controls['ramdisk'].setValue(result.ramdisk);
        this.updateProduct.controls['monitors'].setValue(result.monitors);
        this.updateProduct.controls['batteryCapacity'].setValue(result.batteryCapacity);
        this.updateProduct.controls['warranty'].setValue(result.warranty);
        this.updateProduct.controls['insights'].setValue(result.insights);
        this.updateProduct.controls['keyboardLights'].setValue(result.keyboardLights);
        this.updateProduct.controls['design'].setValue(result.design);
        this.updateProduct.controls['sizeAndWeight'].setValue(result.sizeAndWeight);
        this.updateProduct.controls['launchDate'].setValue(result.launchDate);
        this.updateProduct.controls['operatingSystem'].setValue(result.operatingSystem);
        this.updateProduct.controls['gateway'].setValue(result.gateway);
        this.updateProduct.controls['price'].setValue(result.price);
        this.updateProduct.controls['active'].setValue(result.active);
        this.updateProduct.controls['manufacturer'].setValue({id: result.manufacturer.id});
        this.updateProduct.controls['category'].setValue({cId: result.category.cId});
        for (const image of result.imageUrl) {
          this.localUrl.push(image);
        }
      }
    )
  }

  deleteImageById(ip_id: number) {
    this._productService.deleteImageById(ip_id).subscribe(() => {
      this.localUrl = [];
      this.findProductById(this.updateProduct.controls['pid']?.value);
      this._productService.findImageById(ip_id).subscribe((result: ImageProductsInterface) => {
        const storage = getStorage();
        const listRef = ref(storage, 'products/');
        let list: any[] = []
        listAll(listRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              // All the items under listRef.
              list.push(itemRef)
              let c = 'products/' + result.imageUrl.substring(result.imageUrl.indexOf("%") + 3, result.imageUrl.indexOf("?"))
              // console.log(c)
              if (c === itemRef.fullPath) {
                console.log(c)
                console.log(itemRef.fullPath)
                const desertRef = ref(storage, c);
                // Delete the file
                deleteObject(desertRef).then(() => {
                  // File deleted successfully
                }).catch((error) => {
                  // Uh-oh, an error occurred!
                });
              }
              if (list.length === res.items.length) {
                // this.uploadStatus = false;

              }
            });
          }).catch((error) => {
          // Uh-oh, an error occurred!
        });
      })
    });
  }

  EventImageMain(e: any) {
    this.imageMainFile = e.files[0];
    let reader = new FileReader();
    reader.onload = (ev: any) => {
      this.imageMain = ev.target.result;
    }
    reader.readAsDataURL(e.files[0]);
  }

  reset() {
    this.localUrl = [];
  }

  private getDataUpdate(localUrl: ImageProductsInterface[]): ProductDtoInterface {
    // let data: ImageProductsInterface[] = [];
    // let imageUrl: ImageProductsInterface;
    // for (const downloadURL of localUrl) {
    //   imageUrl = {
    //     Ip_id: 0,
    //     imageUrl: downloadURL
    //   }
    //   data.push(imageUrl);
    // }

    return {
      pid: this.updateProduct.get('pid')?.value,
      name: this.updateProduct.get('name')?.value,
      cpu: this.updateProduct.get('cpu')?.value,
      gpu: this.updateProduct.get('gpu')?.value,
      hardDiskDrive: this.updateProduct.get('hardDiskDrive')?.value,
      ramdisk: this.updateProduct.get('ramdisk')?.value,
      monitors: this.updateProduct.get('monitors')?.value,
      batteryCapacity: this.updateProduct.get('batteryCapacity')?.value,
      warranty: this.updateProduct.get('warranty')?.value,
      insights: this.updateProduct.get('insights')?.value,
      keyboardLights: this.updateProduct.get('keyboardLights')?.value,
      design: this.updateProduct.get('design')?.value,
      sizeAndWeight: this.updateProduct.get('sizeAndWeight')?.value,
      launchDate: this.updateProduct.get('launchDate')?.value,
      operatingSystem: this.updateProduct.get('operatingSystem')?.value,
      gateway: this.updateProduct.get('gateway')?.value,
      price: this.updateProduct.get('price')?.value,
      active: this.updateProduct.get('active')?.value,
      imageMain: '',
      manufacturer: {
        id: this.updateProduct.get('manufacturer')?.get('id')?.value,
        name: ''
      },
      category: {
        cId: this.updateProduct.get('category')?.get('cId')?.value,
        name: ''
      },
      imageUrl: localUrl
    };
  }

  private getDataCreate(localUrl: ImageProductsInterface[], imageMain: string): ProductDtoInterface {
    return {
      pid: 0,
      name: this.createProduct.get('name')?.value,
      cpu: this.createProduct.get('cpu')?.value,
      gpu: this.createProduct.get('gpu')?.value,
      hardDiskDrive: this.createProduct.get('hardDiskDrive')?.value,
      ramdisk: this.createProduct.get('ramdisk')?.value,
      monitors: this.createProduct.get('monitors')?.value,
      batteryCapacity: this.createProduct.get('batteryCapacity')?.value,
      warranty: this.createProduct.get('warranty')?.value,
      insights: this.createProduct.get('insights')?.value,
      keyboardLights: this.createProduct.get('keyboardLights')?.value,
      design: this.createProduct.get('design')?.value,
      sizeAndWeight: this.createProduct.get('sizeAndWeight')?.value,
      launchDate: this.createProduct.get('launchDate')?.value,
      operatingSystem: this.createProduct.get('operatingSystem')?.value,
      gateway: this.createProduct.get('gateway')?.value,
      price: this.createProduct.get('price')?.value,
      active: this.createProduct.get('active')?.value,
      imageMain: imageMain,
      manufacturer: {
        id: this.createProduct.get('manufacturer')?.get('id')?.value,
        name: ''
      },
      category: {
        cId: this.createProduct.get('category')?.get('cId')?.value,
        name: ''
      },
      imageUrl: localUrl
    };
  }
}
