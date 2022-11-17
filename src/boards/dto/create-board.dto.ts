import { IsNotEmpty, IsString } from 'class-validator';
import { BoardKind } from '../../entities/enums/boardKind';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
  kind: BoardKind;
}
