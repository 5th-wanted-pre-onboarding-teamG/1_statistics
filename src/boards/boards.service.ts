import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { UserRank } from 'src/entities/enums/userRank';

@Injectable()
export class BoardsService {
  // 게시물 레포지터리를 주입합니다.
  constructor(
    @InjectRepository(Boards)
    private readonly boardsRepository: Repository<Boards>,
  ) {}

  /**
   * 종류에 따라 게시물을 조회합니다.
   * @param kind 게시물 종류
   * @returns 종류에 맞는 게시물을 객체 배열로 반환합니다.
   */
  async getBoardsByKind(kind: BoardKind) {
    return await this.boardsRepository
      .createQueryBuilder('boards')
      .where('boards.kind = :kind', { kind })
      .orderBy('boards.createdAt', 'DESC')
      .getManyAndCount();
  }

  /**
   * 게시물 아이디로 특정 게시물을 조회합니다.
   * @api GET /boards/:boardId
   * @param boardId 게시물 아이디
   * @returns 특정 게시물 아이디의 게시물 한 개를 반환합니다.
   */
  async getSpecificBoard(boardId: number) {
    // 게시물의 아이디는 고유한 값이므로 findOne을 사용했습니다.
    return await this.boardsRepository.findOne({
      where: { boardId },
    });
  }
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
    const saveBoard = await this.boardsRepository.save(board);
    return saveBoard;
  }

  /**
   * 게시글 데이터를 소프트 삭제
   * @param boardId 게시글 아이디
   * @param user 삭제를 요청한 유저
   * @returns 삭제 결과
   */
  async deleteBoard(boardId: number, user: Users): Promise<DeleteResult> {
    // 게시글 아이디와 유저 정보가 일치하는 게시글이 있는지 확인
    const existsBoard = await this.boardsRepository
      .createQueryBuilder('boards')
      .leftJoin('boards.Author', 'users')
      .where('boards.boardId = :boardId', { boardId })
      .andWhere('users.userId = :userId', { userId: user.userId })
      .getOne();

    // 게시글이 없거나 작성자가 일치하지 않을 시 에러 처리
    if (!existsBoard) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    // 게시글 삭제
    return this.boardsRepository.softDelete(boardId);
  }
}
