import { UserRole } from './user-role';

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  roles?: UserRole[];
}
