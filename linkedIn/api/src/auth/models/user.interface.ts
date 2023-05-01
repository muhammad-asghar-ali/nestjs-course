import { FeedPost } from 'src/feed/models/post.interface';
import { Role } from './role.enum';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: Date;
  email?: string;
  password?: string;
  role?: Role;
  posts?: FeedPost[];
}
