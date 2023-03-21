import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type as ValidateType } from 'class-transformer';

export class Address {
  @ApiProperty({ description: '', required: true })
  @IsString()
  readonly city: string;

  @ApiProperty({ description: '', required: true })
  @IsString()
  readonly state: number;
}
export class CreateCatDto {
  //API property is a type of context variable whose value is dependent on the API collection that the API is provisioned in.
  @ApiProperty({ description: '', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '', required: true })
  @IsString()
  breed: string;

  @ApiProperty({ description: 'address', required: true, type: [Address] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @ValidateType(() => Address)
  public address?: Address[];
}

export class GetCatByIdParam {
  @ApiProperty({ description: '', required: true })
  @IsUUID()
  readonly id!: string;
}
