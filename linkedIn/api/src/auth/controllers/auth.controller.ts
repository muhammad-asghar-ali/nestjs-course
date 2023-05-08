import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { User } from '../models/user.interface';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _svc: AuthService) {}

  @Post('register')
  public async register(@Body() user: User, @Res() res): Promise<User> {
    const result = await this._svc.register(user);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record Register Successfully',
      data: result,
    });
  }

  @Post('login')
  public async login(
    @Body() user: User,
    @Res() res,
  ): Promise<{ token: string }> {
    const result = await this._svc.login(user);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record Login Successfully',
      data: result,
    });
  }
}
