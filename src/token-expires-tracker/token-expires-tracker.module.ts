import { Module } from '@nestjs/common';
import { TokenExpiresTrackerService } from './token-expires-tracker.service';
import { JwtModule } from '@nestjs/jwt';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';

@Module({
  imports: [JwtModule, TgSenderModule],
  providers: [TokenExpiresTrackerService],
  exports: [TokenExpiresTrackerService],
})
export class TokenExpiresTrackerModule {}
