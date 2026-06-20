import {Component, OnInit, signal} from '@angular/core';
import {TempStat} from '../../../domain/tempstat';
import {SystemService} from '../../../services/system.service';
import {PressureStat} from '../../../domain/pressurestat';
import {LuminosityStat} from '../../../domain/luminositystat';
import {SystemSummary} from '../../../domain/systemsummary';
import {BoilerTempStat} from '../../../domain/boilertempstat';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {DecimalPipe, PercentPipe} from '@angular/common';
import {PressureChartComponent} from '../chart/pressurechart/pressure-chart.component';
import {BoilerTempChartComponent} from '../chart/boiler-temp-chart/boiler-temp-chart.component';
import {TempChartComponent} from '../chart/tempchart/temp-chart.component';
import {GeneralPowerChartComponent} from '../../general/general-power/general-power-chart/general-power-chart.component';
import {PowerVoltageExt} from '../../../domain/power-voltage-ext';
import {forkJoin} from 'rxjs';
dayjs.extend(duration);

@Component({
    selector: 'app-summary-page',
    templateUrl: './summary-page.component.html',
    styleUrls: ['./summary-page.component.scss'],
    imports: [
        MatIconModule,
        MatListModule,
        DecimalPipe,
        PercentPipe,
        BoilerTempChartComponent,
        TempChartComponent,
        GeneralPowerChartComponent
    ]
})
export class SummaryPageComponent implements OnInit {

  systemSummary = signal<SystemSummary>({
    boilerTemperature: 0,
    garageHumidity: 0,
    garageTemperature: 0,
    gfTemperature: 0,
    heapMax: 0,
    heapUsage: 0,
    heatingPumpFFMode: 0,
    heatingPumpSFMode: 0,
    loadAvg: 0,
    luminosity: 0,
    outDoorHumidity: 0,
    outDoorTemperature: 0,
    powerStatus: 0,
    pressure: 0,
    pwSrcConverterMode: 0,
    pwSrcDirectMode: 0,
    securityMode: 0,
    sfHumidity: 0,
    sfTemperature: 0,
    upTime: 0
  });
  powerStat = signal<PowerVoltageExt>({
    extVoltage: [{ dt: new Date(), value: 0 }]
  })

  tempStat = signal<TempStat>({
    indoorSf: [{ dt: new Date(), value: 0 }],
    indoorGf: [{ dt: new Date(), value: 0 }],
    garage: [{ dt: new Date(), value: 0 }],
    outdoor: [{ dt: new Date(), value: 0 }]
  });

  pressureStat = signal<PressureStat>({
    pressure: [{ dt: new Date(), value: 0 }]
  });

  boilerTempStat = signal<BoilerTempStat>({
    temperature: [{ dt: new Date(), value: 0 }]
  });
  constructor(public systemService: SystemService) { }

  ngOnInit(): void {
    forkJoin({
      powerStat: this.systemService.getPowerVoltageStat(),
      systemSummary: this.systemService.getSystemSummary(),
      tempStat: this.systemService.getTempStat(),
      pressureStat: this.systemService.getPressureStat(),
      boilerTempStat: this.systemService.getBoilerTempStat()
    }).subscribe({
      next: (results) => {
        this.powerStat.set(results.powerStat as PowerVoltageExt);
        this.systemSummary.set(results.systemSummary);
        this.tempStat.set(results.tempStat);
        this.pressureStat.set(results.pressureStat);
        this.boilerTempStat.set(results.boilerTempStat);
      }
    });
  }
  getUpTime(): string {
    return dayjs.duration(this.systemSummary().upTime).format('D[d] H[h] m[m]');
  }
}
