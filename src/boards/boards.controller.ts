import { Controller, Post, Body, Param } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';
import { BoardService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post(':kind')
  async createBoard(
    @Param('kind') kind: BoardKind,
    @Body() boardRequest: CreateBoardDto,
    @User() user: Users,
  ) {
    return await this.boardService.createBoard(boardRequest, kind, user);
  }
}
