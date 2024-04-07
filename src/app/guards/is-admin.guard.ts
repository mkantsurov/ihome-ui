import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../services/authentication.service';

@Injectable({providedIn: 'root'})
export class IsAdminGuard  {

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAdmin()) {
      return true;
    }

    this.router.navigate(['/accessDenied']);
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

}
