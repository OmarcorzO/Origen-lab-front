import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private routes: Router, private auth: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      if (localStorage.length === 0) {
        this.routes.navigate(['/login']);
        return false;
      } else {
        if (localStorage.key(0) !== 'TOKEN') {
          this.routes.navigate(['/login']);
        } else {
          const token = localStorage.getItem('TOKEN');
          this.auth.getProfile(token).subscribe(
            (res: any) => {
              if (res.data.profile === null) {
                this.routes.navigate(['/profile']);
              } else if (!res.data.profile.is_active) {
                this.routes.navigate(['/profile']);
              }
            },
            (error) => { 
              console.log(error);
            }
          )
        }
        return true;
      }
  }
  
}
