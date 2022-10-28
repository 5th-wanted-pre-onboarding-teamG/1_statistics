import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

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

  @Post(':kind')
  async createBoard(
    @Param('kind') kind: BoardKind,
    @Body() boardRequest: CreateBoardDto,
    @User() user: Users,
  ) {
    return await this.boardsService.createBoard(boardRequest, kind, user);
  }
}
