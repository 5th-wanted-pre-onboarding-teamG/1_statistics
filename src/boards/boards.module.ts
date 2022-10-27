import { Module } from '@nestjs/common';
import { BoardService } from './boards.service';
import { BoardController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Boards])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
