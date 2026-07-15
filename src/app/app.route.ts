import {Routes} from '@angular/router';
import {authNonCompletedGuard, genericAuthGuard} from './guards/genericAuthGuard';

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
    path: 'accessDenied',
    loadComponent: () => import('./ui/common/access-denied/access-denied.component')
  },
  {
    path: 'main',
    loadComponent: () => import('./ui/main/main/main.component'),
    canActivate: [genericAuthGuard],
    canActivateChild: [genericAuthGuard],
    children: [
      {path: '', redirectTo: '/summary', pathMatch: 'full'},
      {path: 'summary', loadComponent: () => import('./ui/main/summary-page/summary-page.component')},
      {
        path: 'power-control',
        loadComponent: () => import('./ui/main/power-control/power-control.component')
      },
      {
        path: 'heating-control',
        loadComponent: () => import('./ui/main/heating-control/heating-control.component')
      },
      {
        path: 'lightning-control',
        loadComponent: () => import('./ui/main/lightning-control/lightning-control.component')
      },
      {
        path: 'audit-log',
        loadComponent: () => import('./ui/main/audit-log-control/audit-log-control.component')
      },
      {path: 'messages', loadComponent: () => import('./ui/main/messages/messages.component')},
    ]
  }
];
