import {Component} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        CommonModule, RouterModule
    ]
})
export class AppComponent {
  title = 'Home Keeper';

  // constructor(public _webSocketTestService: WebSocketService, private router: Router) {
  // templateUrl: './root.component.html',
  // }
  constructor(private router: Router) {
  }

  ngOnInit() {
    console.info('App initialization...');
    // this._webSocketTestService.connect();
  }

  isLoginPage(): boolean {
    return this.router.url === '/' || this.router.url.split('/')[1] === 'reset';
  }
}
