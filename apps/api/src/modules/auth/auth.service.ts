import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  ping() {
    return { module: 'auth', status: 'stub' };
  }
}
