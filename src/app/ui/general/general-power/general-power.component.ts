import { Component, OnInit } from '@angular/core';
import {GuestService} from '../../../services/guest.service';
import {PowerVoltageExt} from '../../../domain/power-voltage-ext';
import {ExtPowerSummary} from '../../../domain/ext-power-summary';
import {GeneralPowerChartComponent} from './general-power-chart/general-power-chart.component';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {GeneralPressureChartComponent} from '../general-outdoor/general-pressure-chart/general-pressure-chart.component';

@Component({
    selector: 'app-general-power',
    templateUrl: './general-power.component.html',
    styleUrls: ['./general-power.component.css'],
    imports: [
        GeneralPowerChartComponent,
        MatIconModule,
        MatListModule,
        GeneralPressureChartComponent
    ]
})
export class GeneralPowerComponent implements OnInit {

  powerStat: PowerVoltageExt;
  powerSummary: ExtPowerSummary;

  constructor(public guestService: GuestService) {
    this.powerSummary = {
      extVoltage: 0,
      extFrequency: 0
    }
  }

  ngOnInit(): void {
    this.guestService.getPowerStat().subscribe(response => {
      this.powerStat = response;
      this.guestService.getExtPowerVoltageStat().subscribe(powerSummary => {
        this.powerSummary = powerSummary;
      })
    })
  }

}
