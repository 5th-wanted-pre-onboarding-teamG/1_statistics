import { IsNotEmpty, IsString } from 'class-validator';
import { BoardKind } from '../../entities/enums/boardKind';

export class UpdateBoardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
  kind: BoardKind;
}
