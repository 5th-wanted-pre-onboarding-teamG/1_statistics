import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Users } from 'src/entities/Users';

@Module({
  imports: [TypeOrmModule.forFeature([Boards, Users])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardsModule {}
