import { NgModule, Directive } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SummaryComponent} from "./ui/summary/summary.component";
import {GroundfloorComponent} from "./ui/groundfloor/groundfloor.component";
import {SecondfloorComponent} from "./ui/secondfloor/secondfloor.component";
import {GarageComponent} from "./ui/garage/garage.component";
import {IsAdminGuard} from "./guards/is-admin.guard";
import {AuthGuard} from "./guards/auth-guard.service";
import {MainComponent} from "./ui/main/main.component";
import {IndexComponent} from "./ui/common/index/index.component";
import {AccessDeniedComponent} from "./ui/common/access-denied/access-denied.component";
import {ExtlightComponent} from "./ui/extlight/extlight.component";

const commonRoutes: Routes = [
  {
    path: '',
    component: IndexComponent,
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
