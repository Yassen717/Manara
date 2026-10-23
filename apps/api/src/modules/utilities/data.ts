import { Bill } from '../../common/types';
import { DEMO_CITIZEN, daysAgo, daysAhead } from '../../data/seed';

// Mock utilities data: per-citizen bills across electricity (GECOL), water,
// telecom (LTT) and gas-cylinder bookings. Swap for real utility billing
// provider APIs later.

// Stored bills carry the owning citizen's NIN internally; services strip it
// before returning data to callers.
export interface StoredBill extends Bill {
  nin: string;
}

export const BILLS: StoredBill[] = [
  {
    id: 'bill_elec_2026_10',
    nin: DEMO_CITIZEN.nin,
    utility: 'electricity',
    period: 'Oct 2026',
    amount: 95.4,
    currency: 'LYD',
    dueAt: daysAhead(12),
    status: 'due',
  },
  {
    id: 'bill_elec_2026_09',
    nin: DEMO_CITIZEN.nin,
    utility: 'electricity',
    period: 'Sep 2026',
    amount: 88.2,
    currency: 'LYD',
    dueAt: daysAgo(25),
    status: 'paid',
  },
  {
    id: 'bill_water_2026_q3',
    nin: DEMO_CITIZEN.nin,
    utility: 'water',
    period: 'Q3 2026',
    amount: 22.5,
    currency: 'LYD',
    dueAt: daysAhead(18),
    status: 'due',
  },
  {
    id: 'bill_telecom_2026_10',
    nin: DEMO_CITIZEN.nin,
    utility: 'telecom',
    period: 'Oct 2026',
    amount: 45,
    currency: 'LYD',
    dueAt: daysAgo(9),
    status: 'overdue',
  },
  {
    id: 'bill_gas_2026_10',
    nin: DEMO_CITIZEN.nin,
    utility: 'gas',
    period: 'Oct 2026',
    amount: 12,
    currency: 'LYD',
    dueAt: daysAhead(7),
    status: 'due',
  },
];

// Display labels per utility, used when recording bill-payment transactions.
export const UTILITY_LABELS: Record<Bill['utility'], { en: string; ar: string }> = {
  electricity: { en: 'Electricity', ar: 'الكهرباء' },
  water: { en: 'Water', ar: 'المياه' },
  telecom: { en: 'Telecom (LTT)', ar: 'ليبيا للاتصالات والتقنية' },
  gas: { en: 'Gas cylinder', ar: 'أسطوانة الغاز' },
};
