import { Gender } from 'src/entities/enums/gender';
import { UserRank } from 'src/entities/enums/userRank';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  rank?: UserRank;
  gender: Gender;
  age: string;
  phone: string;
}
