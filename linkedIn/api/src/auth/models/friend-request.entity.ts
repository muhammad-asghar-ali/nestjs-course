import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest_Status } from './friend-request.interface';

import { UserEntity } from './user.entity';

@Entity('request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequests)
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.receivedFriendRequests,
  )
  receiver: UserEntity;

  @Column()
  status: FriendRequest_Status;
}
