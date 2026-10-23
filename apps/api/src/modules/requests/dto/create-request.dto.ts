import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { RequestType } from '../../../common/types';

const VALID_TYPES: RequestType[] = ['power_outage', 'water_supply', 'waste', 'road', 'telecom', 'other'];

export class CreateRequestDto {
  @ApiProperty({ enum: VALID_TYPES })
  @IsIn(VALID_TYPES)
  type: RequestType;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty()
  @IsString()
  municipality: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  region?: string;
}
