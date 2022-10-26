import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardType } from './enums/boardType';
import { Users } from './Users';

@Entity({ schema: 'preonboarding', name: 'boards' })
export class Boards {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column({ type: 'enum', name: 'type', enum: ['자유', '공지', '운영'] })
  type: BoardType;

  @Column({ type: 'varchar', name: 'title', length: 50 })
  title: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @ManyToOne(() => Users, (users) => users.Boards)
  Author: Users;
}
