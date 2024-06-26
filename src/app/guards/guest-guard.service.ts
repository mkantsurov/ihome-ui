import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {UserService} from '../services/user.service';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class GuestGuard  {

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

}

