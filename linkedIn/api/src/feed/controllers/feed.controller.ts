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
  Res,
} from '@nestjs/common';
import { FeedPost } from '../models/post.interface';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly _svc: FeedService) {}

  @Post()
  public async create(@Body() feed: FeedPost, @Res() res): Promise<FeedPost> {
    const result = await this._svc.create(feed);

    return res.status(HttpStatus.CREATED).json({
      status: 'OK',
      message: 'Record created Successfully',
      data: result,
    });
  }

  @Get()
  public async all(@Res() res): Promise<FeedPost> {
    const result = await this._svc.all();

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
