import { Controller } from '@nestjs/common';
import { AuthService } from '../services/feed.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _svc: AuthService) {}
}
