import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/role.enum';
import { IsCreatorGuard } from '../guard/is-creator.guard';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly _svc: FeedService) {}

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  public async create(
    @Body() feed: FeedPost,
    @Request() req,
    @Res() res,
  ): Promise<FeedPost> {
    const result = await this._svc.create(req.user, feed);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record created Successfully',
      data: result,
    });
  }

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  public async all(@Res() res): Promise<FeedPost[]> {
    const result = await this._svc.all();

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record get Successfully',
      data: result,
    });
  }

  @Get('pagination')
  public async pagination(
    @Query('take') take = 10,
    @Query('skip') skip = 1,
    @Res() res,
  ): Promise<FeedPost[]> {
    take = take > 20 ? 20 : take;
    const result = await this._svc.pagination(take, skip);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record get Successfully',
      data: result,
    });
  }

  @Get(':id')
  public async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res,
  ): Promise<FeedPost> {
    const result = await this._svc.findById(id);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record get Successfully',
      data: result,
    });
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  public async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res,
  ): Promise<FeedPost> {
    const result = await this._svc.delete(id);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record deleted Successfully',
      data: result,
    });
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Patch(':id')
  public async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() req: { body: string },
    @Res() res,
  ): Promise<FeedPost> {
    const result = await this._svc.update(id, req.body);

    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Record deleted Successfully',
      data: result,
    });
  }
}
