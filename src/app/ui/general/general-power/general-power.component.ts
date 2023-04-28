import { Component, OnInit } from '@angular/core';
import {GuestService} from "../../../services/guest.service";
import {PowerVoltage} from "../../../domain/power-voltage";
import {PowerVoltageExt} from '../../../domain/power-voltage-ext';

@Component({
  selector: 'app-general-power',
  templateUrl: './general-power.component.html',
  styleUrls: ['./general-power.component.css']
})
export class GeneralPowerComponent implements OnInit {

  powerStat: PowerVoltageExt;

  constructor(public guestService: GuestService) { }

  ngOnInit(): void {
    this.guestService.getPowerStat().subscribe(response => {
      this.powerStat = response;
    })
  }

}
