import {Component, Input, OnInit} from '@angular/core';
import {SystemService} from '../../../services/system.service';
import {HeatingSummary} from '../../../domain/heating-summary';
import {BoilerTempStat} from '../../../domain/boilertempstat';

@Component({
  selector: 'app-heating-control',
  templateUrl: './heating-control.component.html',
  styleUrls: ['./heating-control.component.css']
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
