import { Injectable, NotFoundException } from '@nestjs/common';
import { CitizenProfile, Entitlement, EntitlementPayment } from '../../common/types';
import { ENTITLEMENTS_BY_NIN, ENTITLEMENT_PAYMENTS } from './data';

@Injectable()
export class EntitlementsService {
  // Mock provider seam: swap for a real payroll/entitlement registry by NIN.
  list(citizen: CitizenProfile): Entitlement[] {
    return [...(ENTITLEMENTS_BY_NIN[citizen.nin] ?? [])];
  }

  history(citizen: CitizenProfile, id: string): EntitlementPayment[] {
    const owned = this.list(citizen).some((e) => e.id === id);
    const payments = ENTITLEMENT_PAYMENTS[id];
    if (!owned || !payments) throw new NotFoundException('Entitlement not found');
    return [...payments].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  }
}
