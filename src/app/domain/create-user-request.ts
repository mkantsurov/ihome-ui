import { Role } from './role';

export interface CreateUserRequest {
  username: string;
  password: string;
  roles: Role[];
}
