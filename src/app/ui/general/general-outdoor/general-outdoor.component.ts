import {Component, OnInit} from '@angular/core';
import {GuestService} from "../../../services/guest.service";
import {OutdoorTempStat} from "../../../domain/outdoor-temp-stat";
import {PressureStat} from "../../../domain/pressurestat";
import {GeneralTempChartComponent} from './general-temp-chart/general-temp-chart.component';
import {GeneralPressureChartComponent} from './general-pressure-chart/general-pressure-chart.component';


@Component({
    selector: 'app-general-outdoor',
    templateUrl: './general-outdoor.component.html',
    styleUrls: ['./general-outdoor.component.scss'],
    imports: [
        GeneralTempChartComponent,
        GeneralPressureChartComponent
    ]
})
export class GeneralOutdoorComponent implements OnInit {

  tempStat: OutdoorTempStat;
  pressureStat: PressureStat;

  constructor(public guestService: GuestService) {
  }

  ngOnInit(): void {
    this.guestService.getTempStat().subscribe(response => {
      this.tempStat = response;
      this.guestService.getPressureStat().subscribe(response => {
        this.pressureStat = response;
      });
    })
  }

}
