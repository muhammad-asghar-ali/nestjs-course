import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './interface/user.interface';

@Injectable()
export class UsersService {
  public users = [];

  getUsers(): User[] {
    return this.users;
  }

  async getUser(email: string): Promise<User> {
    const userData = this.users.filter((user) => user.email === email);
    if (userData && Array.isArray(userData) && userData.length) {
      return userData[0];
    } else {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
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
