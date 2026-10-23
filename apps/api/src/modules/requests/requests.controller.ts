import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile, ServiceRequest } from '../../common/types';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';

@ApiTags('requests')
@Controller('requests')
export class RequestsController {
  constructor(private readonly svc: RequestsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "List the caller's service requests plus public ones" })
  @ApiResponse({ status: 200, description: 'ServiceRequest[] sorted newest first' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  list(
    @CurrentCitizen() citizen: CitizenProfile,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ): ServiceRequest[] {
    return this.svc.listFor(citizen, { status, type });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'File a new service request' })
  @ApiResponse({ status: 201, description: 'The created ServiceRequest' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  create(@CurrentCitizen() citizen: CitizenProfile, @Body() dto: CreateRequestDto): ServiceRequest {
    return this.svc.create(citizen, dto);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Aggregate counts over all service requests (public)' })
  @ApiResponse({ status: 200, description: '{ total, byStatus, byType }' })
  statsSummary() {
    return this.svc.stats();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single service request visible to the caller' })
  @ApiResponse({ status: 200, description: 'ServiceRequest' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  findOne(@CurrentCitizen() citizen: CitizenProfile, @Param('id') id: string): ServiceRequest {
    const req = this.svc.findFor(citizen, id);
    if (!req) throw new NotFoundException('Service request not found');
    return req;
  }
}
