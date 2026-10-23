// Shared formatting helpers (dates, money, status labels).

export function fmtDate(iso: string | undefined, lang: 'en' | 'ar' = 'en'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LY' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function fmtDateTime(iso: string | undefined, lang: 'en' | 'ar' = 'en'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LY' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function fmtMoney(amount: number, currency = 'LYD', lang: 'en' | 'ar' = 'en'): string {
  const n = new Intl.NumberFormat(lang === 'ar' ? 'ar-LY' : 'en-LY', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return lang === 'ar' ? `${n} د.ل` : `${n} ${currency}`;
}

export function timeAgo(iso: string, lang: 'en' | 'ar' = 'en'): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(lang === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  if (s < 60) return rtf.format(-s, 'second');
  if (s < 3600) return rtf.format(-Math.floor(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.floor(s / 3600), 'hour');
  return rtf.format(-Math.floor(s / 86400), 'day');
}

// Map a status enum to a visual tone understood by StatusPill.
export function statusTone(status: string): 'green' | 'amber' | 'red' | 'blue' | 'gray' {
  switch (status) {
    case 'active':
    case 'operational':
    case 'verified':
    case 'approved':
    case 'completed':
    case 'resolved':
    case 'paid':
    case 'open':
    case 'in_stock':
    case 'success':
    case 'confirmed':
    case 'booked':
      return 'green';
    case 'pending':
    case 'degraded':
    case 'in_review':
    case 'in_progress':
    case 'dispatched':
    case 'due':
    case 'limited':
    case 'low':
    case 'warning':
    case 'scheduled':
    case 'received':
      return 'amber';
    case 'rejected':
    case 'revoked':
    case 'outage':
    case 'out':
    case 'overdue':
    case 'closed':
    case 'alert':
    case 'urgent':
    case 'suspended':
    case 'unverified':
      return 'red';
    case 'submitted':
    case 'info':
    case 'expired':
      return 'blue';
    default:
      return 'gray';
  }
}
