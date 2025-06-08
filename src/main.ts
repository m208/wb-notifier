import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { engine } from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
    }),
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.set('view cache', false);

  await app.listen(3000);
}
bootstrap();
