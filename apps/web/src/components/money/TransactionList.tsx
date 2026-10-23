'use client';

import React, { useMemo } from 'react';
import { Badge } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate, fmtMoney, timeAgo } from '@/lib/format';
import type { Transaction } from '@/lib/types';

// Bilingual labels for the seeded ledger categories; unknown categories
// fall back to the raw API string humanized.
const CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  cash_withdrawal: { en: 'Cash withdrawal', ar: 'سحب نقدي' },
  subsidy_transfer: { en: 'Subsidy transfer', ar: 'تحويل دعم' },
  bill_payment: { en: 'Bill payment', ar: 'دفع فاتورة' },
  salary: { en: 'Salary', ar: 'راتب' },
  education: { en: 'Education', ar: 'تعليم' },
  transfer: { en: 'Transfer', ar: 'تحويل' },
  family_grant: { en: 'Family grant', ar: 'منحة عائلية' },
  health: { en: 'Health', ar: 'صحة' },
  top_up: { en: 'Top-up', ar: 'شحن محفظة' },
  telecom: { en: 'Telecom', ar: 'اتصالات' },
  groceries: { en: 'Groceries', ar: 'مشتريات' },
};

// Transactions grouped by calendar day, newest day first.
export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const { lang } = useLanguage();

  const groups = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    for (const tx of transactions) {
      const key = (tx.at ?? '').slice(0, 10) || 'unknown';
      const bucket = map.get(key);
      if (bucket) bucket.push(tx);
      else map.set(key, [tx]);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  return (
    <div className="space-y-6">
      {groups.map(([day, txs]) => (
        <section key={day}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            {day === 'unknown' ? '—' : fmtDate(`${day}T00:00:00`, lang)}
          </h3>
          <div className="card divide-y divide-ink-50">
            {txs.map((tx) => {
              const credit = tx.type === 'credit';
              const cat = CATEGORY_LABELS[tx.category];
              return (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      credit ? 'bg-emerald-50 text-emerald-600' : 'bg-ink-50 text-ink-500'
                    }`}
                  >
                    {credit ? (
                      <Icon name="plus" className="h-4 w-4" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M5 12h14" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {pick(lang, tx.description, tx.descriptionAr)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge tone="gray">
                        {cat ? pick(lang, cat.en, cat.ar) : tx.category.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-ink-400">{timeAgo(tx.at, lang)}</span>
                    </div>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-bold ${
                      credit ? 'text-emerald-600' : 'text-ink-900'
                    }`}
                  >
                    {credit ? '+' : '−'}
                    {fmtMoney(tx.amount, tx.currency, lang)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
