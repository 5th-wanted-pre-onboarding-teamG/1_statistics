import { IsDateString, IsNotEmpty } from 'class-validator';

export class SearchHistoryByTimeDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
