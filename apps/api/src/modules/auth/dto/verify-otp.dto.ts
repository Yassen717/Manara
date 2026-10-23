import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'otp_1730000000000_1', description: 'OTP session id returned by request-otp' })
  @IsString()
  otpId: string;

  @ApiProperty({ example: '123456', description: '6-digit code sent to the phone' })
  @IsString()
  @Length(6)
  code: string;
}
