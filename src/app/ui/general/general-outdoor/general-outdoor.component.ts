import {Component, OnInit, signal} from '@angular/core';
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
export default class GeneralOutdoorComponent implements OnInit {

  tempStat = signal<OutdoorTempStat>({
    temperature: [{ dt: new Date(), value: 0 }]
  })
  pressureStat = signal<PressureStat>({
    pressure: [{ dt: new Date(), value: 0 }]
  })

  constructor(public guestService: GuestService) {
  }

  ngOnInit(): void {
    this.guestService.getTempStat().subscribe(response => {
      this.tempStat.set(response);
      this.guestService.getPressureStat().subscribe(response => {
        this.pressureStat.set(response);
      });
    })
  }

}
