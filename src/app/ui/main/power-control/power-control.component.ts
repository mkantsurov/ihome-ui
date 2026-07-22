import {Component, OnInit, signal} from '@angular/core';
import {LuminosityStat} from '../../../domain/luminositystat';
import {SystemService} from '../../../services/system.service';
import {PowerSummary} from '../../../domain/powersummary';
import {GuestService} from '../../../services/guest.service';
import {PowerVoltage} from '../../../domain/power-voltage';
import {PowerConsumption} from '../../../domain/power-consumption';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {LuminosityChartComponent} from '../chart/luminosity-chart/luminosity-chart.component';
import {PowerVoltageChartComponent} from '../chart/power-voltage-chart/power-voltage-chart.component';
import {PowerConsumptionChartComponent} from '../chart/power-consumption-chart/power-consumption-chart.component';
import {ModuleListComponent} from '../common/module-list/module-list.component';
import {BoilerTempChartComponent} from '../chart/boiler-temp-chart/boiler-temp-chart.component';
import {DecimalPipe} from '@angular/common';

@Component({
    selector: 'app-power-control',
    templateUrl: './power-control.component.html',
    styleUrls: ['./power-control.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        MatListModule,
        LuminosityChartComponent,
        PowerVoltageChartComponent,
        PowerConsumptionChartComponent,
        ModuleListComponent,
        DecimalPipe
    ]
})
export default class PowerControlComponent implements OnInit {

  powerSummary = signal<PowerSummary>({
    luminosity: 0,
    extVoltage: 0,
    extCurrent: 0,
    extFrequency: 0,
    extConsumption: 0,
    intVoltage: 0,
    intCurrent: 0,
    intFrequency: 0,
    intConsumption: 0,
    intBckVoltage: 0,
    intBckCurrent: 0,
    intBckFrequency: 0,
    intBckConsumption: 0,
    securityMode: 0,
    pwSrcConverterMode: 0,
    pwSrcDirectMode: 0
  });

  powerVoltageStat = signal<PowerVoltage>({
    extVoltage: [{
      dt: new Date(),
      value: 0
    }],
    intVoltage: [{
      dt: new Date(),
      value: 0
    }],
    intBckVoltage: [{
      dt: new Date(),
      value: 0
    }],
  })

  powerConsumptionStat = signal<PowerConsumption>({
    extConsumption: [{
      dt: new Date(),
      value: 0
    }],
    intConsumption: [{
      dt: new Date(),
      value: 0
    }],
    intBckConsumption: [{
      dt: new Date(),
      value: 0
    }],
  })

  luminosityStat = signal<LuminosityStat>({
    luminosity: [{
      dt: new Date(),
      value: 0
    }]
  })

  constructor(private systemService: SystemService, private guestService: GuestService) {}

  ngOnInit(): void {
    this.systemService.getPowerSummary().subscribe(response => {
      console.log(`received power summary: ` + JSON.stringify(response));
      this.powerSummary.set(response);
      this.systemService.getLuminosityStat().subscribe(luminosityStat => {
        this.luminosityStat.set(luminosityStat);
        this.systemService.getPowerVoltageStat().subscribe(powerVoltageStat => {
          this.powerVoltageStat.set(powerVoltageStat);
          this.systemService.getPowerConsumptionStat().subscribe(powerConsumptionStat => {
            this.powerConsumptionStat.set(powerConsumptionStat);
          })
        })
      })
    });
  }

  isExternalPowerSourceOk(): boolean {
    return +this.powerSummary().extVoltage > 1700 && +this.powerSummary().extVoltage < 2450;
  }
}
