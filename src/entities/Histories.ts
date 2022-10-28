import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity({ schema: 'preonboarding', name: 'histories' })
export class Histories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'historyId' })
  historyId: number;

  @CreateDateColumn({ name: 'connectTime' })
  connectTime: Date;

  @ManyToOne(() => Users, (users) => users.Histories)
  Connector: Users;
}
