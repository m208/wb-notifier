import { Module } from '@nestjs/common';
import { NewOrdersTrackerService } from './new-orders-tracker.service';
import { NewOrdersTrackerController } from './new-orders-tracker.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';

@Module({
  imports: [WbApiModule, TgSenderModule],
  controllers: [NewOrdersTrackerController],
  providers: [NewOrdersTrackerService],
})
export class NewOrdersTrackerModule {}
