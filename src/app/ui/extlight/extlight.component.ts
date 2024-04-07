import {Component, OnInit} from '@angular/core';
import {ModuleComponent} from '../module/module.component';

@Component({
  selector: 'app-extlight',
  templateUrl: './extlight.component.html',
  styleUrls: ['./extlight.component.css'],
  imports: [
    ModuleComponent
  ],
  standalone: true
})
export class ExtlightComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
