import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestsService {
  ping() {
    return { module: 'requests', status: 'stub' };
  }
}
