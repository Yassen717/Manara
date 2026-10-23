'use client';

import React from 'react';
import { Button, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate, fmtMoney } from '@/lib/format';
import type { Bill } from '@/lib/types';

const UTILITY_META: Record<Bill['utility'], { icon: string; tint: string; en: string; ar: string }> =
  {
    electricity: { icon: 'bolt', tint: 'bg-amber-50 text-amber-600', en: 'Electricity', ar: 'الكهرباء' },
    water: { icon: 'water', tint: 'bg-sky-50 text-sky-600', en: 'Water', ar: 'المياه' },
    telecom: { icon: 'signal', tint: 'bg-violet-50 text-violet-600', en: 'Telecom', ar: 'الاتصالات' },
    gas: { icon: 'fuel', tint: 'bg-rose-50 text-rose-600', en: 'Gas', ar: 'الغاز' },
  };

export function BillCard({
  bill,
  paying,
  onPay,
}: {
  bill: Bill;
  paying: boolean;
  onPay: (id: string) => void;
}) {
  const { lang } = useLanguage();
  const u = UTILITY_META[bill.utility] ?? {
    icon: 'doc',
    tint: 'bg-ink-50 text-ink-500',
    en: bill.utility,
    ar: bill.utility,
  };
  const paid = bill.status === 'paid';

  return (
    <div className="card flex flex-wrap items-center gap-4 p-5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${u.tint}`}
      >
        <Icon name={u.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink-900">{pick(lang, u.en, u.ar)}</p>
        <p className="mt-0.5 text-xs text-ink-500">
          {bill.period} · {pick(lang, 'due', 'الاستحقاق')} {fmtDate(bill.dueAt, lang)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <p className="font-bold text-ink-900">{fmtMoney(bill.amount, bill.currency, lang)}</p>
        <StatusPill status={bill.status} />
      </div>
      <Button
        size="sm"
        variant={paid ? 'secondary' : 'primary'}
        disabled={paid || paying}
        onClick={() => onPay(bill.id)}
      >
        {paying ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        ) : null}
        {paid ? pick(lang, 'Paid', 'مدفوعة') : pick(lang, 'Pay', 'ادفع')}
      </Button>
    </div>
  );
}
