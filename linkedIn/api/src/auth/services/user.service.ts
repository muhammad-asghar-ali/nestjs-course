import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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

  public async uploadUserImageById(
    id: string,
    imagePath: string,
  ): Promise<UpdateResult> {
    const user: User = new UserEntity();

    user.id = id;
    user.imagePath = imagePath;

    const updatedUser = await this._repo.update(id, user);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  public async findImageNameByUserI(id: string): Promise<string> {
    const user = await this._repo.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    delete user.password;
    return user.imagePath;
  }

  public async updateUserImageById(
    id: string,
    imagePath: string,
  ): Promise<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return this._repo.update(id, user);
  }

  public async findImageNameByUserId(id: string): Promise<string> {
    const user = await this._repo.findOne({ where: { id } });

    delete user.password;
    return user.imagePath;
  }
}
