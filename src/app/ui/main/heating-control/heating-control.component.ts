import {Component, Input, OnInit} from '@angular/core';
import {SystemService} from '../../../services/system.service';
import {HeatingSummary} from '../../../domain/heating-summary';
import {BoilerTempStat} from '../../../domain/boilertempstat';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {BoilerTempChartComponent} from '../chart/boiler-temp-chart/boiler-temp-chart.component';
import {ModuleListComponent} from '../common/module-list/module-list.component';
import {DecimalPipe} from '@angular/common';
import {PowerVoltageChartComponent} from '../chart/power-voltage-chart/power-voltage-chart.component';

@Component({
    selector: 'app-heating-control',
    templateUrl: './heating-control.component.html',
    styleUrls: ['./heating-control.component.scss'],
    imports: [
        MatIconModule,
        MatListModule,
        BoilerTempChartComponent,
        ModuleListComponent,
        DecimalPipe
    ]
})
export class HeatingControlComponent implements OnInit {

  @Input() heatingSummary: HeatingSummary = {
    boilerTemperature: 0,
    garageHumidity: 0,
    garageTemperature: 0,
    gfTemperature: 0,
    outDoorHumidity: 0,
    outDoorTemperature: 0,
    sfHumidity: 0,
    sfTemperature: 0
  };

  @Input() boilerTempStat: BoilerTempStat;

  constructor(private systemService: SystemService) { }

  ngOnInit(): void {
    this.systemService.getHeatingSummary().subscribe(response => {
      console.log(`received heating summary: ` + JSON.stringify(response));
      this.heatingSummary = response;
      this.systemService.getBoilerTempStat().subscribe(boilerData => {
        this.boilerTempStat = boilerData;
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
