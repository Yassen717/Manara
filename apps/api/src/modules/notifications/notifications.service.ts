import { Injectable } from '@nestjs/common';
import { AppNotification } from '../../common/types';
import { DEMO_CITIZEN } from '../../data/seed';
import { DEMO_NOTIFICATIONS, welcomeNotification } from './data';

@Injectable()
export class NotificationsService {
  private readonly byNin = new Map<string, AppNotification[]>();

  listFor(nin: string): AppNotification[] {
    return [...this.ensure(nin)].sort((a, b) => b.at.localeCompare(a.at));
  }

  markRead(nin: string, id: string): AppNotification | undefined {
    const notification = this.ensure(nin).find((n) => n.id === id);
    if (notification) notification.read = true;
    return notification;
  }

  markAllRead(nin: string): { updated: number } {
    let updated = 0;
    for (const n of this.ensure(nin)) {
      if (!n.read) {
        n.read = true;
        updated += 1;
      }
    }
    return { updated };
  }

  private ensure(nin: string): AppNotification[] {
    let list = this.byNin.get(nin);
    if (!list) {
      list =
        nin === DEMO_CITIZEN.nin ? DEMO_NOTIFICATIONS.map((n) => ({ ...n })) : [welcomeNotification()];
      this.byNin.set(nin, list);
    }
    return list;
  }
}
