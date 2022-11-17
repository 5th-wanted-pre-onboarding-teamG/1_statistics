export class ResultStatisticsByAgeDto {
  constructor(connectDate: Date, age: number, ageCount: number) {
    this.connectDate = connectDate;
    this.age = age;
    this.ageCount = ageCount;
  }
  connectDate: Date;
  age: number;
  ageCount: number;
}
