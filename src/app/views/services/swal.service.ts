import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  constructor(public routes: Router,) { }

  checkError(status): void {
    if (status === 401) {
      this.error('Tiempo de sesión expirado, inicie sesión nuevamente');
      localStorage.removeItem('TOKEN');
      this.routes.navigate(['/login']);
    } else if (status === 500){
      this.error('Error interno');
    } else {
      this.error('Error al cargar los datos, intente nuevamente');
    }
  }

  confirmation(message): void {
    Swal.fire({
      title: 'Confirmación',
      text: `${message}`,
      icon: 'success',
      confirmButtonColor: '#3e8457',
    })
  }

  error(message): void {
    Swal.fire({
      title: 'Error',
      text: `${message}`,
      icon: 'error',
      confirmButtonColor: '#3e8457'
    })
  }

  loading(time): void {
    Swal.fire({
      title: 'Procesando!',
      icon: 'success',
      timer: time,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  loadingWithText(text, time): void {
    Swal.fire({
      title: 'Cargando!',
      html: text,
      timer: time,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  searching(): void {
    Swal.fire({
      title: "Buscando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }

  close(): void {
    Swal.close();
  }
}
