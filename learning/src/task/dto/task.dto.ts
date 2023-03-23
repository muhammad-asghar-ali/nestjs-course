import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class taskDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class TaskParamDto {
  @IsUUID()
  @IsDefined()
  id: string;
}

export class QueryParamDto {
  @IsDefined()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  filter: boolean;
}
