import {Component, computed, inject, input, signal} from '@angular/core';
import {Router, RouterLinkActive, RouterModule} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MenuItem} from "../menu-items";
import {Role} from "../../../../domain/role";
import {AuthenticationService} from "../../../../services/authentication.service";
import {leftMenuCollapsed} from '../../layout/signals';

@Component({
  selector: 'app-menu-item',
  imports: [RouterModule, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent {
  private authService = inject(AuthenticationService);
  private router = inject(Router);


  item = input.required<MenuItem>();
  routeHistory = input('');
  level = computed(() => this.routeHistory().split('/').length - 1);
  indentation = computed(() =>
    this.leftMenuCollapsed() ? '16px' : `${16 + this.level() * 16}px`
  );
  nestedItemOpen = signal(false);
  protected readonly leftMenuCollapsed = leftMenuCollapsed;

  hasPermission(roles: Role[]) {
    if (roles.length === 0) {
      return false;
    }
    for (const curRole of this.authService.getRoles()) {
      if (roles.includes(curRole)) {
        return true;
      }
    }
    return false;
  }

  handleItemClick(): void {
    if (this.item().label === 'Sign-Out') {
      this.authService.logout();
    }
  }
}
