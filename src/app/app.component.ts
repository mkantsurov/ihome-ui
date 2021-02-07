import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Home Keeper';

  // constructor(public _webSocketTestService: WebSocketService, private router: Router) {
  // }
  constructor(private router: Router) {
  }

  ngOnInit() {
    console.info('App initialization...');
    // this._webSocketTestService.connect();
  }

  isLoginPage(): boolean {
    return this.router.url === '/' || this.router.url.split('/')[1] == 'reset'
      || this.router.url.split('/')[1] == 'ssl_auth' || this.router.url.split('/')[1] == 'cert_validation';
  }
}
