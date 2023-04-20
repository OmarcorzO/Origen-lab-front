import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidateMessageService {
  constructor(public routes: Router,) { }

  getErrorMessage(field: string, form: FormGroup) : string {
    let message = "";
    //.errors?.required
    if (form?.get(field)!.hasError("required")) {
      message = "Este campo es requerido";
    } else if (form?.get(field)!.hasError("minlength")) {
      const minLength = form?.get(field)!.errors?.['minlength'].requiredLength;
      message = `Este campo debe tener un mínimo de ${minLength} caracteres`;
    } else if (form?.get(field)!.hasError("maxlength")) {
      const maxLength = form?.get(field)!.errors?.['maxlength'].requiredLength;
      message = `Este campo debe tener un máximo de ${maxLength} caracteres`;
    } else if (form?.get(field)!.hasError("pattern")) {
      message = "El campo es invalido";
    }

    return message;
  }

  invalidField(field: string, form: FormGroup, formSubmitted: boolean): boolean {
    if (form?.get(field)!.invalid && formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
}
