'use client';

import React, { useState } from 'react';
import { Spinner, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import { fmtDate, fmtMoney } from '@/lib/format';
import type { Entitlement, EntitlementPayment } from '@/lib/types';

const KIND_META: Record<Entitlement['kind'], { icon: string; tint: string }> = {
  salary: { icon: 'briefcase', tint: 'bg-primary-50 text-primary-600' },
  pension: { icon: 'people', tint: 'bg-violet-50 text-violet-600' },
  family_grant: { icon: 'home', tint: 'bg-rose-50 text-rose-600' },
  subsidy_transfer: { icon: 'fuel', tint: 'bg-amber-50 text-amber-600' },
  scholarship: { icon: 'education', tint: 'bg-sky-50 text-sky-600' },
};

const PERIOD: Record<Entitlement['period'], { en: string; ar: string }> = {
  monthly: { en: 'Monthly', ar: 'شهري' },
  quarterly: { en: 'Quarterly', ar: 'ربع سنوي' },
  annual: { en: 'Annual', ar: 'سنوي' },
  one_time: { en: 'One-time', ar: 'لمرة واحدة' },
};

export function EntitlementCard({
  entitlement,
  token,
}: {
  entitlement: Entitlement;
  token: string;
}) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<EntitlementPayment[] | null>(null);

  const meta = KIND_META[entitlement.kind] ?? { icon: 'doc', tint: 'bg-ink-50 text-ink-500' };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && history === null) {
      try {
        setHistory(await api.entitlementHistory(entitlement.id, token));
      } catch {
        setHistory([]);
      }
    }
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={toggle}
        className="flex w-full items-center gap-4 p-5 text-start transition hover:bg-sand-50/60"
        aria-expanded={open}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.tint}`}
        >
          <Icon name={meta.icon} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-ink-900">
            {pick(lang, entitlement.title, entitlement.titleAr)}
          </span>
          <span className="mt-0.5 block text-xs text-ink-500">
            {pick(lang, PERIOD[entitlement.period].en, PERIOD[entitlement.period].ar)} ·{' '}
            {pick(lang, 'next payment', 'الدفعة التالية')}{' '}
            {fmtDate(entitlement.nextPaymentAt, lang)}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="font-bold text-ink-900">
            {fmtMoney(entitlement.amount, entitlement.currency, lang)}
          </span>
          <StatusPill status={entitlement.status} />
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-4 w-4 shrink-0 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div className="border-t border-ink-100 px-5 py-4">
          {history === null ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : history.length === 0 ? (
            <p className="py-2 text-sm text-ink-400">
              {pick(lang, 'No payments recorded yet.', 'لا توجد دفعات مسجلة بعد.')}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-ink-400">
                  <th className="pb-2 text-start font-medium">{pick(lang, 'Date', 'التاريخ')}</th>
                  <th className="pb-2 text-start font-medium">
                    {pick(lang, 'Reference', 'المرجع')}
                  </th>
                  <th className="pb-2 text-end font-medium">{pick(lang, 'Amount', 'المبلغ')}</th>
                  <th className="pb-2 text-end font-medium">{pick(lang, 'Status', 'الحالة')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id} className="border-t border-ink-50">
                    <td className="py-2 text-ink-700">{fmtDate(p.paidAt, lang)}</td>
                    <td className="py-2 font-mono text-xs text-ink-500">{p.reference}</td>
                    <td className="py-2 text-end font-semibold text-ink-900">
                      {fmtMoney(p.amount, entitlement.currency, lang)}
                    </td>
                    <td className="py-2 text-end">
                      <StatusPill status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}
