import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from "rxjs";
import {SystemSummary} from '../domain/systemsummary';
import {TempStat} from '../domain/tempstat';
import {PressureStat} from '../domain/pressurestat';
import {ModuleSummary} from "../domain/modulesummary";
import {ModuleData} from "../domain/moduledata";
import {BoilerTempStat} from "../domain/boilertempstat";
import {LuminosityStat} from "../domain/luminositystat";
import {SystemStat} from "../domain/systemstat";
import {LaStat} from "../domain/lastat";

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private baseUrl = '/api/v1/system';

  constructor(private http: HttpClient) {
  }

  getSystemSummary(): Observable<SystemSummary> {
    console.info('Getting System Summary...');
    return this.http.get<SystemSummary>(`${this.baseUrl}/summary/`)
  }

  getTempStat(): Observable<TempStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<TempStat>(`${this.baseUrl}/tempstat/`)
  }

  getBoilerTempStat(): Observable<BoilerTempStat> {
    console.info('Getting boiler temperature');
    return this.http.get<BoilerTempStat>(`${this.baseUrl}/boiler-temp-stat/`)
  }

  getPressureStat(): Observable<PressureStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PressureStat>(`${this.baseUrl}/pressure-stat/`)
  }

  getLuminosityStat(): Observable<LuminosityStat> {
    console.info('Getting luminosity and pressure statistics...');
    return this.http.get<LuminosityStat>(`${this.baseUrl}/luminositystat/`)
  }

  getSystemStat(): Observable<SystemStat> {
    console.info('Getting system mem statistics...');
    return this.http.get<SystemStat>(`${this.baseUrl}/systemstat/`)
  }

  getLaStat(): Observable<LaStat> {
    console.info('Getting la system statistics...');
    return this.http.get<LaStat>(`${this.baseUrl}/lastat/`)
  }

  getModuleList(category: number): Observable<ModuleSummary[]> {
    console.info('Getting module list...');
    return this.http.get<ModuleSummary[]>(`${this.baseUrl}/modulelist/${category}`)
  }

  updateModuleMode(moduleId: number, newMode: number) {
    return this.http.put<ModuleSummary>(`${this.baseUrl}/modulemode/${moduleId}`, newMode)
  }

  updateModuleState(moduleId: number, newState: number) {
    return this.http.put<ModuleSummary>(`${this.baseUrl}/moduleoutput/${moduleId}`, newState)
  }

  getModuleData(moduleId: number) {
    return this.http.get<ModuleData>(`${this.baseUrl}/moduledata/${moduleId}`)
  }

}
