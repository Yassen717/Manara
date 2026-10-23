'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney, timeAgo } from '@/lib/format';
import type { Transaction } from '@/lib/types';
import { Card, EmptyState } from '@/components/ui';
import { Panel, PanelSkeleton } from './Panel';

export function TransactionsPanel({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) {
  const { lang, t } = useLanguage();

  return (
    <Panel
      title={pick(lang, 'Latest transactions', 'أحدث المعاملات')}
      action={
        <Link href="/wallet" className="link text-xs">
          {t('common.viewAll')}
        </Link>
      }
    >
      {loading ? (
        <PanelSkeleton rows={5} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No transactions yet', 'لا توجد معاملات بعد')}
          hint={pick(
            lang,
            'Payments and deposits will show up here.',
            'المدفوعات والإيداعات ستظهر هنا.',
          )}
        />
      ) : (
        <Card className="divide-y divide-ink-100">
          {transactions.slice(0, 5).map((tx) => {
            const credit = tx.type === 'credit';
            return (
              <div key={tx.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-800">
                    {pick(lang, tx.description, tx.descriptionAr)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">{timeAgo(tx.at, lang)}</p>
                </div>
                <span
                  dir="ltr"
                  className={`shrink-0 text-sm font-bold ${
                    credit ? 'text-emerald-600' : 'text-ink-800'
                  }`}
                >
                  {credit ? '+' : '−'}
                  {fmtMoney(tx.amount, tx.currency, lang)}
                </span>
              </div>
            );
          })}
        </Card>
      )}
    </Panel>
  );
}
