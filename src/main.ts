import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  // Link tài liệu: https://docs.nestjs.com/pipes#class-validator
  // Cài đặt thư viện: npm i --save class-validator class-transformer
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/assets',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8000);
}
bootstrap();
