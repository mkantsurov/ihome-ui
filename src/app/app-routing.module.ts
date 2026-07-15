import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import MainComponent from './ui/main/main/main.component';
import AccessDeniedComponent from './ui/common/access-denied/access-denied.component';
import GeneralOutdoorComponent from './ui/general/general-outdoor/general-outdoor.component';
import GeneralPowerComponent from './ui/general/general-power/general-power.component';
import GeneralSignInComponent from './ui/general/general-sign-in/general-sign-in.component';
import IndexComponent from './ui/general/index/index.component';
import SummaryPageComponent from './ui/main/summary-page/summary-page.component';
import PowerControlComponent from './ui/main/power-control/power-control.component';
import HeatingControlComponent from './ui/main/heating-control/heating-control.component';
import LightningControlComponent from './ui/main/lightning-control/lightning-control.component';
import AuditLogControlComponent from './ui/main/audit-log-control/audit-log-control.component';
import MessagesComponent from './ui/main/messages/messages.component';
import {authNonCompletedGuard, genericAuthGuard} from "./guards/genericAuthGuard";


const commonRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [authNonCompletedGuard],
    canActivateChild: [authNonCompletedGuard],
    children: [
      {path: '', redirectTo: '/public-outdoor', pathMatch: 'full'},
      {path: 'public-outdoor', component: GeneralOutdoorComponent},
      {path: 'public-power', component: GeneralPowerComponent},
      {path: 'public-sign-in', component: GeneralSignInComponent},
    ]
  },
  {path: 'accessDenied', component: AccessDeniedComponent}
];

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    canActivate: [genericAuthGuard],
    canActivateChild: [genericAuthGuard],
    children: [
      {path: '', redirectTo: '/summary', pathMatch: 'full'},
      {path: 'summary', component: SummaryPageComponent},
      {path: 'power-control', component: PowerControlComponent},
      {path: 'heating-control', component: HeatingControlComponent},
      {path: 'lightning-control', component: LightningControlComponent},
      {path: 'audit-log', component: AuditLogControlComponent},
      {path: 'messages', component: MessagesComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(commonRoutes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  ngOnInit() {
    console.info('Router module starting...');
  }
}
