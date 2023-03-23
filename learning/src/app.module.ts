import { Module } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cat/domain/cat.module';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';

const TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [],
  synchronize: true,
  logging: ['query', 'error', 'warn'],
};

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG),
    UsersModule,
    TaskModule,
    DatabaseModule,
    CustomerModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
