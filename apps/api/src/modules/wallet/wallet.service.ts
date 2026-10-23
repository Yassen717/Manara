import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
  ping() {
    return { module: 'wallet', status: 'stub' };
  }
}
