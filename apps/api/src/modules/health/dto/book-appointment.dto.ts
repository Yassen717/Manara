import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class BookAppointmentDto {
  @ApiProperty({ example: 'fac_tch' })
  @IsString()
  facilityId: string;

  @ApiProperty({ example: 'Dialysis' })
  @IsString()
  department: string;

  @ApiProperty({ example: '2026-11-02T09:00:00Z' })
  @IsDateString()
  preferredDate: string;
}
