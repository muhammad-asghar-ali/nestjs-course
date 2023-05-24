import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from './user.entity';

export const GetUser = createParamDecorator((data, req): UserEntity => {
  return req.user;
});
