import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SummaryComponent} from './ui/summary/summary.component';
import {GroundfloorComponent} from './ui/groundfloor/groundfloor.component';
import {SecondfloorComponent} from './ui/secondfloor/secondfloor.component';
import {GarageComponent} from './ui/garage/garage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {JwtInterceptor} from "./jwt-interceptor";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModuleComponent} from './ui/module/module.component';
import {AuthGuard} from "./guards/auth-guard.service";
import {IsUserGuard} from "./guards/is-user.guard";
import {UserService} from "./services/user.service";
import {IsAdminGuard} from "./guards/is-admin.guard";
import {AuthenticationService} from "./services/authentication.service";
import {SystemService} from "./services/system.service";
import {AdminService} from "./services/admin.service";
import {MainComponent} from './ui/main/main/main.component';
import {AccessDeniedComponent} from './ui/common/access-denied/access-denied.component';
import {HeaderComponent} from './ui/common/header/header.component';
import {ExtlightComponent} from './ui/extlight/extlight.component';
import {TempChartComponent} from './ui/chart/tempchart/temp-chart.component';
import {PressureChartComponent} from './ui/chart/pressurechart/pressure-chart.component';
import {BoilerTempChartComponent} from './ui/chart/boiler-temp-chart/boiler-temp-chart.component';
import {LeftMenuComponent} from './ui/left-menu/left-menu.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTreeModule} from "@angular/material/tree";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {SystemChartComponent} from './ui/chart/system-chart/system-chart.component';
import {LuminosityChartComponent} from './ui/chart/luminosity-chart/luminosity-chart.component';
import {SystemChartLaComponent} from './ui/chart/system-chart-la/system-chart-la.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import { GeneralOutdoorComponent } from './ui/general/general-outdoor/general-outdoor.component';
import { GeneralPowerComponent } from './ui/general/general-power/general-power.component';
import { GeneralSignInComponent } from './ui/general/general-sign-in/general-sign-in.component';
import { IndexComponent } from './ui/general/index/index.component';
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    GroundfloorComponent,
    SecondfloorComponent,
    GarageComponent,
    ModuleComponent,
    MainComponent,
    AccessDeniedComponent,
    HeaderComponent,
    ExtlightComponent,
    TempChartComponent,
    PressureChartComponent,
    BoilerTempChartComponent,
    LeftMenuComponent,
    SystemChartComponent,
    LuminosityChartComponent,
    SystemChartLaComponent,
    GeneralOutdoorComponent,
    GeneralPowerComponent,
    GeneralSignInComponent,
    IndexComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatTreeModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule
  ],
  providers: [
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    UserService,
    AdminService,
    SystemService,
    AuthGuard,
    IsAdminGuard,
    IsUserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
