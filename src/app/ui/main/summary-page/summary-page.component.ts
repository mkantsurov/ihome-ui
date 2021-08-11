import {Component, Input, OnInit} from '@angular/core';
import {TempStat} from '../../../domain/tempstat';
import {SystemService} from '../../../services/system.service';
import {PressureStat} from '../../../domain/pressurestat';
import {LuminosityStat} from '../../../domain/luminositystat';
import {SystemSummary} from '../../../domain/systemsummary';
import {BoilerTempStat} from '../../../domain/boilertempstat';
import * as moment from 'moment';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {

  @Input() systemSummary: SystemSummary = {
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
  };

  @Input() tempStat: TempStat;
  @Input() pressureStat: PressureStat;
  @Input() boilerTempStat: BoilerTempStat;

  constructor(public systemService: SystemService) { }

  ngOnInit(): void {
    this.systemService.getSystemSummary().subscribe(systemData => {
      this.systemSummary = systemData;
      this.systemService.getTempStat().subscribe(tempStat => {
        this.tempStat = tempStat;
        this.systemService.getPressureStat().subscribe(pressureStat => {
          this.pressureStat = pressureStat;
          this.systemService.getBoilerTempStat().subscribe(boilerTempStat => {
            this.boilerTempStat = boilerTempStat;
          })
        })
      })
    })
  }

  getUpTime(): string {
    return moment.duration(this.systemSummary.upTime).humanize();
  }
}
