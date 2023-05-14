import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequestEntity } from '../models/friend-request.entity';
import {
  FriendRequest,
  FriendRequestStatus,
  FriendRequest_Status,
} from '../models/friend-request.interface';
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

  public async sendFriendRequest(
    receiverId: string,
    creator: User,
  ): Promise<FriendRequest> {
    if (receiverId === creator.id) {
      throw new HttpException(
        'It is not possible to add yourself!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const receiver = await this.findUserById(receiverId);

    const hasRequestBeenSentOrReceived =
      await this.hasRequestBeenSentOrReceived(creator, receiver);

    if (hasRequestBeenSentOrReceived) {
      throw new HttpException(
        'A friend request has already been sent of received to your account!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendRequest: FriendRequest = {
      creator,
      receiver,
      status: 'pending',
    };

    const data = await this._repoFriendrequest.save(friendRequest);
    return data;
  }

  public async getFriendRequestStatus(
    receiverId: string,
    currentUser: User,
  ): Promise<FriendRequestStatus> {
    const receiver = await this.findUserById(receiverId);

    if (!receiver) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    const friendRequest = await this._repoFriendrequest.findOne({
      where: [
        { creator: currentUser, receiver: receiver },
        { creator: receiver, receiver: currentUser },
      ],
      relations: ['creator', 'receiver'],
    });

    if (friendRequest?.receiver.id === currentUser.id) {
      return {
        status: 'waiting-for-current-user-response' as FriendRequest_Status,
      };
    }
    return { status: friendRequest?.status || 'not-sent' };
  }

  public async getFriendRequestUserById(
    friendRequestId: string,
  ): Promise<FriendRequest> {
    const result = await this._repoFriendrequest.findOne({
      where: [{ id: friendRequestId }],
    });

    return result;
  }

  public async respondToFriendRequest(
    statusResponse: FriendRequest_Status,
    friendRequestId: string,
  ): Promise<FriendRequestStatus> {
    const friendRequest = await this.getFriendRequestUserById(friendRequestId);

    const frndRequest = await this._repoFriendrequest.save({
      ...friendRequest,
      status: statusResponse,
    });

    return frndRequest;
  }

  public async getFriendRequestsFromRecipients(
    currentUser: User,
  ): Promise<FriendRequest[]> {
    const q = await this._repoFriendrequest.find({
      where: [{ receiver: currentUser }],
      relations: ['receiver', 'creator'],
    });

    return q;
  }
}
