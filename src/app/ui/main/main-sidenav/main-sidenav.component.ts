import {Component, inject} from '@angular/core';
import {menuItems} from './menu-items';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {MatNavList} from "@angular/material/list";
import {AuthenticationService} from "../../../services/authentication.service";
import {Role} from "../../../domain/role";

@Component({
  selector: 'app-main-sidenav',
  imports: [
    MatNavList,
    MenuItemComponent
  ],
  templateUrl: './main-sidenav.component.html',
  styleUrl: './main-sidenav.component.scss',
})
export class MainSidenavComponent {
  private authService = inject(AuthenticationService);
  menuItems = menuItems;

  hasPermission(roles: Role[]) {
    if (roles.length === 0) {
      return false;
    }
    console.log("Roles:  " + JSON.stringify(this.authService.getRoles()))
    for (const curRole of this.authService.getRoles()) {
      if (roles.includes(curRole)) {
        return true;
      }
    }
    return false;
  }
}
