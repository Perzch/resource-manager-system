import { Controller, Get } from '@nestjs/common';
import { StatisticService, DashboardStats } from './statistic.service';
import { IsPermission } from 'src/global/decorators/permission.decorator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('dashboard')
  @IsPermission(PermissionEnum.READ)
  async getDashboardStats(): Promise<DashboardStats> {
    return await this.statisticService.getDashboardStats();
  }
}
