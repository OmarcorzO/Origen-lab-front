import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { SwalService } from '../../services/swal.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(public nav: Router, public service: AuthService, public swalService: SwalService){

  }

  ngOnInit(): void {

  }
  
  redirectLanding(type: number) {
    if(type === 0) {
      window.location.href = environment.landingAdminOrigin;
    } else {
      this.nav.navigateByUrl('/login')
    }
  }
}
