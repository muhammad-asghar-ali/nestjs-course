import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../guards/jwt.guard';
import { UserService } from '../services/user.service';
import {
  isFileExtensionSafe,
  saveImageToStorage,
  removeFile,
} from '../helpers/image-stroage';
import { User } from '../models/user.class';

@Controller('user')
export class UserController {
  constructor(private readonly _svc: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res,
  ): Promise<any> {
    const fileName = file.filename;

    if (!fileName) {
      throw new HttpException(
        'File must be a png, jpg/jpeg',
        HttpStatus.BAD_REQUEST,
      );
    }

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    const isSafe = await isFileExtensionSafe(fullImagePath);

    if (!isSafe) {
      throw new HttpException(
        'File content does not match extension!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = req.user.id;
    const result = await this._svc.updateUserImageById(userId, fileName);

    removeFile(fullImagePath);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record Created Successfully',
      data: result,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Res() res,
  ): Promise<User> {
    const result = this._svc.findUserById(userId);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record Created Successfully',
      data: result,
    });
  }

  @UseGuards(JwtGuard)
  @Get('image')
  public async findImage(@Request() req, @Res() res): Promise<any> {
    const userId = req.user.id;
    const result = await this._svc.findImageNameByUserId(userId);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record Get Successfully',
      data: result,
    });
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  public async findUserImageName(
    @Request() req,
    @Res() res,
  ): Promise<{ imageName: string }> {
    const userId = req.user.id;
    const result = await this._svc.findImageNameByUserId(userId);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record Get Successfully',
      data: result,
    });
  }
}
