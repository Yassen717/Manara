import type { Lang } from '@/lib/i18n';

// Bilingual labels for status enums shown on the dashboard.
const labels: Record<string, { en: string; ar: string }> = {
  submitted: { en: 'Submitted', ar: 'مُقدَّم' },
  in_review: { en: 'Under review', ar: 'قيد المراجعة' },
  approved: { en: 'Approved', ar: 'مقبول' },
  rejected: { en: 'Rejected', ar: 'مرفوض' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  received: { en: 'Received', ar: 'مستلم' },
  dispatched: { en: 'Dispatched', ar: 'تم الإرسال' },
  in_progress: { en: 'In progress', ar: 'قيد التنفيذ' },
  resolved: { en: 'Resolved', ar: 'تم الحل' },
  closed: { en: 'Closed', ar: 'مغلق' },
  verified: { en: 'eKYC verified', ar: 'هوية موثَّقة' },
  pending: { en: 'eKYC pending', ar: 'التوثيق قيد الانتظار' },
  unverified: { en: 'eKYC unverified', ar: 'هوية غير موثَّقة' },
  active: { en: 'Active', ar: 'نشط' },
  paused: { en: 'Paused', ar: 'موقوف' },
  expired: { en: 'Expired', ar: 'منتهي' },
  revoked: { en: 'Revoked', ar: 'ملغي' },
  info: { en: 'Info', ar: 'معلومة' },
  success: { en: 'Success', ar: 'نجاح' },
  warning: { en: 'Warning', ar: 'تحذير' },
  alert: { en: 'Alert', ar: 'تنبيه' },
};

export function statusLabel(lang: Lang, status: string): string {
  return labels[status]?.[lang] ?? status.replace(/_/g, ' ');
}
