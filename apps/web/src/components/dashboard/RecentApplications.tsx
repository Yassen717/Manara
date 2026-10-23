'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';
import { timeAgo } from '@/lib/format';
import type { Application } from '@/lib/types';
import { Card, EmptyState, StatusPill } from '@/components/ui';
import { Panel, PanelSkeleton } from './Panel';
import { statusLabel } from './labels';

export function RecentApplications({
  applications,
  loading,
}: {
  applications: Application[];
  loading: boolean;
}) {
  const { lang, t } = useLanguage();

  return (
    <Panel
      title={pick(lang, 'Recent applications', 'أحدث الطلبات')}
      action={
        <Link href="/applications" className="link text-xs">
          {t('common.viewAll')}
        </Link>
      }
    >
      {loading ? (
        <PanelSkeleton />
      ) : applications.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No applications yet', 'لا توجد طلبات بعد')}
          hint={pick(
            lang,
            'Apply for a service and it will show up here.',
            'قدّم على خدمة وستظهر هنا.',
          )}
          action={
            <Link href="/services" className="btn-primary !px-4 !py-2 text-xs">
              {pick(lang, 'Browse services', 'تصفح الخدمات')}
            </Link>
          }
        />
      ) : (
        <Card className="divide-y divide-ink-100">
          {applications.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href="/applications"
              className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-sand-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-800">
                  {pick(lang, a.serviceName, a.serviceNameAr)}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">
                  <span dir="ltr">{a.reference}</span> · {timeAgo(a.submittedAt, lang)}
                </p>
              </div>
              <StatusPill status={a.status} label={statusLabel(lang, a.status)} />
            </Link>
          ))}
        </Card>
      )}
    </Panel>
  );
}
