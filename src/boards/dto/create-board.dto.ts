import { BoardKind } from 'src/entities/enums/boardKind';

export class CreateBoardDto {
  title: string;
  content: string;
  kind: BoardKind;
}
