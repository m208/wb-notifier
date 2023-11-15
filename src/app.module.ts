import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WbApiModule } from './wb-api/wb-api.module';

@Module({
  imports: [ScheduleModule.forRoot(), SchedulerModule, WbApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
