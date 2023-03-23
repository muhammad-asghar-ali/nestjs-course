import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from 'src/common/auth.middleware';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [CatService],
})
export class CatsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/api/v1/cat/something')
      .forRoutes({ path: '/api/v1', method: RequestMethod.ALL });
  }
}
