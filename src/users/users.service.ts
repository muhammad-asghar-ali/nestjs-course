import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';

@Injectable()
export class UsersService {
  public users = [];

  getUsers(): User[] {
    return this.users;
  }

  getUser(email: string): User {
    return this.users.filter((user) => user.email === email)[0];
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  deleteUsr(email: string): User[] {
    const remaingUsers = this.users.filter((user) => user.email === email);
    this.users = remaingUsers;
    return remaingUsers;
  }
}
