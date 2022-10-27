import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  /**
   * 게시물 아이디로 특정 게시물을 조회합니다.
   * @api GET /boards/:boardId
   * @param boardId 게시물 아이디
   * @returns 특정 게시물 아이디의 게시물 한 개를 반환합니다.
   */
  @Get('search/:boardId')
  // ParseIntPipe로 string으로 들어오는 param값을 number로 바꿉니다.
  getSpecificBoard(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.boardsService.getSpecificBoard(boardId);
  }
}
