import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        console.log('❌ admin user not created! Set ENV variables!');
      } else {
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await this.repo.save(
          this.repo.create({
            username: process.env.ADMIN_USERNAME,
            passwordHash: hash,
          }),
        );
        console.log('✅ Created default admin user');
      }
    }
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { username } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? user : null;
  }
}
