import { User } from '../entities/user.entity';

export class UserResponse {
  id: number;

  username: string;

  email: string;

  firstName?: string;

  lastName?: string;

  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.role = user.role;
  }
}
