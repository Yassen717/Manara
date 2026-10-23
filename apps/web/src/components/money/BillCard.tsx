'use client';

import React from 'react';
import { Button, Spinner, StatusPill } from '@/components/ui';
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

const BILL_STATUS: Record<Bill['status'], { en: string; ar: string }> = {
  due: { en: 'Due', ar: 'مستحقة' },
  paid: { en: 'Paid', ar: 'مدفوعة' },
  overdue: { en: 'Overdue', ar: 'متأخرة' },
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
        <StatusPill
          status={bill.status}
          label={pick(lang, BILL_STATUS[bill.status].en, BILL_STATUS[bill.status].ar)}
        />
      </div>
      <Button
        size="sm"
        variant={paid ? 'secondary' : 'primary'}
        disabled={paid || paying}
        onClick={() => onPay(bill.id)}
      >
        {paying ? <Spinner className="h-4 w-4 !text-white" /> : null}
        {paid ? pick(lang, 'Paid', 'مدفوعة') : pick(lang, 'Pay', 'ادفع')}
      </Button>
    </div>
  );
}
