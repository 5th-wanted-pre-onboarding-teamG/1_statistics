import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { userInfo } from 'os';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
  ) {}
  async createBoard(
    boardRequest: CreateBoardDto,
    kind: BoardKind,
    user: Users,
  ) {
    const result = [];
    const board = await this.boardRepository.create({
      title: boardRequest.title,
      content: boardRequest.content,
      kind,
      Author: user,
    });
    return this.boardRepository.save(board);
  }
}
