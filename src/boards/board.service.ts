import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Repository } from 'typeorm';
import { BoardRequest } from './dto/BoardRequest.dto';
import { BoardKind } from 'src/entities/enums/boardKind';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
  ) {}
  async createFreeBoard(boardRequest: BoardRequest) {
    const board = await this.boardRepository.create({
      title: boardRequest.title,
      content: boardRequest.content,
      kind: BoardKind.FREE,
    });
    return this.boardRepository.save(board);
  }

  async createNoticeBoard(boardRequest: BoardRequest) {
    const board = await this.boardRepository.create({
      title: boardRequest.title,
      content: boardRequest.content,
      kind: BoardKind.NOTICE,
    });

    return this.boardRepository.save(board);
  }
  async createOperBoard(boardRequest: BoardRequest) {
    const board = await this.boardRepository.create({
      title: boardRequest.title,
      content: boardRequest.content,
      kind: BoardKind.OPER,
    });

    return this.boardRepository.save(board);
  }
}
