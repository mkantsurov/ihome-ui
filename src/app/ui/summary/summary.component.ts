import {Component, OnInit, signal} from '@angular/core';
import {SystemService} from '../../services/system.service';
import {SystemSummary} from '../../domain/systemsummary';
import {TempStat} from '../../domain/tempstat';
import {PressureStat} from '../../domain/pressurestat';
import {BoilerTempStat} from '../../domain/boilertempstat';
import {LuminosityStat} from '../../domain/luminositystat';
import {SystemStat} from '../../domain/systemstat';
import {LaStat} from '../../domain/lastat';
import {MatCardModule} from '@angular/material/card';
import {DecimalPipe, PercentPipe} from '@angular/common';
import {SystemChartComponent} from '../main/chart/system-chart/system-chart.component';
import {SystemChartLaComponent} from '../main/chart/system-chart-la/system-chart-la.component';
import {LuminosityChartComponent} from '../main/chart/luminosity-chart/luminosity-chart.component';
import {TempChartComponent} from '../main/chart/tempchart/temp-chart.component';
import {BoilerTempChartComponent} from '../main/chart/boiler-temp-chart/boiler-temp-chart.component';
import {PressureChartComponent} from '../main/chart/pressurechart/pressure-chart.component';
import {forkJoin} from 'rxjs';


@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css'],
    imports: [
        MatCardModule,
        PercentPipe,
        DecimalPipe,
        SystemChartComponent,
        SystemChartLaComponent,
        LuminosityChartComponent,
        TempChartComponent,
        BoilerTempChartComponent,
        PressureChartComponent
    ]
})
export class SummaryComponent implements OnInit {

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
  tempStat = signal<TempStat>({
    indoorSf: [{ dt: new Date(), value: 0 }],
    indoorGf: [{ dt: new Date(), value: 0 }],
    garage: [{ dt: new Date(), value: 0 }],
    outdoor: [{ dt: new Date(), value: 0 }],
  })
  boilerTempStat = signal<BoilerTempStat>({
    temperature: [{ dt: new Date(), value: 0 }]
  })
  pressureStat = signal<PressureStat>({
    pressure: [{ dt: new Date(), value: 0 }]
  })
  luminosityStat = signal<LuminosityStat>({
    luminosity: [{ dt: new Date(), value: 0 }]
  })
  systemStat = signal<SystemStat>({
    heapMax: [{ dt: new Date(), value: 0 }],
    heapUsage: [{ dt: new Date(), value: 0 }]
  })
  laStat = signal<LaStat>({
    la: [{ dt: new Date(), value: 0 }]
  })

  constructor(public systemService: SystemService) {
  }

  ngOnInit() {
    forkJoin({
      systemSummary: this.systemService.getSystemSummary(),
      tempStat: this.systemService.getTempStat(),
      boilerTempStat: this.systemService.getBoilerTempStat(),
      pressureStat: this.systemService.getPressureStat(),
      luminosityStat: this.systemService.getLuminosityStat(),
      systemStat: this.systemService.getSystemStat(),
      laStat: this.systemService.getLaStat()
    }).subscribe({
      next: (results) => {
        this.systemSummary.set(results.systemSummary);
        this.tempStat.set(results.tempStat);
        this.boilerTempStat.set(results.boilerTempStat);
        this.pressureStat.set(results.pressureStat);
        this.luminosityStat.set(results.luminosityStat);
        this.systemStat.set(results.systemStat);
        this.laStat.set(results.laStat);
      }
    });
  }

}
