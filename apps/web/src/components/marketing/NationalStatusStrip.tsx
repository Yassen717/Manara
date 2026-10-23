'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import { timeAgo } from '@/lib/format';
import type { NationalStatus, NationalStatusService } from '@/lib/types';
import { Skeleton, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const SERVICE_META: Record<NationalStatusService['key'], { icon: string; en: string; ar: string }> = {
  power: { icon: 'bolt', en: 'Power', ar: 'الكهرباء' },
  water: { icon: 'water', en: 'Water', ar: 'المياه' },
  fuel: { icon: 'fuel', en: 'Fuel', ar: 'الوقود' },
  internet: { icon: 'signal', en: 'Internet', ar: 'الإنترنت' },
  payments: { icon: 'wallet', en: 'Payments', ar: 'المدفوعات' },
};

// Same wording as the /status page cards.
const STATUS_LABEL: Record<NationalStatusService['status'], { en: string; ar: string }> = {
  operational: { en: 'Operational', ar: 'تعمل' },
  degraded: { en: 'Degraded', ar: 'متأثرة جزئياً' },
  outage: { en: 'Outage', ar: 'متوقفة' },
};

export function NationalStatusStrip() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<NationalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .nationalStatus()
      .then((d) => alive && setData(d))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return null;

  return (
    <section className="container-page pt-10">
      <div className="card animate-fade-up p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 pe-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-bold text-ink-800">
              {pick(lang, 'National services — live', 'حالة الخدمات الوطنية — مباشر')}
            </span>
          </div>

          <div className="scroll-slim flex flex-1 items-center gap-2 overflow-x-auto py-0.5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-40 shrink-0 rounded-full" />
                ))
              : (data?.services ?? []).map((s) => {
                  const meta = SERVICE_META[s.key] ?? { icon: 'signal', en: s.key, ar: s.key };
                  const statusLabel = STATUS_LABEL[s.status] ?? { en: s.status, ar: s.status };
                  return (
                    <span
                      key={s.key}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink-100 bg-sand-50/70 py-1.5 pe-3 ps-2.5"
                      title={s.detail}
                    >
                      <Icon name={meta.icon} className="h-4 w-4 text-ink-500" />
                      <span className="text-xs font-bold text-ink-700">
                        {pick(lang, meta.en, meta.ar)}
                      </span>
                      <StatusPill
                        status={s.status}
                        label={pick(lang, statusLabel.en, statusLabel.ar)}
                      />
                      <span className="text-[10px] font-medium text-ink-400" dir="auto">
                        {timeAgo(s.updatedAt, lang)}
                      </span>
                    </span>
                  );
                })}
          </div>

          <Link
            href="/status"
            className="ms-auto inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline"
          >
            {t('common.viewAll')}
            <Icon name="arrow" className="h-3.5 w-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
