import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthenticatedGuard } from '../auth/auth.guard';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  /**
   * 게시물 종류, 작성자 이름, 키워드(제목 혹은 내용)에 따라서 게시물을 검색하여 조회합니다.
   * @api GET /board?query=value[&query=value]
   * @query query { kind: 게시물 종류, name: 작성자 이름, keyword: 제목 및 내용 검색에 쓰일 단어}
   * @returns 각각의 용도에 따라 알맞게 게시물을 최신순으로 정렬하여 반환합니다.
   */
  @Get()
  searchBoards(
    @Query()
    query: {
      page: number;
      kind?: BoardKind;
      name?: string;
      keyword?: string;
    },
  ) {
    return this.boardsService.searchBoards(
      query.page,
      query.kind,
      query.name,
      query.keyword,
    );
  }

  /**
   * 현재 사용자가 작성한 모든 게시물을 조회합니다.
   * @api GET /boards/myBoards
   * @param user 요청객체에 담긴 유저 정보
   * @returns 내가 작성한 모든 게시물을 최신순으로 객체 배열로 반환합니다.
   */
  @Get('myBoards')
  getAllMyBoards(@User() user: Users) {
    return this.boardsService.getAllMyBoards(user.userId);
  }

  /**
   * @url POST '/boards/:kind'
   * @param kind 게시물의 종류를 정합니다.
   * @Body createBoardDto: 게시물 생성시 필요한 정보 입니다.{제목, 내용}
   * @User user:현재 로그인 된 유저를 나타냅니다.
   * @description 유저가 게시판을 생성합니다. rank별로 만들 수 있는 게시판이 다릅니다.
   * @returns 게시판 생성
   */
  @UseGuards(AuthenticatedGuard)
  @Post(':kind')
  async createBoard(
    @Param('kind') kind: BoardKind,
    @Body() createBoardDto: CreateBoardDto,
    @User() user: Users,
  ) {
    return await this.boardsService.createBoard(createBoardDto, kind, user);
  }

  /**
   * @url DELETE '/boards/:boardId'
   * @param boardId 게시글 아이디
   * @param user 세션에 저장된 유저 정보
   * @description 게시글 소프트 삭제
   */
  @UseGuards(AuthenticatedGuard)
  @Delete(':boardId')
  async deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @User() user: Users,
  ): Promise<void> {
    await this.boardsService.deleteBoard(boardId, user);
  }

  /**
   * @url PATCH '/boards/:boardId'
   * @param boardId 게시글아이디
   * @param user 세션에 저장된 유저정보
   * @description 게시글 수정 (타이틀, 내용)
   * - 일반유저: 자유게시판 본인작성만
   * - 관리자: 자유&운영게시판 본인작성)
   * - 수정을 하려다가 취소하는 경우를 고려하여 '?'를 붙였습니다.
   */
  @UseGuards(AuthenticatedGuard)
  @Patch(':boardId')
  async updateBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @User() user: Users,
    @Body() updateBoardDto?: UpdateBoardDto,
  ) {
    return await this.boardsService.updateBoard(boardId, updateBoardDto, user);

  /**
   * @url GET '/boards'
   * @param page 조회할 페이지 번호
   * @description 전체 게시판을 조회하는 기능입니다.
   * @returns 공지사항을 포함한 전체 게시판 게시글(최신순)
   */
  @UseGuards(AuthenticatedGuard)
  @Get('')
  async getAllBoards(
    @User() user: Users,
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ) {
    return await this.boardsService.getAllBoards(user.rank, page, pageSize);
  }
}
