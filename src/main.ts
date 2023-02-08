import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * add validation in global level also
   */

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //Payloads coming in over the network are plain JavaScript objects. The ValidationPipe can automatically transform payloads to be objects typed according to their DTO classes.
      whitelist: true, // if our handler expects email and password properties, but a request also includes an age property, this property can be automatically removed from the resulting DTO. To enable such behavior, set whitelist to true.
    }),
  );

  // middleware pass here
  app.use(Logger);
  await app.listen(3000);
}
bootstrap();
