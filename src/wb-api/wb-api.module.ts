import { Module } from '@nestjs/common';
import { WbApiService } from './wb-api.service';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [HttpModule, SettingsModule],
  providers: [WbApiService],
  exports: [WbApiService],
})
export class WbApiModule {}
