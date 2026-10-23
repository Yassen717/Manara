import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  ping() {
    return { module: 'services', status: 'stub' };
  }
}
