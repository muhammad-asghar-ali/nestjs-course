import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, TaskModule, DatabaseModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
