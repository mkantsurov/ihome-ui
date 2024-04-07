import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {AuthenticationService} from '../../../services/authentication.service';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AsyncPipe} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [
    MatSidenavModule,
    AsyncPipe,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterOutlet
  ],
  standalone: true
})
export class MainComponent implements OnInit {

  constructor(iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private authService: AuthenticationService,
              private breakpointObserver: BreakpointObserver) {
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

  routeLinks: any[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  ngOnInit() {
  }
}
