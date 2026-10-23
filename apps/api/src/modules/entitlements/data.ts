import { Entitlement, EntitlementPayment } from '../../common/types';
import { DEMO_CITIZEN, daysAgo, daysAhead } from '../../data/seed';

// Mock entitlements for the demo citizen, drawn from the Libya research:
// late public salaries, family grants, the IMF-backed fuel-subsidy-to-cash
// reform, and stalled postgraduate scholarships.
export const ENTITLEMENTS: Entitlement[] = [
  {
    id: 'ent_salary',
    kind: 'salary',
    title: 'Public employee salary',
    titleAr: 'مرتب موظف حكومي',
    amount: 2200,
    currency: 'LYD',
    period: 'monthly',
    nextPaymentAt: daysAhead(9),
    status: 'active',
  },
  {
    id: 'ent_family',
    kind: 'family_grant',
    title: 'Family & children grant',
    titleAr: 'منحة الزوجة والأبناء',
    amount: 450,
    currency: 'LYD',
    period: 'quarterly',
    nextPaymentAt: daysAhead(40),
    status: 'active',
  },
  {
    id: 'ent_fuel',
    kind: 'subsidy_transfer',
    title: 'Fuel subsidy compensation',
    titleAr: 'تعويض الدعم على الوقود',
    amount: 300,
    currency: 'LYD',
    period: 'monthly',
    nextPaymentAt: daysAhead(30),
    status: 'pending',
  },
  {
    id: 'ent_scholar',
    kind: 'scholarship',
    title: 'Postgraduate top-up grant',
    titleAr: 'منحة تكميلية للدراسات العليا',
    amount: 650,
    currency: 'LYD',
    period: 'monthly',
    nextPaymentAt: daysAgo(40),
    status: 'paused',
  },
];

// Ownership: only the demo citizen carries seeded entitlements; everyone
// else gets an empty list until a real provider is wired in.
export const ENTITLEMENTS_BY_NIN: Record<string, Entitlement[]> = {
  [DEMO_CITIZEN.nin]: ENTITLEMENTS,
};

let paymentSeq = 0;
function paymentRef(): string {
  paymentSeq += 1;
  return `PAY-${String(30000 + paymentSeq)}`;
}

// Builds `pastCount` historical payments spaced `intervalDays` apart (one of
// them flagged 'delayed' at position delayedFromEnd, 1 = most recent) plus a
// single 'scheduled' payment `scheduledInDays` ahead.
function buildHistory(
  entId: string,
  amount: number,
  intervalDays: number,
  pastCount: number,
  delayedFromEnd: number,
  scheduledInDays: number,
): EntitlementPayment[] {
  const prefix = entId.replace('ent_', 'pay_');
  const list: EntitlementPayment[] = [];
  for (let i = pastCount; i >= 1; i--) {
    list.push({
      id: `${prefix}_${String(pastCount - i + 1).padStart(3, '0')}`,
      amount,
      paidAt: daysAgo(i * intervalDays),
      reference: paymentRef(),
      status: i === delayedFromEnd ? 'delayed' : 'paid',
    });
  }
  list.push({
    id: `${prefix}_${String(pastCount + 1).padStart(3, '0')}`,
    amount,
    paidAt: daysAhead(scheduledInDays),
    reference: paymentRef(),
    status: 'scheduled',
  });
  return list;
}

export const ENTITLEMENT_PAYMENTS: Record<string, EntitlementPayment[]> = {
  ent_salary: buildHistory('ent_salary', 2200, 30, 10, 3, 9),
  ent_family: buildHistory('ent_family', 450, 90, 7, 2, 40),
  ent_fuel: buildHistory('ent_fuel', 300, 30, 9, 4, 30),
  ent_scholar: buildHistory('ent_scholar', 650, 30, 11, 1, 25),
};
