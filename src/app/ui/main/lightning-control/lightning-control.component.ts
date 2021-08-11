import { Component, OnInit } from '@angular/core';
import {SystemService} from '../../../services/system.service';

@Component({
  selector: 'app-lightning-control',
  templateUrl: './lightning-control.component.html',
  styleUrls: ['./lightning-control.component.css']
})
export class LightningControlComponent implements OnInit {

  constructor(private systemService: SystemService) { }

  ngOnInit(): void {
    // this.systemService.getHeatingSummary().subscribe(response => {
    //   console.log(`received heating summary: ` + JSON.stringify(response));
    //   this.heatingSummary = response;
    //   this.systemService.getBoilerTempStat().subscribe(response => {
    //     this.boilerTempStat = response;
    //   })
    // })
  }

}
