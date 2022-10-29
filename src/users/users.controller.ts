import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // 의존성 주업
  constructor(private readonly usersService: UsersService) {}

  /**
   * @url POST '/users'
   * @param createUserDto 회원가입에 필요한 정보 { 이메일, 비밀번호, 이름, 랭크, 성별, 나이, 전화번호 }
   * @description 유저 회원가입 기능입니다.
   * @returns 유저생성 결과
   */
  @Post()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  /**
   * @url POST '/users/:userId'
   * @param userId 유저 생성시 자동으로 생성된 아이디
   * @description 유저를 소프트 삭제합니다.
   * @returns 삭제된 결과 반환
   */
  @Delete(':userId')
  deleteUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.deleteUserById(userId);
  }
}
