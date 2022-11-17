import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender } from 'src/entities/enums/gender';
import { UserRank } from 'src/entities/enums/userRank';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(UserRank)
  rank: UserRank;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
