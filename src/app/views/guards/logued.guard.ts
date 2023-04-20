import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoguedGuard implements CanActivate {

  constructor(private routes: Router) { }
  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (localStorage.length === 0) {
      return true;
    } else {
      if (localStorage.key(0) === 'TOKEN') {
        this.routes.navigate(['/ideas/view-idea']);
      }
      return false;
    }
  }  
}
