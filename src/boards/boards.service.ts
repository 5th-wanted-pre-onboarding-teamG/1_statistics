import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Repository, Not } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { UserRank } from 'src/entities/enums/userRank';

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

  /**
   * @param rank 유저 등급
   * @param offset 기준 행
   * @param limit 가져올 행 수
   * @description 유저의 등급을 통해 게시판을 조회하고, 페이징합니다.
   * @returns 유저 게시판 조회 결과
   */
  async getAllBoards(rank: UserRank, offset: string, limit: string) {
    let kind;

    // 일반등급의 유저는 운영게시판에 대한 조회를 제외합니다.
    if (rank === UserRank.NORMAL) {
      kind = Not(BoardKind.OPER);
    }

    const board = await this.boardRepository.find({
      where: { kind },
      take: parseInt(limit),
      skip: parseInt(offset),
      order: { createdAt: 'DESC' },
    });

    return board;
  }
}
