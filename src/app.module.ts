import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WbApiModule } from './wb-api/wb-api.module';
import { ConfigModule } from '@nestjs/config';
import { TgSenderModule } from './tg-sender/tg-sender.module';
import { NewOrdersTrackerModule } from './new-orders-tracker/new-orders-tracker.module';
import { TokenExpiresTrackerModule } from './token-expires-tracker/token-expires-tracker.module';
import { NewQuestionsModule } from './new-questions/new-questions.module';
import { NewFeedbacksTrackerModule } from './new-feedbacks-tracker/new-feedbacks-tracker.module';
import { NewClaimsTrackerModule } from './new-claims-tracker/new-claims-tracker.module';
import { NewChatsModule } from './new-chats/new-chats.module';
import { FrontendModule } from './frontend/frontend.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessVariables } from './entities/access-variables.entity';
import { Settings } from './entities/settings.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'app.db',
      entities: [User, Settings, AccessVariables],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,
    WbApiModule,
    TgSenderModule,
    NewOrdersTrackerModule,
    TokenExpiresTrackerModule,
    NewQuestionsModule,
    NewFeedbacksTrackerModule,
    NewClaimsTrackerModule,
    NewChatsModule,
    FrontendModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
