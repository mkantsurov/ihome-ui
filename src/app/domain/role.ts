export enum Role {
  NONE = 'NONE',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  CHILDREN_ROOM1_MANAGER = 'CHILDREN_ROOM1_MANAGER',
  CHILDREN_ROOM2_MANAGER = 'CHILDREN_ROOM2_MANAGER',
  AUTHORIZED_GUEST = 'AUTHORIZED_GUEST'
}

export const RoleView : Record<Role, string> = {
  [Role.NONE]: 'None',
  [Role.ADMIN]: 'Admin',
  [Role.SUPERVISOR]: 'Supervisor',
  [Role.CHILDREN_ROOM1_MANAGER]: 'Children Room1 Manager',
  [Role.CHILDREN_ROOM2_MANAGER]: 'Children Room2 Manager',
  [Role.AUTHORIZED_GUEST]: 'Authorized Guest'
}
