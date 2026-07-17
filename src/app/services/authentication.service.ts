import {inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse,} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ACCESS_TOKEN, ACCESS_TOKEN_EXP_TIME} from '../domain/constant';
import {Role} from "../domain/role";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {
  private http = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);
  private router = inject(Router);


  private baseUrl = '/auth';

  constructor() {

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      if (this.jwtHelper.isTokenExpired(accessToken)) {
        this.refreshToken();
      }
    } else {
      this.refreshToken();
    }
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      if (!this.jwtHelper.isTokenExpired(accessToken)) {
        return true;
      }
    }
    return false;
  }

  getUserId(): number | undefined {
    const decodedToken = this.jwtHelper.decodeToken();
    if (decodedToken && decodedToken.sub) {
      return parseInt(decodedToken.sub.split('/')[2]);
    }
    return undefined;
  }

  getJti(): string | undefined {
    const decodedToken = this.jwtHelper.decodeToken();
    if (decodedToken) {
      return decodedToken.jti;
    }
    return undefined;
  }

  getRoles(): Role[] {
    const decodedToken = this.jwtHelper.decodeToken();
    const roles: Role[] = [];
    if (decodedToken) {
      const scopes: string[] =  decodedToken.scopes
      scopes.forEach(scope => {
        // see AvsGrantedAuthority
        switch (scope) {
          case 'ROLE_ADMIN':
            roles.push(Role.ADMIN);
            break
          case 'ROLE_SUPERVISOR':
            roles.push(Role.SUPERVISOR);
            break;
          case 'ROLE_CHILDREN_ROOM1_MANAGER':
            roles.push(Role.CHILDREN_ROOM1_MANAGER);
            break;
          case 'ROLE_CHILDREN_ROOM2_MANAGER':
            roles.push(Role.CHILDREN_ROOM2_MANAGER);
            break;
          case 'ROLE_AUTHORIZED_GUEST':
            roles.push(Role.AUTHORIZED_GUEST);
            break;
        }
      })
    }
    return roles;
  }

  refreshToken(): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/refresh`, null, {responseType: 'text'}).pipe(
      map((res: string) => {
        if (res) {
          localStorage.setItem(ACCESS_TOKEN, res);
          const accessToken = localStorage.getItem(ACCESS_TOKEN);
          if (accessToken) {
            const expTime = this.jwtHelper.getTokenExpirationDate(accessToken);
            if (expTime) {
              localStorage.setItem(ACCESS_TOKEN_EXP_TIME, "" + expTime.getTime());
              console.log('token refreshed successfully. Exp time: ' + expTime.getTime() + ' Current time: ' + new Date().getTime() + ' Exp time - current time: ' + (expTime.getTime() - new Date().getTime()) + ' ms');
              return true;
            }
          }
          return false;
        }
        return false;
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          console.log('err: ' + err.status + ': ' + err.statusText);
          if (err.status === 401) {
            const navigationExtras: NavigationExtras = {state: {data: 'Access denied.'}};
            this.router.navigate(['/login'], navigationExtras);
            // this.logout();
          }
        }
        return throwError(() => err);
      }));
  }

  login(username: string, password: string): Observable<string> {
    const body = JSON.stringify({username, password});
    const url = this.baseUrl + '/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };

    return this.http.post(url, body, httpOptions).pipe(
      // eslint-disable-next-line
      map((res: any) => {
        if (res.accessToken && res.refreshToken) {
          localStorage.clear();
          localStorage.setItem(ACCESS_TOKEN, res.accessToken);
          localStorage.setItem(ACCESS_TOKEN_EXP_TIME, "" + (new Date().getTime() + 10000));
          return res.id;
        }
      }),
      catchError(err => {
        console.log(err);
        return throwError(err);
      }));
  }

  logout(): void {
    const url = this.baseUrl + '/logout';
    console.log(`Attempt to perform logout. Invoking server (POST): ${url}`);
    const logoutObserver = {
      rt: this.router,
      // eslint-disable-next-line
      next(value: HttpResponse<void>) {
        console.log("Initiating logout.");
        localStorage.clear();
        console.log('storage cleared');
        this.rx.deactivate().then(() => {
          console.log("rxStompService deactivated");
        })
        this.uds.deactivate();
        this.rt.navigate(['/login']);
      },
      // eslint-disable-next-line
      error(err: any) {
        console.log('Logout error ' + JSON.stringify(err));
      },
      complete() {
        console.log('Logout completed: ');
      }
    };
    this.http.post<void>(url, this.getJti(), {observe: 'response'}).subscribe(logoutObserver);
  }

  ngOnDestroy(): void {
  }

}
