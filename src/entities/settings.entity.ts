import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryColumn()
  id: number = 1;

  @Column({ default: true })
  trackNewOrders: boolean;

  @Column({ default: true })
  trackNewFeedbacks: boolean;

  @Column({ default: true })
  trackNewQuestions: boolean;

  @Column({ default: true })
  trackNewClaims: boolean;

  @Column({ default: true })
  trackNewChatMessages: boolean;

  @Column({ default: true })
  trackTokenExpiration: boolean;
}
