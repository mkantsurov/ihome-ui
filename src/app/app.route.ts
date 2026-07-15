import {Routes} from '@angular/router';
import {authNonCompletedGuard, genericAuthGuard} from './guards/genericAuthGuard';
import {AccessDeniedComponent} from './ui/common/access-denied/access-denied.component';
import {GeneralOutdoorComponent} from './ui/general/general-outdoor/general-outdoor.component';
import {GeneralPowerComponent} from './ui/general/general-power/general-power.component';
import {GeneralSignInComponent} from './ui/general/general-sign-in/general-sign-in.component';
import IndexComponent from './ui/general/index/index.component';
import {AuditLogControlComponent} from './ui/main/audit-log-control/audit-log-control.component';
import {HeatingControlComponent} from './ui/main/heating-control/heating-control.component';
import {LightningControlComponent} from './ui/main/lightning-control/lightning-control.component';
import {MainComponent} from './ui/main/main/main.component';
import {MessagesComponent} from './ui/main/messages/messages.component';
import {PowerControlComponent} from './ui/main/power-control/power-control.component';
import {SummaryPageComponent} from './ui/main/summary-page/summary-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => Promise.resolve(IndexComponent),
    canActivate: [authNonCompletedGuard],
    canActivateChild: [authNonCompletedGuard],
    children: [
      {path: '', redirectTo: '/public-outdoor', pathMatch: 'full'},
      {
        path: 'public-outdoor',
        loadComponent: () => Promise.resolve(GeneralOutdoorComponent)
      },
      {
        path: 'public-power',
        loadComponent: () => Promise.resolve(GeneralPowerComponent)
      },
      {
        path: 'public-sign-in',
        loadComponent: () => Promise.resolve(GeneralSignInComponent)
      },
    ]
  },
  {
    path: 'accessDenied',
    loadComponent: () => Promise.resolve(AccessDeniedComponent)
  },
  {
    path: 'main',
    loadComponent: () => Promise.resolve(MainComponent),
    canActivate: [genericAuthGuard],
    canActivateChild: [genericAuthGuard],
    children: [
      {path: '', redirectTo: '/summary', pathMatch: 'full'},
      {path: 'summary', loadComponent: () => Promise.resolve(SummaryPageComponent)},
      {
        path: 'power-control',
        loadComponent: () => Promise.resolve(PowerControlComponent)
      },
      {
        path: 'heating-control',
        loadComponent: () => Promise.resolve(HeatingControlComponent)
      },
      {
        path: 'lightning-control',
        loadComponent: () => Promise.resolve(LightningControlComponent)
      },
      {
        path: 'audit-log',
        loadComponent: () => Promise.resolve(AuditLogControlComponent)
      },
      {path: 'messages', loadComponent: () => Promise.resolve(MessagesComponent)},
    ]
  }
];
