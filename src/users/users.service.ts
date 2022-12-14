import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRank } from 'src/entities/enums/userRank';

@Injectable()
export class UsersService {
  // 의존성 주입
  constructor(
    // 유저 레포지터리 주입
    private dataSource: DataSource,
    @InjectRepository(Users)
    private readonly usersRepsitory: Repository<Users>,
  ) {}

  /**
   * 유저 회원가입 서비스입니다.
   * @param body 회원가입에 필요한 정보 { 이메일, 비밀번호, 이름, 랭크, 성별, 나이, 전화번호 }
   * @returns 유저 회원가입 결과
   */
  async signUp(body: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // 데이터베이스를 조회하여 이미 존재하는 유저인지 검사합니다.
    const row = await this.findByEmail(body.email);

    // 이미 가입된 회원이라면 회원가입하면 안되므로 예외를 발생시킵니다.
    if (row) {
      throw new BadRequestException('이미 가입된 회원입니다.');
    }

    // 데이터베이스에 바로 저장하지 않고 암호화해서 저장합니다.
    const hashedPassword = await bcrypt.hash(body.password, 12);
    try {
      // 데이터베이스에 저장합니다.
      const result = await queryRunner.manager.getRepository(Users).save({
        ...body,
        password: hashedPassword,
        age: +body.age,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 유저 데이터를 소프트 삭제합니다.
   * @param userId 유저 아이디
   * @returns 삭제 결과
   */
  async deleteUserById(userId: number) {
    const result = await this.usersRepsitory.softDelete({
      userId,
    });
    return result;
  }

  /**
   * 유저를 이메일을 통해 찾고 그 결과를 한 행 반환합니다.
   * @param email 유저 이메일
   * @returns 유저 이메일 탐색 결과
   */
  async findByEmail(email: string) {
    return this.usersRepsitory.findOne({
      where: { email },
    });
  }

  /**
   * 유저의 성별을 통계합니다.
   * 유저의 성별은 유저 rank가 NORMAL유저만 통계합니다
   * @returns NORMAL유저의 성별의 수를 보여 줍니다.
   */
  async getHistoriesByGender() {
    return await this.usersRepsitory
      .createQueryBuilder('users')
      .select('users.gender AS gender')
      .addSelect('COUNT(*) ')
      .where('users.rank =:rank', { rank: UserRank.NORMAL })
      .groupBy('gender')
      .getRawMany();
  }
}
