import type { RequestStatus, RequestType } from '@/lib/types';
import type { Lang } from '@/lib/i18n';
import { pick } from '@/lib/i18n';

export const REQUEST_TYPES: RequestType[] = [
  'power_outage',
  'water_supply',
  'waste',
  'road',
  'telecom',
  'other',
];

export const REQUEST_TYPE_META: Record<RequestType, { icon: string; en: string; ar: string }> = {
  power_outage: { icon: 'bolt', en: 'Power outage', ar: 'انقطاع كهرباء' },
  water_supply: { icon: 'water', en: 'Water supply', ar: 'مياه الشرب' },
  waste: { icon: 'trash', en: 'Waste collection', ar: 'القمامة' },
  road: { icon: 'map', en: 'Road damage', ar: 'الطرق' },
  telecom: { icon: 'signal', en: 'Telecom & internet', ar: 'الاتصالات' },
  other: { icon: 'doc', en: 'Other', ar: 'أخرى' },
};

export const REQUEST_STATUSES: RequestStatus[] = [
  'received',
  'dispatched',
  'in_progress',
  'resolved',
  'closed',
];

export const REQUEST_STATUS_META: Record<RequestStatus, { en: string; ar: string }> = {
  received: { en: 'Received', ar: 'تم الاستلام' },
  dispatched: { en: 'Dispatched', ar: 'تم الإرسال' },
  in_progress: { en: 'In progress', ar: 'قيد التنفيذ' },
  resolved: { en: 'Resolved', ar: 'تم الحل' },
  closed: { en: 'Closed', ar: 'مغلق' },
};

export const PRIORITY_META: Record<string, { en: string; ar: string }> = {
  low: { en: 'Low', ar: 'منخفضة' },
  normal: { en: 'Normal', ar: 'عادية' },
  high: { en: 'High', ar: 'عالية' },
  urgent: { en: 'Urgent', ar: 'عاجلة' },
};

export function requestTypeLabel(lang: Lang, type: string): string {
  const meta = REQUEST_TYPE_META[type as RequestType];
  return meta ? pick(lang, meta.en, meta.ar) : type.replace(/_/g, ' ');
}

export function requestStatusLabel(lang: Lang, status: string): string {
  const meta = REQUEST_STATUS_META[status as RequestStatus];
  return meta ? pick(lang, meta.en, meta.ar) : status.replace(/_/g, ' ');
}
