import { UserRole } from './user-role';

export interface CreateUserRequest {
  username: string;
  password: string;
  roles: UserRole[];
}
