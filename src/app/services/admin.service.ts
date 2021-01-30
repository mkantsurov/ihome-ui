import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = '/api/v1/admin';

  constructor(private http: HttpClient) {
  }
}
