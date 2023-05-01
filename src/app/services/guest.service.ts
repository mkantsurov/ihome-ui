import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {PressureStat} from "../domain/pressurestat";
import {OutdoorTempStat} from "../domain/outdoor-temp-stat";
import {PowerVoltage} from "../domain/power-voltage";
import {PowerVoltageExt} from '../domain/power-voltage-ext';
import {ExtPowerSummary} from '../domain/ext-power-summary';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  private baseUrl = '/guest-api/v1/stats';

  constructor(private http: HttpClient) { }

  getTempStat(): Observable<OutdoorTempStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<OutdoorTempStat>(`${this.baseUrl}/outdoor-temp-stat`)
  }

  getPressureStat(): Observable<PressureStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PressureStat>(`${this.baseUrl}/pressure-stat`)
  }

  getPowerStat(): Observable<PowerVoltageExt> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PowerVoltageExt>(`${this.baseUrl}/power-stat`)
  }

  getExtPowerVoltageStat(): Observable<ExtPowerSummary> {
    console.info('Getting power voltage statistics...');
    return this.http.get<ExtPowerSummary>(`${this.baseUrl}/power-summary/`)
  }

}
