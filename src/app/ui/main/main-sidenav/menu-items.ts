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
    icon: 'summarize',
    label: 'Summary',
    route: 'summary',
    implemented: true,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.CHILDREN_ROOM1_MANAGER, Role.CHILDREN_ROOM2_MANAGER],
  },
  {
    icon: 'auto_awesome',
    label: 'Chat',
    route: 'chat',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'power_settings_new',
    label: 'Power Settings',
    route: 'power-control',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'thermostat',
    label: 'Heating Settings',
    route: 'heating-control',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'tungsten',
    label: 'Lighting Settings',
    route: 'lightning-control',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'history',
    label: 'Audit Log',
    route: 'audit-log',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'change_history',
    label: 'Messages',
    route: 'messages',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'group',
    label: 'User Management',
    route: 'user-management',
    implemented: true,
    roles: [Role.ADMIN],
  },
  {
    icon: 'logout',
    label: 'Sign-Out',
    route: 'public-sign-in',
    implemented: true,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.CHILDREN_ROOM1_MANAGER, Role.CHILDREN_ROOM2_MANAGER],
  },
]
