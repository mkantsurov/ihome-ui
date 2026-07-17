import {CanActivateFn, CanMatchFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
// eslint-disable-next-line
export const genericAuthGuard: CanActivateFn = (route, state) => {
  return inject(AuthenticationService).isAuthenticated()
    ? true
    : inject(Router).parseUrl('/login');
};
// eslint-disable-next-line
export const authNonCompletedGuard: CanMatchFn = (route, state) => {
  return !inject(AuthenticationService).isAuthenticated()
    ? true
    : inject(Router).parseUrl('/main');
};
