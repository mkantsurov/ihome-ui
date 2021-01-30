import {Component, OnInit} from '@angular/core';
import {SystemService} from "../../services/system.service";


@Component({
  selector: 'app-secondfloor',
  templateUrl: './secondfloor.component.html',
  styleUrls: ['./secondfloor.component.css']
})

export class SecondfloorComponent implements OnInit {

  constructor(public systemService: SystemService) {
  }

  ngOnInit() {
  }


}


