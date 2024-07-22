import { Module } from '@nestjs/common';
import { NewClaimsTrackerService } from './new-claims-tracker.service';
import { NewClaimsTrackerController } from './new-claims-tracker.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';

@Module({
  imports: [WbApiModule, TgSenderModule],
  controllers: [NewClaimsTrackerController],
  providers: [NewClaimsTrackerService],
})
export class NewClaimsTrackerModule {}
