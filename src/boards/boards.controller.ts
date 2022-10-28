import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { BoardService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

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
    return await this.boardService.createBoard(createBoardDto, kind, user);
  }
}
