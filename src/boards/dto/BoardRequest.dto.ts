import { BoardKind } from 'src/entities/enums/boardKind';

export class BoardRequest {
  title: string;
  content: string;
  kind: BoardKind;
}
