import {Role} from "../../../domain/role";

export interface MenuItem {
  icon?: string;
  label: string;
  route?: string;
  implemented: boolean;
  roles: Role[];
  subItems?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    icon: 'summary',
    label: 'Summary',
    route: 'main/summary-page',
    implemented: true,
    roles: [Role.ADMIN],
  }
]
