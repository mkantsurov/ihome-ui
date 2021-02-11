import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {PressureStat} from "../domain/pressurestat";
import {OutdoorTempStat} from "../domain/outdoor-temp-stat";
import {PowerStat} from "../domain/power-stat";


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private baseUrl = '/api/v1/guest';

  constructor(private http: HttpClient) { }

  getTempStat(): Observable<OutdoorTempStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<OutdoorTempStat>(`${this.baseUrl}/outdoor-temp-stat/`)
  }

  getPressureStat(): Observable<PressureStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PressureStat>(`${this.baseUrl}/pressure-stat/`)
  }

  getPowerStat(): Observable<PowerStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PowerStat>(`${this.baseUrl}/power-stat/`)
  }

}
