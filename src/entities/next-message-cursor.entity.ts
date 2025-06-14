import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class NextMessageCursor {
  @PrimaryColumn()
  id: number = 1;

  @Column()
  nextMessageCursor: number;
}
