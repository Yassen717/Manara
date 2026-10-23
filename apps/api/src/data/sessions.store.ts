import { CitizenProfile } from '../common/types';
import { DEMO_CITIZEN } from './seed';

// Shared in-memory session/token store used by AuthModule and AuthGuard.
// Central here (not inside a module) so every module can resolve citizens
// without circular imports. Replace with real session/JWT verification later.

const tokens = new Map<string, CitizenProfile>();
const citizensByNin = new Map<string, CitizenProfile>([[DEMO_CITIZEN.nin, DEMO_CITIZEN]]);
const otps = new Map<string, { nin: string; code: string; expiresAt: number }>();

let seq = 1;

export const SessionsStore = {
  createOtp(nin: string, phone: string): { otpId: string; devCode: string } {
    const otpId = `otp_${Date.now()}_${seq++}`;
    const code = '123456';
    otps.set(otpId, { nin, code, expiresAt: Date.now() + 5 * 60_000 });
    return { otpId, devCode: code };
  },

  verifyOtp(otpId: string, code: string): { token: string; citizen: CitizenProfile } | null {
    const otp = otps.get(otpId);
    if (!otp || otp.code !== code || otp.expiresAt < Date.now()) return null;
    otps.delete(otpId);
    let citizen = citizensByNin.get(otp.nin);
    if (!citizen) {
      citizen = {
        ...DEMO_CITIZEN,
        nin: otp.nin,
        firstName: 'Libyan',
        lastName: 'Citizen',
        firstNameAr: 'مواطن',
        lastNameAr: 'ليبي',
        ekycStatus: 'unverified',
        registeredAt: new Date().toISOString(),
      };
      citizensByNin.set(otp.nin, citizen);
    }
    const token = `mnr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
    tokens.set(token, citizen);
    return { token, citizen };
  },

  resolve(token: string): CitizenProfile | undefined {
    return tokens.get(token);
  },

  findCitizen(nin: string): CitizenProfile | undefined {
    return citizensByNin.get(nin);
  },

  updateCitizen(nin: string, patch: Partial<CitizenProfile>): CitizenProfile | undefined {
    const c = citizensByNin.get(nin);
    if (!c) return undefined;
    Object.assign(c, patch);
    for (const [t, sess] of tokens) if (sess.nin === nin) tokens.set(t, c);
    return c;
  },
};
