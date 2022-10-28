import { Controller } from '@nestjs/common';
import { HistoriesService } from './histories.service';

@Controller('histories')
export class HistoriesController {
  // 의존성 주업
  constructor(private readonly historiesService: HistoriesService) {}
}
