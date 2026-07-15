import {Routes} from '@angular/router';
import {authNonCompletedGuard, genericAuthGuard} from './guards/genericAuthGuard'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/general/index/index.component').then(m => m.default),
    canActivate: [authNonCompletedGuard],
    canActivateChild: [authNonCompletedGuard],
    children: [
      {path: '', redirectTo: '/public-outdoor', pathMatch: 'full'},
      {path: 'public-outdoor', loadComponent: () => import('./ui/general/general-outdoor/general-outdoor.component').then(m => m.GeneralOutdoorComponent)},
      {path: 'public-power', loadComponent: () => import('./ui/general/general-power/general-power.component').then(m => m.GeneralPowerComponent)},
      {path: 'public-sign-in', loadComponent: () => import('./ui/general/general-sign-in/general-sign-in.component').then(m => m.GeneralSignInComponent)},
    ]
  },
  {path: 'accessDenied', loadComponent: () => import('./ui/common/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)},
  {
    path: 'main',
    loadComponent: () => import('./ui/main/main/main.component').then(m => m.MainComponent),
    canActivate: [genericAuthGuard],
    canActivateChild: [genericAuthGuard],
    children: [
      {path: '', redirectTo: '/summary', pathMatch: 'full'},
      {path: 'summary', loadComponent: () => import('./ui/main/summary-page/summary-page.component').then(m => m.SummaryPageComponent)},
      {path: 'power-control', loadComponent: () => import('./ui/main/power-control/power-control.component').then(m => m.PowerControlComponent)},
      {path: 'heating-control', loadComponent: () => import('./ui/main/heating-control/heating-control.component').then(m => m.HeatingControlComponent)},
      {path: 'lightning-control', loadComponent: () => import('./ui/main/lightning-control/lightning-control.component').then(m => m.LightningControlComponent)},
      {path: 'audit-log', loadComponent: () => import('./ui/main/audit-log-control/audit-log-control.component').then(m => m.AuditLogControlComponent)},
      {path: 'messages', loadComponent: () => import('./ui/main/messages/messages.component').then(m => m.MessagesComponent)},
    ]
  }
];
