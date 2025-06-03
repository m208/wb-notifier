import { Module } from '@nestjs/common';
import { FrontendController } from './frontend.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FrontendController],
})
export class FrontendModule {}
