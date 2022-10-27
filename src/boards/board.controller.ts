import { Controller, Post, Body } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardRequest } from './dto/BoardRequest.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post('createFree')
  async createFreeBoard(@Body() boardRequest: BoardRequest) {
    return await this.boardService.createFreeBoard(boardRequest);
  }
  @Post('createNotice')
  async createNoticeBoard(@Body() boardRequest: BoardRequest) {
    return await this.boardService.createNoticeBoard(boardRequest);
  }
  @Post('createOper')
  async createOperBoard(@Body() boardRequest: BoardRequest) {
    return await this.boardService.createOperBoard(boardRequest);
  }
}
