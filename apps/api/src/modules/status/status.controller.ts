import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NationalStatus, OutageSchedule } from '../../common/types';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly svc: StatusService) {}

  @Get('national')
  @ApiOperation({ summary: 'National service status board (public)' })
  @ApiResponse({ status: 200, description: 'NationalStatus' })
  national(): NationalStatus {
    return this.svc.national();
  }

  @Get('outages')
  @ApiOperation({ summary: 'Planned outage schedule, filterable by region and utility (public)' })
  @ApiResponse({ status: 200, description: 'OutageSchedule[]' })
  outages(@Query('region') region?: string, @Query('utility') utility?: string): OutageSchedule[] {
    return this.svc.outages({ region, utility });
  }
}
