import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsStore } from '../data/sessions.store';

// Mock auth guard: resolves Bearer tokens issued by AuthService via SessionsStore.
// Swap for a real JWT/OAuth2 guard when integrating a real identity provider.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    const session = token ? SessionsStore.resolve(token) : undefined;
    if (!session) throw new UnauthorizedException('Missing or invalid token');
    req.citizen = session;
    return true;
  }
}
