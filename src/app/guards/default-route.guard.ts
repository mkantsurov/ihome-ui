import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Role} from '../domain/role';

// eslint-disable-next-line
export const defaultRouteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const roles: Role[] = authService.getRoles();

  if (roles.includes(Role.AUTHORIZED_GUEST)) {
    return router.parseUrl('/main/chat');
  }
  return router.parseUrl('/main/summary');
};
