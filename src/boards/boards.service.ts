import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { Brackets, DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { UserRank } from 'src/entities/enums/userRank';

@Injectable()
export class BoardsService {
  // 게시물 레포지터리를 주입합니다.
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Boards)
    private readonly boardsRepository: Repository<Boards>,
  ) {}

  async searchBoards(page = 1, kind?: BoardKind, name = '', keyword = '') {
    const take = 30;

    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .select('boards')
      .from(Boards, 'boards')
      .leftJoinAndSelect('boards.Author', 'author')
      .where('author.name LIKE :name', { name: `%${name}%` })
      .andWhere(
        new Brackets((qb) => {
          qb.where('boards.title like :keyword', { keyword: `%${keyword}%` }),
            qb.orWhere('boards.content like :keyword', {
              keyword: `%${keyword}%`,
            });
        }),
      )
      .take(take)
      .skip(take * (page - 1))
      .orderBy('boards.createdAt', 'DESC');

    if (kind) {
      queryBuilder.andWhere('boards.kind = :kind', { kind });
    }

    return await queryBuilder.getMany();
  }

  /**
   * 현재 사용자가 작성한 모든 게시물을 조회합니다.
   * @api GET /boards/myBoards
   * @param user 요청객체에 담긴 유저 정보
   * @returns 내가 작성한 모든 게시물을 최신순으로 객체 배열로 반환합니다.
   */
  async getAllMyBoards(userId: number) {
    return await this.boardsRepository
      .createQueryBuilder('boards')
      .innerJoin('boards.Author', 'author', 'author.userId = :userId', {
        userId,
      })
      .orderBy('boards.createdAt', 'DESC')
      .getManyAndCount();
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
