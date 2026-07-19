import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Role} from '../domain/role';

// eslint-disable-next-line
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const userRoles: Role[] = authService.getRoles();
  const allowedRoles = route.data?.['roles'] as Role[] | undefined;

  // If no roles specified in route data, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Check if user has at least one of the allowed roles
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    // Redirect to default route so defaultRouteGuard decides where to go
    return router.parseUrl('/main');
  }

  return true;
};
