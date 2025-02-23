import {Component, OnInit} from '@angular/core';
import {SystemService} from "../../services/system.service";
import {ModuleComponent} from '../module/module.component';


@Component({
    selector: 'app-secondfloor',
    templateUrl: './secondfloor.component.html',
    styleUrls: ['./secondfloor.component.css'],
    imports: [
        ModuleComponent
    ]
})

export class SecondfloorComponent implements OnInit {

  constructor(public systemService: SystemService) {
  }

  ngOnInit() {
  }


}


