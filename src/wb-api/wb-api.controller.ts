import { Controller, Get } from '@nestjs/common';
import { WbApiService } from './wb-api.service';

@Controller('wb-api')
export class WbApiController {
  constructor(private readonly wbApiService: WbApiService) {}

  @Get()
  findAll() {
    //return this.wbApiService.findAll();
  }
}
