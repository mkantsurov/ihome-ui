import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import {Observable} from 'rxjs';

import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class IsUserGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthenticationService, private router: Router) {
  }


  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isUser()) {
      return true;
    }

    this.router.navigate(['/accessDenied']);
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}
