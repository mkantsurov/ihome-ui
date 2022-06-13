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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {JwtInterceptor} from './jwt-interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModuleComponent} from './ui/module/module.component';
import {AuthGuard} from './guards/auth-guard.service';
import {IsUserGuard} from './guards/is-user.guard';
import {GuestGuard} from './guards/guest-guard.service';
import {UserService} from './services/user.service';
import {IsAdminGuard} from './guards/is-admin.guard';
import {AuthenticationService} from './services/authentication.service';
import {SystemService} from './services/system.service';
import {AdminService} from './services/admin.service';
import {MainComponent} from './ui/main/main/main.component';
import {AccessDeniedComponent} from './ui/common/access-denied/access-denied.component';
import {HeaderComponent} from './ui/common/header/header.component';
import {ExtlightComponent} from './ui/extlight/extlight.component';
import {TempChartComponent} from './ui/main/chart/tempchart/temp-chart.component';
import {PressureChartComponent} from './ui/main/chart/pressurechart/pressure-chart.component';
import {BoilerTempChartComponent} from './ui/main/chart/boiler-temp-chart/boiler-temp-chart.component';
import {LeftMenuComponent} from './ui/left-menu/left-menu.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {SystemChartComponent} from './ui/main/chart/system-chart/system-chart.component';
import {LuminosityChartComponent} from './ui/main/chart/luminosity-chart/luminosity-chart.component';
import {SystemChartLaComponent} from './ui/main/chart/system-chart-la/system-chart-la.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import { GeneralOutdoorComponent } from './ui/general/general-outdoor/general-outdoor.component';
import { GeneralPowerComponent } from './ui/general/general-power/general-power.component';
import { GeneralSignInComponent } from './ui/general/general-sign-in/general-sign-in.component';
import { IndexComponent } from './ui/general/index/index.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { GeneralTempChartComponent } from './ui/general/general-outdoor/general-temp-chart/general-temp-chart.component';
import { GeneralPowerChartComponent } from './ui/general/general-power/general-power-chart/general-power-chart.component';
import { GeneralPressureChartComponent } from './ui/general/general-outdoor/general-pressure-chart/general-pressure-chart.component';
import { SummaryPageComponent } from './ui/main/summary-page/summary-page.component';
import { PowerControlComponent } from './ui/main/power-control/power-control.component';
import { HeatingControlComponent } from './ui/main/heating-control/heating-control.component';
import { LightningControlComponent } from './ui/main/lightning-control/lightning-control.component';
import { AuditLogControlComponent } from './ui/main/audit-log-control/audit-log-control.component';
import { MessagesComponent } from './ui/main/messages/messages.component';
import { ModuleListComponent } from './ui/main/common/module-list/module-list.component';
import { PowerChartComponent } from './ui/main/chart/power-chart/power-chart.component';
import { ExceptionModalComponent } from './ui/common/exception-modal-component/exception-modal.component';
import {TruncatePipe} from './pipes/truncate.pipe';
import {ErrorHandlerService} from './services/error-handler.service';
import { ModuleConfigComponent } from './ui/main/common/module-list/module-config/module-config.component';
import {MatRadioModule} from '@angular/material/radio';

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
    IndexComponent,
    GeneralTempChartComponent,
    GeneralPowerChartComponent,
    GeneralPressureChartComponent,
    SummaryPageComponent,
    PowerControlComponent,
    HeatingControlComponent,
    LightningControlComponent,
    AuditLogControlComponent,
    MessagesComponent,
    ModuleListComponent,
    PowerChartComponent,
    ExceptionModalComponent,
    TruncatePipe,
    ModuleConfigComponent
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
    MatTableModule,
    MatExpansionModule,
    MatTreeModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule,
    MatRadioModule,
  ],exports: [ExceptionModalComponent],
  providers: [
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    UserService,
    AdminService,
    SystemService,
    AuthGuard,
    IsAdminGuard,
    IsUserGuard,
    GuestGuard,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
