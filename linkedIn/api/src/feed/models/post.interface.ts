import { User } from 'src/auth/models/user.interface';

export interface FeedPost {
  id?: string;
  body?: string;
  createAt?: Date;
  author?: User;
}
