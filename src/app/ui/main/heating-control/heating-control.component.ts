import { Component, OnInit } from '@angular/core';
import {SystemService} from "../../../services/system.service";
import {HeatingSummary} from "../../../domain/heating-summary";
import {BoilerTempStat} from "../../../domain/boilertempstat";

@Component({
  selector: 'app-heating-control',
  templateUrl: './heating-control.component.html',
  styleUrls: ['./heating-control.component.css']
})
export class HeatingControlComponent implements OnInit {

  heatingSummary: HeatingSummary;
  boilerTempStat: BoilerTempStat;

  constructor(private systemService: SystemService) { }

  ngOnInit(): void {
    this.systemService.getHeatingSummary().subscribe(response => {
      console.log(`received heating summary: ` + JSON.stringify(response));
      this.heatingSummary = response;
      this.systemService.getBoilerTempStat().subscribe(response => {
        this.boilerTempStat = response;
      })
    })
  }

  isPumpGfEnabled(): boolean {
    return false;
  }

  isPumpSfEnabled(): boolean {
    return false;
  }
}
