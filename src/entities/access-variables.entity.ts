import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccessVariables {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  tgToken: string;
}
