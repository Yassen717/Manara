import { Application } from '../../common/types';
import { DEMO_CITIZEN, daysAgo } from '../../data/seed';

// In-memory per-citizen application store (nin -> Application[]).
// Replace with persistence / a real case-management provider later.

const byNin = new Map<string, Application[]>();

// Human-readable application references: MNR-2026-XXXXX, incrementing.
// Seeded demo applications use 00017 and 00041; new ones continue from 00042.
let refSeq = 42;
export function nextApplicationReference(): string {
  return `MNR-2026-${String(refSeq++).padStart(5, '0')}`;
}

export const ApplicationsStore = {
  all(nin: string): Application[] {
    return byNin.get(nin) ?? [];
  },

  add(nin: string, app: Application): Application {
    const list = byNin.get(nin) ?? [];
    list.push(app);
    byNin.set(nin, list);
    return app;
  },
};

byNin.set(DEMO_CITIZEN.nin, [
  {
    id: 'app_0000001',
    reference: 'MNR-2026-00017',
    serviceId: 'svc_passport_renewal',
    serviceName: 'Passport Renewal',
    serviceNameAr: 'تجديد جواز السفر',
    status: 'in_review',
    submittedAt: daysAgo(6),
    updatedAt: daysAgo(2),
    timeline: [
      { status: 'submitted', at: daysAgo(6), note: 'Application received digitally' },
      { status: 'in_review', at: daysAgo(2), note: 'Under review by the Passport Authority' },
    ],
    delivery: 'pickup',
  },
  {
    id: 'app_0000002',
    reference: 'MNR-2026-00041',
    serviceId: 'svc_birth_certificate',
    serviceName: 'Birth Certificate',
    serviceNameAr: 'شهادة ميلاد',
    status: 'completed',
    submittedAt: daysAgo(21),
    updatedAt: daysAgo(19),
    timeline: [
      { status: 'submitted', at: daysAgo(21), note: 'Application received digitally' },
      { status: 'approved', at: daysAgo(20), note: 'Birth entry verified in the civil registry' },
      { status: 'completed', at: daysAgo(19), note: 'QR-verified certificate issued to Documents' },
    ],
    delivery: 'digital',
  },
]);
