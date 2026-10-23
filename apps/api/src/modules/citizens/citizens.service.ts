import { Injectable } from '@nestjs/common';

@Injectable()
export class CitizensService {
  ping() {
    return { module: 'citizens', status: 'stub' };
  }
}
