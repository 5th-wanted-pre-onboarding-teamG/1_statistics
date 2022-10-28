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
   * 종류에 따라 게시물을 조회합니다.
   * @api GET /boards/search?kind=kind
   * @query kind 게시물 종류 { '자유' | '운영' | '공지' }
   * @returns 종류에 맞는 게시물을 객체 배열로 반환합니다.
   */
  @Get('search')
  getBoardsByKind(@Query('kind') kind: BoardKind) {
    return this.boardsService.getBoardsByKind(kind);
  }

  /**
   * 게시물 아이디로 특정 게시물을 조회합니다.
   * @api GET /boards/search/:boardId
   * @param boardId 게시물 아이디
   * @returns 특정 게시물 아이디의 게시물 한 개를 반환합니다.
   */
  @Get('search/:boardId')
  // ParseIntPipe로 string으로 들어오는 param값을 number로 바꿉니다.
  getSpecificBoard(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.boardsService.getSpecificBoard(boardId);
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
  ): Promise<void> {
    await this.boardsService.updateBoard(boardId, updateBoardDto, user);
  }
}
