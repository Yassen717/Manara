import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { Bill, CitizenProfile } from '../../common/types';
import { UtilitiesService } from './utilities.service';

@ApiTags('utilities')
@Controller('utilities')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UtilitiesController {
  constructor(private readonly svc: UtilitiesService) {}

  @Get('bills')
  @ApiOperation({ summary: 'List the caller utility bills' })
  @ApiResponse({ status: 200, description: 'Caller bills' })
  bills(@CurrentCitizen() citizen: CitizenProfile): Bill[] {
    return this.svc.listBills(citizen);
  }

  @Post('bills/:id/pay')
  @ApiOperation({ summary: 'Pay a utility bill' })
  @ApiResponse({ status: 200, description: 'Updated bill' })
  @ApiResponse({ status: 404, description: 'Bill not found' })
  pay(@CurrentCitizen() citizen: CitizenProfile, @Param('id') id: string): Bill {
    return this.svc.payBill(citizen, id);
  }
}
