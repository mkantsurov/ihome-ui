import { Role } from './role';

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  roles?: Role[];
}
