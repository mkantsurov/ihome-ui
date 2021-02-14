import { Component, OnInit } from '@angular/core';
import {GuestService} from "../../../services/guest.service";
import {PowerStat} from "../../../domain/power-stat";

@Component({
  selector: 'app-general-power',
  templateUrl: './general-power.component.html',
  styleUrls: ['./general-power.component.css']
})
export class GeneralPowerComponent implements OnInit {

  powerStat: PowerStat;

  constructor(public guestService: GuestService) { }

  ngOnInit(): void {
    this.guestService.getPowerStat().subscribe(response => {
      this.powerStat = response;
    })
  }

}
