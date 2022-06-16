import {Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class FormGroupService {


  constructor() {
  }

  public form(name: string, nameForm: FormGroup) {
    return nameForm.controls[name];
  }

  public checkFormData(isValid: boolean | true, controlName: string, nameForm: FormGroup, submitted?: boolean | true): boolean {
    if (isValid) {
      return this.form(controlName, nameForm)?.valid
        && (
          this.form(controlName, nameForm)?.touched
          || this.form(controlName, nameForm)?.dirty
        );
    } else {
      return (!submitted && this.form(controlName, nameForm)?.invalid)
        || (
          this.form(controlName, nameForm)?.invalid
          && (
            this.form(controlName, nameForm)?.touched
            || this.form(controlName, nameForm)?.dirty
          )
        );
    }
  }
}
