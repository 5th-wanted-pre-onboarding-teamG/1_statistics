import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from '../entities/Boards';
import { DeleteResult, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardKind } from 'src/entities/enums/boardKind';
import { Users } from 'src/entities/Users';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
  ) {}
  async createBoard(
    boardRequest: CreateBoardDto,
    kind: BoardKind,
    user: Users,
  ) {
    const result = [];
    const board = await this.boardRepository.create({
      title: boardRequest.title,
      content: boardRequest.content,
      kind,
      Author: user,
    });
    return this.boardRepository.save(board);
  }

  /**
   * 게시글 데이터를 소프트 삭제
   * @param boardId 게시글 아이디
   * @param user 삭제를 요청한 유저
   * @returns 삭제 결과
   */
  async deleteBoard(boardId: number, user: Users): Promise<DeleteResult> {
    // 게시글 아이디와 유저 정보가 일치하는 게시글이 있는지 확인
    const existsBoard = await this.boardRepository.findOneBy({
      boardId,
      Author: user,
    });

    // 게시글이 없거나 작성자가 일치하지 않을 시 에러 처리
    if (!existsBoard) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    // 게시글 삭제
    return this.boardRepository.softDelete(boardId);
  }
}
