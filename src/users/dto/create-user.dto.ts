import { UserRank } from 'src/entities/enums/userRank';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  rank?: UserRank;
  gender: '남성' | '여성';
  age: string;
  phone: string;
}
