import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Histories } from '../entities/Histories';
import { SearchHistoryByTimeDto } from './dto/search-historyByTime.dto';
import { ResultHistoryByTimeDto } from './dto/result-historyByTime.dto';
import { UserRank } from '../entities/enums/userRank';
import { ResultStatisticsByGenderDto } from './dto/result-statistics-by-gender.dto';

@Injectable()
export class HistoriesService {
  // 의존성 주입
  constructor(
    // 접속 기록 레포지터리 주입
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
  ) {}

  /**
   * 검색 기간 내에 해당하는 시간대별 접속자 수 목록 조회
   * @param searchHistoryByTimeDto 시간대별 조회에 필요한 정보 { 시작 날짜, 끝 날짜 }
   * @returns 검색 기간 범위에 포함되는 시간대별 접속 수 목록
   */
  async getHistoriesByConnectTime(
    searchHistoryByTimeDto: SearchHistoryByTimeDto,
  ): Promise<ResultHistoryByTimeDto> {
    const { startDate, endDate } = searchHistoryByTimeDto;

    // 검색 기간 내에 해당하는 시간대별 접속자 수 목록 조회 - 일반 유저만 대상으로 조회
    const connectRecords = await this.historiesRepository
      .createQueryBuilder('histories')
      .select(['HOUR(histories.connectTime) AS connectHour'])
      .leftJoin('histories.Connector', 'users')
      .addSelect('COUNT(DISTINCT users.userId) AS connectCount')
      .where('users.rank = :rank', { rank: UserRank.NORMAL })
      .andWhere(
        "DATE_FORMAT(histories.connectTime, '%Y-%m-%d') " +
          "BETWEEN DATE_FORMAT(:startDate, '%Y-%m-%d') AND DATE_FORMAT(:endDate, '%Y-%m-%d')",
        {
          startDate,
          endDate,
        },
      )
      .groupBy('connectHour')
      .getRawMany();

    return { startDate, endDate, connectRecords };
  }
  /**
   * 유저의 성별을 통계합니다.
   * 유저의 성별은 유저 rank가 NORMAL유저만 통계합니다
   * @returns NORMAL유저의 성별의 수를 보여 줍니다.
   */
  async getHistoriesByGender(): Promise<ResultStatisticsByGenderDto[]> {
    return await this.historiesRepository
      .createQueryBuilder('histories')
      .leftJoin('histories.Connector', 'users')
      .select(['users.gender AS gender'])
      .addSelect('COUNT(*) AS genderCount')
      .where('users.rank =:rank', { rank: UserRank.NORMAL })
      .groupBy('users.gender')
      .getRawMany();
  }
}
