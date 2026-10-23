import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  ping() {
    return { module: 'utilities', status: 'stub' };
  }
}
