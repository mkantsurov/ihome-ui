import {Component, OnInit} from '@angular/core';
import {SystemService} from "../../services/system.service";
import {SystemSummary} from '../../domain/systemsummary';
import {TempStat} from "../../domain/tempstat";
import {PressureStat} from "../../domain/pressurestat";
import {BoilerTempStat} from "../../domain/boilertempstat";
import {LuminosityStat} from "../../domain/luminositystat";
import {SystemStat} from "../../domain/systemstat";
import {LaStat} from "../../domain/lastat";


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  systemSummary: SystemSummary;
  tempStat: TempStat;
  boilerTempStat: BoilerTempStat;
  pressureStat: PressureStat;
  luminosityStat: LuminosityStat;
  systemStat: SystemStat;
  laStat: LaStat;

  constructor(public systemService: SystemService) {
  }

  ngOnInit() {
    this.systemService.getSystemSummary().subscribe(response => {
      this.systemSummary = response;
      this.systemService.getTempStat().subscribe(response => {
        this.tempStat = response;
        this.systemService.getBoilerTempStat().subscribe(response => {
          this.boilerTempStat = response;
          this.systemService.getPressureStat().subscribe(response => {
            this.pressureStat = response;
            this.systemService.getLuminosityStat().subscribe(response => {
              this.luminosityStat = response;
              this.systemService.getSystemStat().subscribe(response => {
                this.systemStat = response;
                this.systemService.getLaStat().subscribe(response => {
                  this.laStat = response;
                });
              });
            });
          })
        });
      });
    });
  }

}
