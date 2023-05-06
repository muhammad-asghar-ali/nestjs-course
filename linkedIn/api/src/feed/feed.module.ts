import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FeedController } from './controllers/feed.controller';
import { IsCreatorGuard } from './guard/is-creator.guard';
import { FeedEntity } from './models/post.entity';
import { FeedService } from './services/feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedEntity]), AuthModule],
  controllers: [FeedController],
  providers: [FeedService, IsCreatorGuard],
})
export class FeedModule {}
