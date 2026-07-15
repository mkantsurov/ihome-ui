import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {JwtInterceptor} from './services/jwt-interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserService} from './services/user.service';
import {AuthenticationService} from './services/authentication.service';
import {SystemService} from './services/system.service';
import {AdminService} from './services/admin.service';
import {ErrorHandlerService} from './services/error-handler.service';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TruncatePipe} from './pipes/truncate.pipe';
import {JwtHelperService} from '@auth0/angular-jwt';


@NgModule({
  declarations: [],
  exports: [],
  imports: [
    BrowserModule,
    RouterModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TruncatePipe,
    AppComponent
  ],
  providers: [
    JwtHelperService,
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    UserService,
    AdminService,
    SystemService,
    ErrorHandlerService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule {
}
