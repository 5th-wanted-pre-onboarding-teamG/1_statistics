import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
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
   * @url GET '/boards'
   * @param offset 조회결과에 대한 pagination
   * @param limit 조회결과에 대한 pagination
   * @description 유저 등급에 따라 전체 게시판을 조회하는 기능입니다.
   * @returns 게시판 조회 결과
   */
  @UseGuards(AuthenticatedGuard)
  @Get('')
  async getAllBoards(
    @User() user: Users,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    return await this.boardService.getAllBoards(user.rank, offset, limit);
  }

  @Post(':kind')
  async createBoard(
    @Param('kind') kind: BoardKind,
    @Body() boardRequest: CreateBoardDto,
    @User() user: Users,
  ) {
    return await this.boardService.createBoard(boardRequest, kind, user);
  }
}
