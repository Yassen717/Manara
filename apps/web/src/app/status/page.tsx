'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, PageHeader, SectionTitle, SkeletonCard } from '@/components/ui';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import { fmtDateTime, timeAgo } from '@/lib/format';
import type { NationalStatus, OutageSchedule } from '@/lib/types';
import { StatusCard } from '@/components/status/StatusCard';
import { OutageTable } from '@/components/status/OutageTable';

export default function StatusPage() {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<NationalStatus | null>(null);
  const [outages, setOutages] = useState<OutageSchedule[] | null>(null);

  useEffect(() => {
    let alive = true;
    api
      .nationalStatus()
      .then((s) => alive && setStatus(s))
      .catch(() => alive && setStatus({ generatedAt: '', services: [] }));
    api
      .outages()
      .then((o) => alive && setOutages(o))
      .catch(() => alive && setOutages([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title={pick(lang, 'National service status', 'حالة الخدمات الوطنية')}
        subtitle={pick(
          lang,
          'Live picture of the rails the country runs on — power, water, fuel, internet and payments.',
          'صورة حية للبنية التي تعمل عليها البلاد — الكهرباء والمياه والوقود والإنترنت والمدفوعات.',
        )}
        badge={<Badge tone="gold">{pick(lang, 'Live', 'مباشر')}</Badge>}
      />
      <div className="container-page space-y-10 py-8">
        {status === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : status.services.length === 0 ? (
          <p className="card px-5 py-8 text-center text-sm text-ink-400">
            {pick(
              lang,
              'Status feed is unavailable right now.',
              'خدمة الحالة غير متاحة حالياً.',
            )}
          </p>
        ) : (
          <section>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {status.services.map((s) => (
                <StatusCard key={s.key} service={s} />
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-400">
              {pick(lang, 'Snapshot generated', 'أُنشئت اللقطة')}{' '}
              {status.generatedAt
                ? `${fmtDateTime(status.generatedAt, lang)} · ${timeAgo(status.generatedAt, lang)}`
                : '—'}
            </p>
          </section>
        )}

        <section>
          <SectionTitle
            title={pick(lang, 'Active outage schedule', 'جدول الانقطاعات الحالي')}
            subtitle={pick(
              lang,
              'Planned load-shedding and supply windows by municipality.',
              'فترات طرح الأحمال وانقطاع الإمداد المخطط لها حسب البلدية.',
            )}
            action={
              <Link href="/utilities" className="link text-sm">
                {pick(lang, 'View all', 'عرض الكل')}
              </Link>
            }
          />
          {outages === null ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <OutageTable rows={outages.slice(0, 6)} />
          )}
        </section>
      </div>
    </>
  );
}
