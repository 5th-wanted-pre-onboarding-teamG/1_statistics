import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepsitory: Repository<Users>,
  ) {}

  async userSignup(body: CreateUserDto) {
    const row = await this.findByEmail(body.email);
    if (row) {
      throw new BadRequestException('이미 가입된 회원입니다.');
    }
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const result = await this.usersRepsitory.save({
      ...body,
      password: hashedPassword,
      age: +body.age,
    });
    return result;
  }

  async removeUserById(id: number) {
    const result = await this.usersRepsitory.softDelete({
      userId: id,
    });
    return result;
  }

  async findByEmail(email: string) {
    return this.usersRepsitory.findOne({
      where: { email },
    });
  }
}
