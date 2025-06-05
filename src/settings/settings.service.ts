import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessVariables } from 'src/entities/access-variables.entity';
import { Repository } from 'typeorm';
import { UpdateAccessDataDto } from './dto/update-access-data.dto';
import { decrypt, encrypt } from 'src/utils/crypto';
import { Settings } from 'src/entities/settings.entity';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AccessVariables)
    private readonly accessDataRepo: Repository<AccessVariables>,

    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  async onModuleInit() {
    const accessData = await this.accessDataRepo.findOneBy({ id: 1 });

    if (!accessData) {
      const predefinedEntry: AccessVariables = {
        id: 1,
        tgToken: '',
        tgChatId: '',
        wbToken: '',
      };
      await this.accessDataRepo.save(predefinedEntry);
    }

    const settingsData = await this.settingsRepo.findOneBy({ id: 1 });

    if (!settingsData) {
      this.settingsRepo.save({ id: 1 });
    }
  }

  async getSettings(): Promise<SettingsDto | null> {
    const settings = await this.settingsRepo.findOneBy({ id: 1 });
    if (!settings) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = settings;
    return rest;
  }

  async updateSettings(dto: SettingsDto) {
    return await this.settingsRepo.save({ id: 1, ...dto });
  }

  async getTelegramAccessData() {
    const entry = await this.accessDataRepo.findOneBy({ id: 1 });

    if (entry) {
      return {
        'tg-token': decrypt(entry.tgToken),
        'tg-chat-id': decrypt(entry.tgChatId),
      };
    }
  }

  async getWbAccessData() {
    const entry = await this.accessDataRepo.findOneBy({ id: 1 });

    if (entry) {
      return {
        token: decrypt(entry.wbToken),
      };
    }
  }

  async updateAccessDataField(dto: UpdateAccessDataDto) {
    const entry = await this.accessDataRepo.findOneBy({ id: 1 });

    if (!entry) {
      throw new NotFoundException('Config entry not found!');
    }

    const encrypted = encrypt(dto.value);

    switch (dto.field) {
      case 'tg-token':
        entry.tgToken = encrypted;
        break;
      case 'tg-chat-id':
        entry.tgChatId = encrypted;
        break;
      case 'wb-token':
        entry.wbToken = encrypted;
        break;
      default:
        throw new BadRequestException(`Invalid field: ${dto.field}`);
    }

    await this.accessDataRepo.save(entry);

    return {
      message: `${dto.field} updated`,
    };
  }
}
