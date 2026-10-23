import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  ping() {
    return { module: 'notifications', status: 'stub' };
  }
}
