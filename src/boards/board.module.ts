import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';

@Module({
  imports: [TypeOrmModule.forFeature([Boards])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
