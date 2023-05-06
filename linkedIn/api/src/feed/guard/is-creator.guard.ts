import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/auth/models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { UserService } from 'src/auth/services/user.service';
import { FeedService } from '../services/feed.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: string } } = request;

    if (!user || !params) return false;

    if (user.role === 'admin') return true;

    const userId = user.id;
    const feedId = params.id;

    const author = await this.userService.findUserById(userId);

    if (author) {
      const feed = await this.feedService.findById(feedId);
      const isAuthor = author.id === feed.author.id;
      return isAuthor;
    } else {
      return false;
    }
  }
}
