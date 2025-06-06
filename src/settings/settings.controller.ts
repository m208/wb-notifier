import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateAccessDataDto } from './dto/update-access-data.dto';
import { SettingsDto } from './dto/settings.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    return await this.settingsService.getSettings();
  }

  @Patch()
  updateSettings(@Body() settings: SettingsDto) {
    return this.settingsService.updateSettings(settings);
  }

  @Patch('/access')
  async updateAccessData(@Body() dto: UpdateAccessDataDto) {
    return await this.settingsService.updateAccessDataField(dto);
  }
}
