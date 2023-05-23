import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly _svc: AuthService) {}

  @Post('signup')
  public async signUp(@Body(ValidationPipe) authDto: AuthDto): Promise<void> {
    return this._svc.signUp(authDto);
  }

  @Post('signin')
  public async signIn(
    @Body(ValidationPipe) authDto: AuthDto,
  ): Promise<{ accessToken: string }> {
    return this._svc.signIn(authDto);
  }
}
