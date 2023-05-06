import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repo: Repository<UserEntity>,
  ) {}

  public async findUserById(id: string): Promise<User> {
    const user = await this._repo.findOne({
      where: { id },
      relations: ['feedPosts'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    return user;
  }
}
