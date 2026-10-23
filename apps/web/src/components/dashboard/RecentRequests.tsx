'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';
import { timeAgo } from '@/lib/format';
import type { ServiceRequest } from '@/lib/types';
import { Card, EmptyState, StatusPill } from '@/components/ui';
import { Panel, PanelSkeleton } from './Panel';
import { statusLabel } from './labels';

export function RecentRequests({
  requests,
  loading,
}: {
  requests: ServiceRequest[];
  loading: boolean;
}) {
  const { lang, t } = useLanguage();

  return (
    <Panel
      title={pick(lang, 'Recent requests', 'أحدث البلاغات')}
      action={
        <Link href="/requests" className="link text-xs">
          {t('common.viewAll')}
        </Link>
      }
    >
      {loading ? (
        <PanelSkeleton />
      ) : requests.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No requests yet', 'لا توجد بلاغات بعد')}
          hint={pick(
            lang,
            'Report an outage, road or waste issue and track it here.',
            'أبلغ عن انقطاع أو مشكلة طريق أو نفايات وتتبعها هنا.',
          )}
          action={
            <Link href="/requests/new" className="btn-primary !px-4 !py-2 text-xs">
              {pick(lang, 'New request', 'بلاغ جديد')}
            </Link>
          }
        />
      ) : (
        <Card className="divide-y divide-ink-100">
          {requests.slice(0, 3).map((r) => (
            <Link
              key={r.id}
              href={`/requests/${r.id}`}
              className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-sand-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-800">{r.title}</p>
                <p className="mt-0.5 text-xs text-ink-400">
                  {r.municipality} · {timeAgo(r.createdAt, lang)}
                </p>
              </div>
              <StatusPill status={r.status} label={statusLabel(lang, r.status)} />
            </Link>
          ))}
        </Card>
      )}
    </Panel>
  );
}
