import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ACCESS_TOKEN, REFRESH_TOKEN, ROLE_ADMIN, ROLE_USER} from '../domain/constant';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {GlobalService} from './global.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private baseUrl = '/auth';

  private jwtHelper = new JwtHelperService();

  accessToken: string;
  decodedToken: {
    sub: string,
    scopes: string[],
    iss: string,
    iat: number,
    exp: number
  };

  constructor(private http: HttpClient,
              private globalService: GlobalService) {

    this.accessToken = this.globalService.getFromLocal(ACCESS_TOKEN);

    if (this.jwtHelper.isTokenExpired(this.accessToken))
      this.refreshToken();

    try {
      this.decodedToken = this.jwtHelper.decodeToken(this.accessToken);
    } catch (err) {
      console.error('err: ' + err);
    }
  }

  // NC TODO refactor
  login(username: string, password: string): Observable<void> {
    const body = JSON.stringify({username, password});

    console.log('Passing login request: ' + username + ' body: ' + body);

    const url = this.baseUrl + '/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };
    return this.http.post(url, body, httpOptions).pipe(
      map((res: any) => {
        if (res.accessToken && res.refreshToken) {
          localStorage.clear();
          this.accessToken = res.accessToken;
          this.decodedToken = this.jwtHelper.decodeToken(this.accessToken);
          const uri = this.decodedToken.sub.split('/');
          this.globalService.setUserId(parseInt(uri[2], 10));
          this.globalService.setAccessToken(this.accessToken);
          this.globalService.setRefreshToken(res.refreshToken);
        }
      }),
      catchError(err => throwError(err)));
  }

  validateCertificate(): Observable<any> {
    return this.http.post(`${this.baseUrl}/cert`, {}, {responseType: 'text'});
  }

  authenticateByKey(key: string): Observable<void> {
    return this.http.post(`${this.baseUrl}/get_user_by_key`, key).pipe(
      map((response: any) => {
        if (response.token && response.refreshToken) {
          localStorage.clear();
          this.accessToken = response.token;
          this.decodedToken = this.jwtHelper.decodeToken(this.accessToken);
          this.globalService.addToLocal(ACCESS_TOKEN, this.accessToken);
          this.globalService.addToLocal(REFRESH_TOKEN, response.refreshToken);
        }
      }),
      catchError(err => Observable.throw(err)));
  }


  logout() {
    this.accessToken = null;
    this.decodedToken = null;
    localStorage.clear();
  }

  refreshToken(): Observable<boolean> {
    const refreshToken = this.globalService.getRefreshToken();
    if (refreshToken == null) {
      return of(false);
    }
    return this.http.post(`${this.baseUrl}/refresh`, refreshToken).pipe(
      map((res: any) => {
        if (res.accessToken) {
          this.accessToken = res.accessToken;
          return true;
        }
        return false;
      }),
      catchError(err => of(false)));
  }

  tokenExpired(): boolean {
    if (this.accessToken == null) {
      return true;
    }
    return this.jwtHelper.isTokenExpired(this.accessToken);
  }

  isAdmin(): boolean {
    return this.decodedToken && this.decodedToken.scopes.length > 0 && this.decodedToken.scopes.indexOf(ROLE_ADMIN) !== -1;
  }

  isUser(): boolean {
    return this.decodedToken && this.decodedToken.scopes.length > 0 && this.decodedToken.scopes.indexOf(ROLE_USER) !== -1;
  }

}
