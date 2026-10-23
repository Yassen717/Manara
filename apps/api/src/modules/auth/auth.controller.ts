import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { CurrentCitizen } from '../../common/current-citizen.decorator';
import { CitizenProfile } from '../../common/types';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('request-otp')
  @ApiOperation({
    summary: 'Request a login OTP for a National ID + phone pair',
    description:
      'Creates an OTP session (5-minute TTL). The mock provider returns devCode in the ' +
      'response so the dev frontend can display it — production hides it and delivers via SMS only.',
  })
  @ApiResponse({ status: 201, description: 'OTP session created' })
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.svc.requestOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify an OTP code and receive a bearer token' })
  @ApiResponse({ status: 201, description: 'Token issued' })
  @ApiResponse({ status: 401, description: 'Invalid or expired code' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.svc.verifyOtp(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated citizen profile' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  me(@CurrentCitizen() citizen: CitizenProfile) {
    return citizen;
  }
}
