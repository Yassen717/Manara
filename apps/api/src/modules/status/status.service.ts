import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  ping() {
    return { module: 'status', status: 'stub' };
  }
}
