import { Controller } from '@nestjs/common';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly _svc: FeedService) {}
}
