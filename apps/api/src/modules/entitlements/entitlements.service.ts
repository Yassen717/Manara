import { Injectable } from '@nestjs/common';

@Injectable()
export class EntitlementsService {
  ping() {
    return { module: 'entitlements', status: 'stub' };
  }
}
