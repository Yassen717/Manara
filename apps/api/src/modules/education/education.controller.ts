import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { Certificate, CitizenProfile, ExamResult, Scholarship } from '../../common/types';
import { EducationService } from './education.service';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly svc: EducationService) {}

  @Get('certificates')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List the caller e-certificates' })
  @ApiResponse({ status: 200, description: 'Caller certificates' })
  certificates(@CurrentCitizen() citizen: CitizenProfile): Certificate[] {
    return this.svc.listCertificates(citizen);
  }

  @Get('exam-results')
  @ApiOperation({ summary: 'Look up a secondary exam result by seat number' })
  @ApiQuery({ name: 'seat', required: true, example: '2026-1001' })
  @ApiResponse({ status: 200, description: 'Exam result' })
  @ApiResponse({ status: 404, description: 'No result for this seat number' })
  examResult(@Query('seat') seat: string): ExamResult {
    return this.svc.examResultBySeat(seat);
  }

  @Get('scholarship')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the caller scholarship, if any' })
  @ApiResponse({ status: 200, description: 'Scholarship or null' })
  scholarship(@CurrentCitizen() citizen: CitizenProfile): Scholarship | null {
    return this.svc.scholarshipFor(citizen);
  }
}
