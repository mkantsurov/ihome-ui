import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ErrorMessageEntry} from '../domain/error-message-entry';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {
  }

  getErrorCount(httpParams: HttpParams): Observable<any> {
    return this.http.head<void>(`${this.baseUrl}/errors`, {params: httpParams, observe: 'response'});
  }
  searchErrors(page: number, size: number, params: HttpParams): Observable<ErrorMessageEntry[]> {
    return this.http.get<ErrorMessageEntry[]>(`${this.baseUrl}/errors?page=${page}&size=${size}`, {params});
  }
}
