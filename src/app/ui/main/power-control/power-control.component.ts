import { Component, OnInit } from '@angular/core';
import {LuminosityStat} from '../../../domain/luminositystat';
import {SystemService} from '../../../services/system.service';
import {PowerSummary} from '../../../domain/powersummary';
import {GuestService} from '../../../services/guest.service';
import {PowerVoltage} from '../../../domain/power-voltage';
import {PowerConsumption} from '../../../domain/power-consumption';

@Component({
  selector: 'app-power-control',
  templateUrl: './power-control.component.html',
  styleUrls: ['./power-control.component.scss']
})
export class PowerControlComponent implements OnInit {

  powerSummary: PowerSummary;
  powerVoltageStat: PowerVoltage;
  powerConsumption: PowerConsumption;
  luminosityStat: LuminosityStat;

  constructor(private systemService: SystemService, private guestService: GuestService) {
    this.powerSummary = {
      luminosity: 0,
      powerStatus: 0,
      securityMode: 0,
      pwSrcConverterMode: 0,
      pwSrcDirectMode: 0
    }
  }

  ngOnInit(): void {
    this.systemService.getPowerSummary().subscribe(response => {
      console.log(`received power summary: ` + JSON.stringify(response));
      this.powerSummary = response;
      this.systemService.getLuminosityStat().subscribe(luminosityStat => {
        this.luminosityStat = luminosityStat;
        this.systemService.getPowerVoltageStat().subscribe(powerVoltageStat => {
          this.powerVoltageStat = powerVoltageStat;
          this.systemService.getPowerConsumptionStat().subscribe(powerConsumptionStat => {
            this.powerConsumption = powerConsumptionStat;
          })
        })
      })
    });
  }

  isExternalPowerSourceOk(): boolean {
    return this.powerSummary.powerStatus > 170 && this.powerSummary.powerStatus > 245;
  }
}
