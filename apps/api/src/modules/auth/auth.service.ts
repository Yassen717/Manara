import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsStore } from '../../data/sessions.store';
import { CitizenProfile } from '../../common/types';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const OTP_TTL_SEC = 300;

@Injectable()
export class AuthService {
  requestOtp(dto: RequestOtpDto): { otpId: string; expiresInSec: number; devCode: string } {
    const { otpId, devCode } = SessionsStore.createOtp(dto.nin, dto.phone);
    return { otpId, expiresInSec: OTP_TTL_SEC, devCode };
  }

  verifyOtp(dto: VerifyOtpDto): { token: string; citizen: CitizenProfile } {
    const session = SessionsStore.verifyOtp(dto.otpId, dto.code);
    if (!session) throw new UnauthorizedException('Invalid or expired code');
    return session;
  }
}
