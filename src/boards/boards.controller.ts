import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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

  /**
   * @url DELETE '/boards/:boardId'
   * @param boardId 게시글 아이디
   * @param user 세션에 저장된 유저 정보
   * @description 게시글 소프트 삭제
   */
  @Delete(':boardId')
  async deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @User() user: Users,
  ): Promise<void> {
    await this.boardService.deleteBoard(boardId, user);
  }
}
