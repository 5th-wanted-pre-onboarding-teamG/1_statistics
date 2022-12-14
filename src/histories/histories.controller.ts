import { Body, Controller, Get } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { SearchHistoryByTimeDto } from './dto/search-historyByTime.dto';
import { ResultHistoryByTimeDto } from './dto/result-historyByTime.dto';
import { ResultStatisticsByGenderDto } from './dto/result-statistics-by-gender.dto';
import { ResultStatisticsByAgeDto } from './dto/result-statistics-by-age.dto';

@Controller('histories')
export class HistoriesController {
  // 의존성 주업
  constructor(private readonly historiesService: HistoriesService) {}

  /**
   * 검색 기간 내에 해당하는 시간대별 접속자 수 목록 조회
   * @param searchHistoryByTimeDto 시간대별 조회에 필요한 정보 { 시작 날짜, 끝 날짜 }
   * @returns ResultHistoryByTimeDto 검색 기간 내에 해당하는 시간대별 접속자 수 목록 { 시작 날짜, 끝 날짜, 시간대별 접속자 수 목록}
   */
  @Get('/connectTime')
  async getHistoriesByConnectTime(
    @Body() searchHistoryByTimeDto: SearchHistoryByTimeDto,
  ): Promise<ResultHistoryByTimeDto> {
    return this.historiesService.getHistoriesByConnectTime(
      searchHistoryByTimeDto,
    );
  }

  /**
   * @url Get '/users/gender'
   * @returns NORMAL유저의 성별의 수를 반환합니다.
   */
  @Get('gender')
  async getHistoriesByGender(): Promise<ResultStatisticsByGenderDto[]> {
    return await this.historiesService.getHistoriesByGender();
  }

  /**
   * @url GET '/histories/age
   * @returns 금일 방문한 유저 나이기준으로 통계를 나타냅니다.
   */
  @Get('age')
  async getNowDateStatisticsFromUserAges(): Promise<ResultStatisticsByAgeDto[]> {
    return await this.historiesService.getNowDateStatisticsFromUserAges();
  }
}
