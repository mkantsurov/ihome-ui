import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../../../services/global.service";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule
  ],
  standalone: true
})
export class HeaderComponent implements OnInit {

  routeLinks: any[];

  constructor(private globalService: GlobalService, private router: Router) {
    this.globalService.loginEvent.subscribe(() => {
      this.initHeaderData();
    });

    this.routeLinks = [
      {
        label: 'Summary',
        path: '/main/summary'
      }, {
        label: 'Ground Floor',
        path: '/main/gf'
      }, {
        label: 'Second Floor',
        path: '/main/sf'
      }, {
        label: 'Garage',
        path: '/main/garage'
      },
      {
        label: 'Exterior lighting',
        path: '/main/el'
      }
    ];
  }

  ngOnInit() {
    this.initHeaderData()
  }

  initHeaderData() {
  }
}
