import { Module } from '@nestjs/common';
import { WbApiService } from './wb-api.service';
import { WbApiController } from './wb-api.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WbApiController],
  providers: [WbApiService],
  exports: [WbApiService],
})
export class WbApiModule {}
