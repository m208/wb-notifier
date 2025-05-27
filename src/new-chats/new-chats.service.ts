import { Injectable } from '@nestjs/common';

@Injectable()
export class NewChatsService {
  findAll() {
    return `This action returns all newChats`;
  }
}
