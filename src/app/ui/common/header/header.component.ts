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
    ]
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
        label: 'Power Control',
        path: '/main/power-control'
      }, {
        label: 'Heating Control',
        path: '/main/heating-control'
      }, {
        label: 'Lightning Control',
        path: '/main/lightning-control'
      },
      {
        label: 'Audit Log',
        path: '/main/audit-log'
      },
      {
        label: 'Messages',
        path: '/main/messages'
      }
    ];
  }

  ngOnInit() {
    this.initHeaderData()
  }

  initHeaderData() {
  }
}
