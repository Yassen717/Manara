import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PayBillDto {
  @ApiProperty({ example: 'bill_elec_sep26' })
  @IsString()
  billId: string;

  @ApiPropertyOptional({ example: 95.4 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 'Electricity bill' })
  @IsOptional()
  @IsString()
  description?: string;
}
