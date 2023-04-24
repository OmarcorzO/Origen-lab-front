import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SwalService } from '../../services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public arrayLogins: any

  constructor(public nav: Router, public fb: FormBuilder, public service: AuthService, public swalService: SwalService){

  }

  public loginForm = this.fb.group(
    {
      email: ["", [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,3}')],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
    },
  );

  ngOnInit(): void {

  }
  
  login() {
    var credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    if (this.loginForm.valid) {
      this.swalService.loadingWithText('Por favor espere', 10000000);
      
      this.service.loginUser(credentials).subscribe(
        (res: any) => {
          Swal.close();
          // console.log(res.data);
          localStorage.setItem('TOKEN', res.data.token);
          if (res.data.profile == null) {
            Swal.fire({
              title: 'Bienvenido',
              text: 'Por favor, diligencie la siguiente información',
              icon: 'success',
              confirmButtonColor: '#3e8457',
            })
            this.nav.navigateByUrl('profile')
          } else {
            if (!res.data.profile.is_active) {
              Swal.fire({
                title: 'Advertencia',
                text: 'Su cuenta no ha sido validada todavía',
                icon: 'warning',
                confirmButtonColor: '#3e8457',
              })
              this.nav.navigateByUrl('profile')
            } else {
              this.nav.navigateByUrl('/ideas/view-idea')
            }
            // REEDUX AQUÍ PARA GUARDAR PROFILE
          }
        },
        (error) => {
          this.swalService.error(error.error.data.error);
        }
      )
    } else {
      this.swalService.error('Rellene los campos correctamente');
    }
  }

  register() {
    this.nav.navigateByUrl('register')
  }
}
