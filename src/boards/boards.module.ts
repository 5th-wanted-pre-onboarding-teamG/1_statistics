import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';

@Module({
  // TypeOrmModule에서 게시물 에티티를 임포트합니다.
  imports: [TypeOrmModule.forFeature([Boards])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
