import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { Application, CitizenProfile, ServiceDetail, ServiceSummary } from '../../common/types';
import { CategoryInfo } from './data';
import { ApplyServiceDto } from './dto/apply-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List services, filterable by category, free text, and popularity' })
  list(
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('popular') popular?: string,
  ): ServiceSummary[] {
    return this.svc.list({ category, q, popular });
  }

  @Get('categories')
  @ApiOperation({ summary: 'List service categories with bilingual labels and counts' })
  categories(): CategoryInfo[] {
    return this.svc.categories();
  }

  // 'applications' routes are declared before ':slug' so they are not captured by it.
  @Get('applications')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List the caller's service applications, newest first" })
  applications(@CurrentCitizen() citizen: CitizenProfile): Application[] {
    return this.svc.listApplications(citizen.nin);
  }

  @Get('applications/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one of the caller’s applications' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  application(@CurrentCitizen() citizen: CitizenProfile, @Param('id') id: string): Application {
    return this.svc.getApplication(citizen.nin, id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get full details of a service by slug' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  bySlug(@Param('slug') slug: string): ServiceDetail {
    return this.svc.getBySlug(slug);
  }

  @Post(':slug/apply')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit an application for a service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  apply(
    @Param('slug') slug: string,
    @CurrentCitizen() citizen: CitizenProfile,
    @Body() dto: ApplyServiceDto,
  ): Application {
    return this.svc.apply(slug, citizen, dto);
  }
}
