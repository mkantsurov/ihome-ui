import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../domain/user-info';
import { CreateUserRequest } from '../domain/create-user-request';
import { UpdateUserRequest } from '../domain/update-user-request';
import { SearchParam } from '../domain/search-param';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = '/api/v1/users';
  private http = inject(HttpClient);

  search(filter: string, page: number, size: number): Observable<HttpResponse<UserInfo[]>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filter) params = params.set('filter', filter);
    return this.http.get<UserInfo[]>(this.baseUrl, { params, observe: 'response' });
  }

  searchByFilters(filters: SearchParam[], page: number, size: number): Observable<HttpResponse<UserInfo[]>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.post<UserInfo[]>(`${this.baseUrl}/search`, filters, { params, observe: 'response' });
  }

  getById(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateUserRequest): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.baseUrl, req);
  }

  update(id: number, req: UpdateUserRequest): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.baseUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
