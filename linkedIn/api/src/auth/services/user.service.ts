import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../models/friend-request.entity';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repo: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly _repoFriendrequest: Repository<FriendRequestEntity>,
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

  public async findImageNameByUserId(id: string): Promise<string> {
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

  public async hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Promise<boolean> {
    const q = await this._repoFriendrequest.findOne({
      where: [
        { creator, receiver },
        { creator: receiver, receiver: creator },
      ],
    });

    if (!q) return false;
    return true;
  }
}
