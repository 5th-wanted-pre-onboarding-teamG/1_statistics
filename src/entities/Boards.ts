import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardKind } from './enums/boardKind';
import { Users } from './Users';
import { UserRank } from './enums/userRank';

@Entity({ schema: 'preonboarding', name: 'boards' })
export class Boards {
  @PrimaryGeneratedColumn({ type: 'int', name: 'boardId' })
  boardId: number;

  @Column({ type: 'enum', name: 'kind', enum: BoardKind })
  kind: BoardKind;

  @Column({ type: 'varchar', name: 'title', length: 50 })
  title: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.Boards)
  Author: Users;

  static isCreateAuthority(rank: UserRank, kind: BoardKind) {
    if (kind === BoardKind.NOTICE) {
      return this.isCreateAuthorityNotice(rank);
    }

    if (kind === BoardKind.OPER) {
      return this.isCreateAuthorityOperate(rank);
    }

    return true;
  }

  private static isCreateAuthorityNotice(rank: UserRank) {
    return rank === UserRank.MANAGER || rank === UserRank.ADMIN;
  }

  private static isCreateAuthorityOperate(rank: UserRank) {
    return rank === UserRank.MANAGER || rank === UserRank.ADMIN;
  }
}
