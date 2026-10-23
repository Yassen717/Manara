import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile, Entitlement, EntitlementPayment } from '../../common/types';
import { EntitlementsService } from './entitlements.service';

@ApiTags('entitlements')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly svc: EntitlementsService) {}

  @Get()
  @ApiOperation({ summary: 'Entitlements for the authenticated citizen' })
  @ApiResponse({ status: 200, description: 'Salaries, grants, transfers and scholarships' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  list(@CurrentCitizen() citizen: CitizenProfile): Entitlement[] {
    return this.svc.list(citizen);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Payment history for one entitlement' })
  @ApiResponse({ status: 200, description: 'Payments newest-first' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Entitlement not found' })
  history(
    @CurrentCitizen() citizen: CitizenProfile,
    @Param('id') id: string,
  ): EntitlementPayment[] {
    return this.svc.history(citizen, id);
  }
}
