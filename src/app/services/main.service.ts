import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ModuleSummary} from "../domain/modulesummary";
import { HttpClient, HttpParams } from "@angular/common/http";
import {ModuleData} from "../domain/moduledata";
import {ModuleUpdateRequest} from "../domain/module-update-request";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private baseUrl = '/api/v1/modules';
  constructor(private http: HttpClient) { }

  getModuleList(assignment: number, group: number): Observable<ModuleSummary[]> {
    console.info('Getting module list...');
    let params = new HttpParams();
    if (assignment != null) {
      params = params.set("assignment", assignment.toString())
    }
    if (group != null) {
      params = params.set("group", group.toString());
    }
    return this.http.get<ModuleSummary[]>(`${this.baseUrl}`, {params: params});
  }

  getModuleById(moduleId: number): Observable<ModuleData> {
    console.info('Getting module by id...');
    return this.http.get<ModuleData>(`${this.baseUrl}/${moduleId}`);
  }

  updateModuleConfig(moduleId: number, req: ModuleUpdateRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${moduleId}`, req);
  }

}
