'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate, fmtMoney } from '@/lib/format';
import type { Entitlement } from '@/lib/types';
import { Card, EmptyState, StatusPill } from '@/components/ui';
import { Panel, PanelSkeleton } from './Panel';
import { statusLabel } from './labels';

const periodLabel = (lang: 'en' | 'ar', p: Entitlement['period']) =>
  pick(lang,
    { monthly: 'monthly', quarterly: 'quarterly', annual: 'annual', one_time: 'one-time' }[p],
    { monthly: 'شهري', quarterly: 'ربع سنوي', annual: 'سنوي', one_time: 'لمرة واحدة' }[p],
  );

export function EntitlementsPanel({
  entitlements,
  loading,
}: {
  entitlements: Entitlement[];
  loading: boolean;
}) {
  const { lang } = useLanguage();

  return (
    <Panel title={pick(lang, 'Entitlements', 'الاستحقاقات')}>
      {loading ? (
        <PanelSkeleton />
      ) : entitlements.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No entitlements', 'لا توجد استحقاقات')}
          hint={pick(
            lang,
            'Salaries, grants and subsidies you qualify for will appear here.',
            'الرواتب والمنح والإعانات المستحقة لك ستظهر هنا.',
          )}
        />
      ) : (
        <Card className="divide-y divide-ink-100">
          {entitlements.slice(0, 4).map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-800">
                  {pick(lang, e.title, e.titleAr)}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">
                  {periodLabel(lang, e.period)} · {pick(lang, 'next', 'القادم')}{' '}
                  {fmtDate(e.nextPaymentAt, lang)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="text-sm font-bold text-ink-900" dir="ltr">
                  {fmtMoney(e.amount, e.currency, lang)}
                </span>
                <StatusPill status={e.status} label={statusLabel(lang, e.status)} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </Panel>
  );
}
