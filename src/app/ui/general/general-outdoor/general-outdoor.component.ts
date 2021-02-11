import {Component, OnInit} from '@angular/core';
import {GuestService} from "../../../services/guest.service";
import {OutdoorTempStat} from "../../../domain/outdoor-temp-stat";
import {PressureStat} from "../../../domain/pressurestat";


@Component({
  selector: 'app-general-outdoor',
  templateUrl: './general-outdoor.component.html',
  styleUrls: ['./general-outdoor.component.scss']
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
