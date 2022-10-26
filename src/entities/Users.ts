import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Boards } from './Boards';
import { UserClass } from './enums/userClass';

@Entity({ schema: 'preonboarding', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', name: 'email', length: 30 })
  email: string;

  @Column({ type: 'text', name: 'password' })
  password: string;

  @Column({ type: 'varchar', name: 'name', length: 12 })
  name: string;

  @Column({
    type: 'enum',
    name: 'class',
    enum: UserClass,
    default: '일반',
  })
  class: UserClass;

  @Column({ type: 'enum', name: 'gender', enum: ['남성', '여성'] })
  gender: '남성' | '여성';

  @Column({ type: 'tinyint', name: 'age', unsigned: true })
  age: number;

  @Column({ type: 'varchar', name: 'phone', length: 13 })
  phone: string;

  @CreateDateColumn({ name: 'memberSince' })
  memberSince: Date;

  @Column({
    type: 'timestamp',
    name: 'lastAccess',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastAccess: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Boards, (boards) => boards.Author)
  Boards: Boards[];
}
