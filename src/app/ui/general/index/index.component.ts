import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints, MediaMatcher} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class IndexComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
  console.log('Initializing index component')
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
