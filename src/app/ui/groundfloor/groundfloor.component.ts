import {Component, OnInit} from '@angular/core';
import {ModuleComponent} from '../module/module.component';

@Component({
    selector: 'app-groundfloor',
    templateUrl: './groundfloor.component.html',
    styleUrls: ['./groundfloor.component.css'],
    imports: [
        ModuleComponent
    ]
})
export class GroundfloorComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
