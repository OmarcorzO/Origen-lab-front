import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../services/auth.service";
import {ValidationMessagesService } from '../../services/validation-messages.service'
import { cilLockLocked, cilChevronDoubleLeft } from '@coreui/icons';

@Component({
  selector: "app-dashboard",
  templateUrl: "register.component.html",
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  icons = { cilLockLocked, cilChevronDoubleLeft };

  public formSubmitted = false;

  public arrayUsers!: [
    {
      email: any;
      password: any;
    }
  ];

  constructor(
    public nav: Router,
    private fb: FormBuilder,
    private service: AuthService,
    private validateService: ValidationMessagesService
  ) {}

  ngOnInit(): void {}
  public registerForm = this.fb.group({
    email: [
      "",
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          "[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}"
        ),
      ],
    ],
    password: [
      "",
      [Validators.required, Validators.minLength(8)],
    ],
    repeatPassword: [
      "",
      [Validators.required, Validators.minLength(8)],
    ],
  });

  return() {
    this.nav.navigateByUrl("login");
  }

  register() {
    this.formSubmitted = true;
    this.registerForm.patchValue({
      email: this.registerForm.value.email?.trim(),
      password: this.registerForm.value.password?.trim(),
      repeatPassword: this.registerForm.value.repeatPassword?.trim(),
    });

    if (this.registerForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Campos erróneos',
        icon: 'error',
        confirmButtonColor: '#3e8457',
      })
    } else {
      this.service.registerUser(this.registerForm.value).subscribe(
        (res: any) => {
          Swal.fire({
            title: 'Bienvenido',
            icon: 'success',
            confirmButtonColor: '#3e8457',
          })
          localStorage.setItem("TOKEN", res.data.token);
          this.nav.navigateByUrl("profile");
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Usuario ya existente',
            icon: 'error',
            confirmButtonColor: '#3e8457',
          })
        }
      );
    }
  }

  /**
   * Valida que los campos sean correctos
   *
   * @param field Campo a validar.
   * @returns Si no hay problemas con los campos retorna false,
   * en caso contrario retorna true.
   */
  invalidField(field: string): boolean {
    return this.validateService.invalidField(field, this.registerForm, this.formSubmitted);
  }

  /**
   * Administra los mensajes de error para los datos del formulario
   *
   * @param field Campo a validar
   * @returns De acuerdo al error que tenga el campo asigna el mensaje respectivo,
   * si no hubo ningún error no se asigna el mensaje al campo.
   */
  getErrorMessage(field: string): string {
    return this.validateService.getErrorMessage(field, this.registerForm);
  }

  /**
   * Valida que ambas contraseñas sean iguales
   *
   * @returns Si ambas contraseñas del form respectivo son correctas
   * retorna false, en caso contrario retorna true como alerta.
   */
  invalidPasswords() {
    const pass1 = this.registerForm.get("password")!.value;
    const pass2 = this.registerForm.get("repeatPassword")!.value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Valida que ambas contraseñas sean iguales
   *
   * @returns Si ambas contraseñas del form respectivo son correctas
   * retorna false, en caso contrario retorna true como alerta.
   */
  invalidRol() {
    const rol = this.registerForm?.get("rol")?.value;
    if (rol == 0 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
}
