/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto, UserParamsDto } from './dtos/user.dto';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { User } from './interface/user.interface';
import { JoiValidationPipe } from './pipes/validation.pipe';
import { UsersService } from './users.service';

@Controller('users')
// @UseGuards(AuthGuard) // at controller level
// @UseInterceptors(LoggingInterceptor) // at controller level
export class UsersController {
  constructor(private readonly _svc: UsersService) {}

  @Get()
  @UseGuards(new AuthGuard()) // at route level
  @UseInterceptors(new LoggingInterceptor()) // at route level
  getUsers(): User[] {
    return this._svc.getUsers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  // @UsePipes(new JoiValidationPipe())
  createUser(user: CreateUserDto): User {
    return this._svc.createUser(user);
  }

  // with class validator
  @Post()
  @UsePipes(new ValidationPipe())
  // @UsePipes(new JoiValidationPipe())
  createUserWithValidator(
    @Body(new ValidationPipe()) user: CreateUserDto,
  ): User {
    return this._svc.createUser(user);
  }

  @Delete('delete/:email')
  deleteUser(@Param() params: UserParamsDto): User[] {
    return this._svc.deleteUsr(params.email);
  }

  @Get('find/:email')
  @UseFilters(new HttpExceptionFilter())
  async getUser(@Param() params: UserParamsDto): Promise<User> {
    try {
      return this._svc.getUser(params.email);
    } catch (err) {
      throw new BadRequestException('test');
    }
  }

  @Get('find/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this._svc.getUser(email);
  }

  @Get('find/:email')
  getUserByEmailExpress(
    @Param() params: UserParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = this._svc.getUser(params.email);
    res.status(HttpStatus.OK).json(result);
  }
}
