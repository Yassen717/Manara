import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '119880123456', description: 'National ID number (8-14 digits)' })
  @IsString()
  @Matches(/^\d{8,14}$/)
  nin: string;

  @ApiProperty({ example: '+218912345678', description: 'Mobile phone number receiving the OTP' })
  @IsString()
  @MinLength(6)
  phone: string;
}
