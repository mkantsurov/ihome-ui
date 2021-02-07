import { NgModule, Directive } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SummaryComponent} from "./ui/summary/summary.component";
import {GroundfloorComponent} from "./ui/groundfloor/groundfloor.component";
import {SecondfloorComponent} from "./ui/secondfloor/secondfloor.component";
import {GarageComponent} from "./ui/garage/garage.component";
import {IsAdminGuard} from "./guards/is-admin.guard";
import {AuthGuard} from "./guards/auth-guard.service";
import {MainComponent} from "./ui/main/main/main.component";
import {AccessDeniedComponent} from "./ui/common/access-denied/access-denied.component";
import {ExtlightComponent} from "./ui/extlight/extlight.component";
import {GeneralOutdoorComponent} from "./ui/general/general-outdoor/general-outdoor.component";
import {GeneralPowerComponent} from "./ui/general/general-power/general-power.component";
import {GeneralSignInComponent} from "./ui/general/general-sign-in/general-sign-in.component";
import {IndexComponent} from "./ui/general/index/index.component";


const commonRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
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
    canActivate: [AuthGuard, IsAdminGuard],
    canActivateChild: [AuthGuard, IsAdminGuard],
    children: [
      {path: '', redirectTo: '/summary', pathMatch: 'full'},
      {path: 'summary', component: SummaryComponent},
      {path: 'gf', component: GroundfloorComponent},
      {path: 'sf', component: SecondfloorComponent},
      {path: 'garage', component: GarageComponent},
      {path: 'el', component: ExtlightComponent},
    ]
  }
];

// @Directive()
@NgModule({
  imports: [RouterModule.forRoot(commonRoutes, { relativeLinkResolution: 'legacy' }), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  ngOnInit() {
    console.info('Router module starting...');
  }
}
