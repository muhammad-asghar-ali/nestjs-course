import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class UserParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
