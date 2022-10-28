import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Histories } from '../entities/Histories';
import { Users } from '../entities/Users';

@Injectable()
export class HistoriesService {
  // 의존성 주입
  constructor(
    // 접속 기록 레포지터리 주입
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
  ) {}
}
