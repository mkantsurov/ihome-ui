import {Routes} from '@angular/router';
import {authNonCompletedGuard, genericAuthGuard} from './guards/genericAuthGuard';
import {defaultRouteGuard} from './guards/default-route.guard';
import {roleGuard} from './guards/role.guard';
import {Role} from './domain/role';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/general/index/index.component'),
    canActivate: [authNonCompletedGuard],
    canActivateChild: [authNonCompletedGuard],
    children: [
      {path: '', redirectTo: '/public-outdoor', pathMatch: 'full'},
      {
        path: 'public-outdoor',
        loadComponent: () => import('./ui/general/general-outdoor/general-outdoor.component')
      },
      {
        path: 'public-power',
        loadComponent: () => import('./ui/general/general-power/general-power.component')
      },
      {
        path: 'public-sign-in',
        loadComponent: () => import('./ui/general/general-sign-in/general-sign-in.component')
      },
    ]
  },
  {
    path: 'login',
    redirectTo: '/public-sign-in',
    pathMatch: 'full'
  },
  {
    path: 'accessDenied',
    loadComponent: () => import('./ui/common/access-denied/access-denied.component')
  },
  {
    path: 'main',
    loadComponent: () => import('./ui/main/main/main.component'),
    canActivate: [genericAuthGuard],
    canActivateChild: [genericAuthGuard],
    children: [
      // Default route: redirect based on user role
      {path: '', canActivate: [defaultRouteGuard], children: []},
      {
        path: 'summary',
        loadComponent: () => import('./ui/main/summary-page/summary-page.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN, Role.SUPERVISOR, Role.CHILDREN_ROOM1_MANAGER, Role.CHILDREN_ROOM2_MANAGER]}
      },
      {
        path: 'power-control',
        loadComponent: () => import('./ui/main/power-control/power-control.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: 'heating-control',
        loadComponent: () => import('./ui/main/heating-control/heating-control.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: 'lightning-control',
        loadComponent: () => import('./ui/main/lightning-control/lightning-control.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: 'audit-log',
        loadComponent: () => import('./ui/main/audit-log-control/audit-log-control.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: 'messages',
        loadComponent: () => import('./ui/main/messages/messages.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
      {
        path: 'chat',
        loadComponent: () => import('./ui/main/chat/chat.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN, Role.SUPERVISOR, Role.CHILDREN_ROOM1_MANAGER, Role.CHILDREN_ROOM2_MANAGER, Role.AUTHORIZED_GUEST]}
      },
      {
        path: 'user-management',
        loadComponent: () => import('./ui/main/user-management/user-management.component'),
        canActivate: [roleGuard],
        data: {roles: [Role.ADMIN]}
      },
    ]
  }
];
