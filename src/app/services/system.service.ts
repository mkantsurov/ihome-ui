import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {SystemSummary} from '../domain/systemsummary';
import {TempStat} from '../domain/tempstat';
import {PressureStat} from '../domain/pressurestat';
import {ModuleSummary} from '../domain/modulesummary';
import {ModuleData} from '../domain/moduledata';
import {BoilerTempStat} from '../domain/boilertempstat';
import {LuminosityStat} from '../domain/luminositystat';
import {SystemStat} from '../domain/systemstat';
import {LaStat} from '../domain/lastat';
import {PowerSummary} from '../domain/powersummary';
import {HeatingSummary} from '../domain/heating-summary';
import {PowerVoltage} from '../domain/power-voltage';
import {PowerConsumption} from '../domain/power-consumption';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private baseUrl = '/api/v1/system';

  constructor(private http: HttpClient) {
  }

  getSystemSummary(): Observable<SystemSummary> {
    console.info('Getting System Summary...');
    return this.http.get<SystemSummary>(`${this.baseUrl}/summary`)
  }

  getPowerSummary() : Observable<PowerSummary> {
    console.info('Getting Power Summary...');
    return this.http.get<PowerSummary>(`${this.baseUrl}/power-summary`)
  }

  getHeatingSummary() : Observable<HeatingSummary>{
    return this.http.get<HeatingSummary>(`${this.baseUrl}/heating-summary`)
  }

  getTempStat(): Observable<TempStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<TempStat>(`${this.baseUrl}/tempstat`)
  }

  getBoilerTempStat(): Observable<BoilerTempStat> {
    console.info('Getting boiler temperature');
    return this.http.get<BoilerTempStat>(`${this.baseUrl}/boiler-temp-stat`)
  }

  getPressureStat(): Observable<PressureStat> {
    console.info('Getting temperature and pressure statistics...');
    return this.http.get<PressureStat>(`${this.baseUrl}/pressure-stat`)
  }

  getLuminosityStat(): Observable<LuminosityStat> {
    console.info('Getting luminosity and pressure statistics...');
    return this.http.get<LuminosityStat>(`${this.baseUrl}/luminosity-stat`)
  }

  getPowerVoltageStat(): Observable<PowerVoltage> {
    console.info('Getting power voltage statistics...');
    return this.http.get<PowerVoltage>(`${this.baseUrl}/power-voltage-stat`)
  }

  getPowerConsumptionStat(): Observable<PowerConsumption> {
    console.info('Getting power consumption statistics...');
    return this.http.get<PowerConsumption>(`${this.baseUrl}/power-consumption-stat`)
  }

  getSystemStat(): Observable<SystemStat> {
    console.info('Getting system mem statistics...');
    return this.http.get<SystemStat>(`${this.baseUrl}/system-stat`)
  }

  getLaStat(): Observable<LaStat> {
    console.info('Getting la system statistics...');
    return this.http.get<LaStat>(`${this.baseUrl}/la-stat`)
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
