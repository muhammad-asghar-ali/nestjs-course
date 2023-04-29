import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './controllers/feed.controller';
import { FeedEntity } from './models/post.entity';
import { FeedService } from './services/feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedEntity])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
