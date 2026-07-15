import {Component, OnInit, signal} from '@angular/core';
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
        MatListModule
    ]
})
export default class GeneralPowerComponent implements OnInit {

  powerStat = signal<PowerVoltageExt>({
    extVoltage: [{ dt: new Date(), value: 0 }]
  })

  powerSummary = signal<ExtPowerSummary>({
    extVoltage: 0,
    extFrequency: 0
  });

  constructor(public guestService: GuestService) {}

  ngOnInit(): void {
    this.guestService.getPowerStat().subscribe(response => {
      this.powerStat.set(response);
      this.guestService.getExtPowerVoltageStat().subscribe(powerSummary => {
        this.powerSummary.set(powerSummary);
      })
    })
  }

}
