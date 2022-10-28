import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { UserRank } from 'src/entities/enums/userRank';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
    @InjectRepository(Users)
    private usersRepostory: Repository<Users>,
  ) {}
  async createBoard(
    createBoardDto: CreateBoardDto,
    kind: BoardKind,
    user: Users,
  ) {
    const board = new Boards();
    // 유저의 rank가 NORMAL일 경우 공지 게시판의 접근을 할 수 없습니다.

    if (user.rank === UserRank.NORMAL && kind === BoardKind.NOTICE) {
      throw new ForbiddenException('공지 게시판의 권한이 없습니다.');
    }
    // 유저의 rank가 NORMAL일 경우 공지 게시판의 접근을 할 수 없습니다.
    if (user.rank === UserRank.NORMAL && kind === BoardKind.OPER) {
      throw new ForbiddenException('운영 게시판의 권한이 없습니다.');
    }
    board.title = createBoardDto.title;
    board.content = createBoardDto.content;
    board.Author = user;
    board.kind = createBoardDto.kind;

    //게시글 저장
    const saveBoard = await this.boardRepository.save(board);
    return saveBoard;
  }
}
