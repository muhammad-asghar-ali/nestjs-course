import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './interface/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly _svc: UsersService) {}

  @Get()
  getUsers(): User[] {
    return this._svc.getUsers();
  }

  @Post()
  createUser(user: User): User {
    return this._svc.createUser(user);
  }

  @Delete('delete/:email')
  deleteUser(@Param('email') email: string): User[] {
    return this._svc.deleteUsr(email);
  }

  @Get('find/:email')
  getUser(@Param('email') email: string): User {
    return this._svc.getUser(email);
  }
}
