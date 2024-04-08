import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {AuthenticationService} from './services/authentication.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {empty} from 'rxjs/internal/Observer';
import {mergeMap} from 'rxjs/operators';
import {ACCESS_TOKEN, API_PATTERN, GUEST_API_PATTERN} from './domain/constant';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private jwtHelper = new JwtHelperService();

  constructor(private injector: Injector, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler,): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthenticationService);
    console.info('Intercepting jwt request...');

    if (request.url.match(GUEST_API_PATTERN)) {
      return next.handle(this.simpleHeaders(request));
    }

    if (!request.url.match(API_PATTERN)) {
      return next.handle(this.simpleHeaders(request));
    }

    if (!authService.accessToken) {
      this.router.navigate(['/accessDenied']);
      return EMPTY;
    }

    if (!this.jwtHelper.isTokenExpired(authService.accessToken)) {
      return next.handle(this.addTokenToHeader(request));
    }


    return authService.refreshToken().pipe(mergeMap((result) => {
      console.log('refresh status ' + result);
      if (result) {
        return next.handle(this.addTokenToHeader(request));
      } else {
        // SK TODO access denied overlapped with redirect to /
        this.router.navigate(['/accessDenied']);
        authService.logout();
        return EMPTY;
      }
    }));

  }

  private addTokenToHeader(request: HttpRequest<any>): HttpRequest<any> {
    const authService = this.injector.get(AuthenticationService);
    const accept = request.headers.get('Accept');
    const content = request.headers.get('Content-Type');
    const uploadRequest = request.url.includes('upload');
    if (uploadRequest)
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.accessToken}`
        }
      });

    return request.clone({
      setHeaders: {
        Accept: accept ? accept : `application/json`,
        'Content-Type': content ? content : `application/json`,
        Authorization: `Bearer ${authService.accessToken}`
      }
    });
  }

  private simpleHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Accept: `application/json`,
        'Content-Type': `application/json`,
      }
    });
  }
}
