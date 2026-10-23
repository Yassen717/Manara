import { CitizenProfile, Municipality, Region } from '../common/types';

// Canonical shared seed data. Module-specific mock data lives in each module's data.ts.
// The demo citizen drives every personalized mock response.

export const DEMO_CITIZEN: CitizenProfile = {
  nin: '119880123456',
  firstName: 'Ahmed',
  lastName: 'Al-Mansouri',
  firstNameAr: 'أحمد',
  lastNameAr: 'المنصوري',
  dateOfBirth: '1988-04-15',
  gender: 'male',
  phone: '+218912345678',
  email: 'ahmed.mansouri@example.ly',
  municipality: 'Tripoli',
  address: 'Hay Al-Andalus, Tripoli',
  ekycStatus: 'verified',
  registeredAt: '2025-02-10T09:30:00Z',
};

export const REGIONS: Region[] = [
  { name: 'Tripoli', nameAr: 'طرابلس' },
  { name: 'Benghazi', nameAr: 'بنغازي' },
  { name: 'Fezzan', nameAr: 'فزان' },
  { name: 'Misrata', nameAr: 'مصراتة' },
  { name: 'Al Jabal Al Akhdar', nameAr: 'الجبل الأخضر' },
  { name: 'Zawiya', nameAr: 'الزاوية' },
];

export const MUNICIPALITIES: Municipality[] = [
  { name: 'Tripoli Center', nameAr: 'طرابلس المركز', region: 'Tripoli' },
  { name: 'Hay Al-Andalus', nameAr: 'حي الأندلس', region: 'Tripoli' },
  { name: 'Souq Al-Jumaa', nameAr: 'سوق الجمعة', region: 'Tripoli' },
  { name: 'Janzour', nameAr: 'جنزور', region: 'Tripoli' },
  { name: 'Tajoura', nameAr: 'تاجوراء', region: 'Tripoli' },
  { name: 'Benghazi', nameAr: 'بنغازي', region: 'Benghazi' },
  { name: 'Al-Bayda', nameAr: 'البيضاء', region: 'Al Jabal Al Akhdar' },
  { name: 'Misrata', nameAr: 'مصراتة', region: 'Misrata' },
  { name: 'Zawiya', nameAr: 'الزاوية', region: 'Zawiya' },
  { name: 'Sabha', nameAr: 'سبها', region: 'Fezzan' },
  { name: 'Murzuq', nameAr: 'مرزق', region: 'Fezzan' },
  { name: 'Derna', nameAr: 'درنة', region: 'Al Jabal Al Akhdar' },
];

// Deterministic-ish helpers for mock ids/timestamps
let counter = 0;
export function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36).padStart(2, '0')}`;
}

export function reference(prefix = 'MNR'): string {
  counter += 1;
  return `${prefix}-2026-${String(counter).padStart(5, '0')}`;
}

export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

export function daysAhead(n: number): string {
  return new Date(Date.now() + n * 86_400_000).toISOString();
}
