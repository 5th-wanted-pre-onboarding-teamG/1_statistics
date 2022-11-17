import { Gender } from 'src/entities/enums/gender';

export class ResultStatisticsByGenderDto {
  gender: Gender;
  genderCount: number;
}
