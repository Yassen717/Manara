import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { Appointment, CitizenProfile, Facility, MedicineStock } from '../../common/types';
import { HealthService } from './health.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly svc: HealthService) {}

  @Get('facilities')
  @ApiOperation({ summary: 'List hospitals, clinics, pharmacies and primary health centers' })
  @ApiQuery({ name: 'municipality', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['hospital', 'clinic', 'pharmacy', 'phc'] })
  @ApiResponse({ status: 200, description: 'Filtered facility list' })
  facilities(
    @Query('municipality') municipality?: string,
    @Query('type') type?: string,
  ): Facility[] {
    return this.svc.listFacilities(municipality, type);
  }

  @Get('medicines')
  @ApiOperation({ summary: 'Search medicine stock across facilities' })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse({ status: 200, description: 'Filtered medicine stock list' })
  medicines(@Query('q') q?: string): MedicineStock[] {
    return this.svc.listMedicines(q);
  }

  @Post('appointments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a facility appointment' })
  @ApiResponse({ status: 201, description: 'Created appointment' })
  book(
    @CurrentCitizen() citizen: CitizenProfile,
    @Body() dto: BookAppointmentDto,
  ): Appointment {
    return this.svc.bookAppointment(citizen, dto);
  }

  @Get('appointments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List the caller appointments' })
  @ApiResponse({ status: 200, description: 'Caller appointments' })
  appointments(@CurrentCitizen() citizen: CitizenProfile): Appointment[] {
    return this.svc.listAppointments(citizen);
  }
}
