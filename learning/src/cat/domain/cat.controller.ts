import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCatDto } from './cat.dto';
import { CatService } from './cat.service';

@Controller('cat')
// add a controller level validation pipes
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class CatController {
  constructor(private readonly _svc: CatService) {}

  @Get()
  @ApiTags('cat')
  @ApiOperation({ description: 'create cat' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  getAllCat() {
    return this._svc.getAllCats();
  }

  @Post()
  @ApiTags('cat')
  @ApiOperation({ description: 'create cat' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  createCat(@Body() cat: CreateCatDto) {
    return this._svc.createCat(cat);
  }
}
