import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from 'src/entities/Boards';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  // 게시물 레포지터리를 주입합니다.
  constructor(
    @InjectRepository(Boards)
    private readonly boardsRepository: Repository<Boards>,
  ) {}

  /**
   * 게시물 아이디로 특정 게시물을 조회합니다.
   * @api GET /boards/:boardId
   * @param boardId 게시물 아이디
   * @returns 특정 게시물 아이디의 게시물 한 개를 반환합니다.
   */
  async getSpecificBoard(boardId: number) {
    // 게시물의 아이디는 고유한 값이므로 findOne을 사용했습니다.
    return await this.boardsRepository.findOne({
      where: { boardId },
    });
  }
}
