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

  systemSummary: SystemSummary;
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
    this.systemService.getSystemSummary().subscribe(response => {
      this.systemSummary = response;
      this.systemService.getTempStat().subscribe(response => {
        this.tempStat.set(response);
        this.systemService.getBoilerTempStat().subscribe(response => {
          this.boilerTempStat.set(response);
          this.systemService.getPressureStat().subscribe(response => {
            this.pressureStat.set(response);
            this.systemService.getLuminosityStat().subscribe(response => {
              this.luminosityStat.set(response);
              this.systemService.getSystemStat().subscribe(response => {
                this.systemStat.set(response);
                this.systemService.getLaStat().subscribe(response => {
                  this.laStat.set(response);
                });
              });
            });
          })
        });
      });
    });
  }

}
