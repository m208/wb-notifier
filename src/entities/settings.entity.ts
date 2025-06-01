import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  getOrders: boolean;

  @Column({ default: true })
  getFeedbacks: boolean;
}
