import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriesService } from './histories.service';
import { Histories } from '../entities/Histories';
import { HistoriesController } from './histories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Histories])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
