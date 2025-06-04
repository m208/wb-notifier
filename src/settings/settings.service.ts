import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateSettingDto } from './dto/create-setting.dto';
// import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessVariables } from 'src/entities/access-variables.entity';
import { Repository } from 'typeorm';
import { UpdateAccessDataDto } from './dto/update-access-data.dto';
import { encrypt } from 'src/utils/crypto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AccessVariables)
    private readonly accessDataRepo: Repository<AccessVariables>,
  ) {}

  async onModuleInit() {
    const existing = await this.accessDataRepo.findOneBy({ id: 1 });

    if (!existing) {
      const predefinedEntry: AccessVariables = {
        id: 1,
        tgToken: '',
        tgChatId: '',
        wbToken: '',
      };
      await this.accessDataRepo.save(predefinedEntry);
    }
  }

  async updateAccessDataField(dto: UpdateAccessDataDto) {
    const record = await this.accessDataRepo.findOneBy({ id: 1 });

    if (!record) {
      throw new NotFoundException('Config entry not found!');
    }

    const encrypted = encrypt(dto.value);

    switch (dto.field) {
      case 'tg-token':
        record.tgToken = encrypted;
        break;
      case 'tg-chat-id':
        record.tgChatId = encrypted;
        break;
      case 'wb-token':
        record.wbToken = encrypted;
        break;
      default:
        throw new BadRequestException(`Invalid field: ${dto.field}`);
    }

    await this.accessDataRepo.save(record);

    return {
      message: `${dto.field} updated`,
    };
  }

  // create(createSettingDto: CreateSettingDto) {
  //   return 'This action adds a new setting';
  // }

  // findAll() {
  //   return `This action returns all settings`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} setting`;
  // }

  // update(id: number, updateSettingDto: UpdateSettingDto) {
  //   return `This action updates a #${id} setting`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} setting`;
  // }
}
