import {
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../models/user.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _svc: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {}))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ): Promise<User> {
    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record Created Successfully',
      data: null,
    });
  }
}
