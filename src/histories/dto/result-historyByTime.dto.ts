export class ResultHistoryByTimeDto {
  startDate: Date;
  endDate: Date;
  connectRecords: { connectHour: number; connectCount: number }[];
}
