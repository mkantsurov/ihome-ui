import {Component, OnInit} from '@angular/core';
import {ModuleComponent} from '../module/module.component';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.css'],
  imports: [
    ModuleComponent
  ],
  standalone: true
})
export class GarageComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
