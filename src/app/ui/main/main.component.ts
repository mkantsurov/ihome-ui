import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import {AuthenticationService} from "../../services/authentication.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  routeLinks: any[];

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private authService: AuthenticationService) {
    iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/thumbup-icon.svg'));

    this.routeLinks = [
      {
        label: 'Summary',
        path: '/app/summary'
      },
      {
        label: 'Ground Floor',
        path: '/app/gf'
      },
      {
        label: 'Second Floor',
        path: '/app/sf'
      },
      {
        label: 'Garage',
        path: '/app/garage'
      },
      {
        label: 'Exterior lighting',
        path: '/app/el'
      }
    ];
  }

  ngOnInit() {
  }

}
