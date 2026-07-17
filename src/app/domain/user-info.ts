import { UserRole } from './user-role';

export interface UserInfo {
  id: number;
  username: string;
  roles: UserRole[];
}
