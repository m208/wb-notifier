import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AccessVariables {
  @PrimaryColumn()
  id: number = 1;

  @Column()
  wbToken: string;

  @Column()
  tgToken: string;

  @Column()
  tgChatId: string;
}
