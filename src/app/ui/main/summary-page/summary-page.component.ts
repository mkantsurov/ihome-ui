import { Component, OnInit } from '@angular/core';
import {TempStat} from "../../../domain/tempstat";
import {SystemService} from "../../../services/system.service";
import {PressureStat} from "../../../domain/pressurestat";
import {LuminosityStat} from "../../../domain/luminositystat";
import {SystemSummary} from "../../../domain/systemsummary";
import {BoilerTempStat} from "../../../domain/boilertempstat";

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {

  systemSummary: SystemSummary;
  tempStat: TempStat;
  pressureStat: PressureStat;
  boilerTempStat: BoilerTempStat;


  constructor(public systemService: SystemService) { }

  ngOnInit(): void {
    this.systemService.getSystemSummary().subscribe(response => {
      this.systemSummary = response;
      this.systemService.getTempStat().subscribe(response => {
        this.tempStat = response;
        this.systemService.getPressureStat().subscribe(response => {
          this.pressureStat = response;
          this.systemService.getBoilerTempStat().subscribe(response => {
            this.boilerTempStat = response;
          })
        })
      })
    })
  }

}
