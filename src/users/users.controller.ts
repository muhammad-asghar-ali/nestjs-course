import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, UserParamsDto } from './dtos/user.dto';
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
  @UsePipes(new ValidationPipe())
  createUser(user: CreateUserDto): User {
    return this._svc.createUser(user);
  }

  @Delete('delete/:email')
  deleteUser(@Param() params: UserParamsDto): User[] {
    return this._svc.deleteUsr(params.email);
  }

  @Get('find/:email')
  getUser(@Param() params: UserParamsDto): User {
    return this._svc.getUser(params.email);
  }

  @Get('find/:email')
  getUserByEmail(@Param('email') email: string): User {
    return this._svc.getUser(email);
  }
}
