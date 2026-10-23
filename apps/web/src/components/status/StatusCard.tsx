'use client';

import React from 'react';
import { StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { timeAgo } from '@/lib/format';
import type { NationalStatusService } from '@/lib/types';

const KEY_META: Record<string, { icon: string; en: string; ar: string }> = {
  power: { icon: 'bolt', en: 'Power', ar: 'الكهرباء' },
  water: { icon: 'water', en: 'Water', ar: 'المياه' },
  fuel: { icon: 'fuel', en: 'Fuel', ar: 'الوقود' },
  internet: { icon: 'signal', en: 'Internet', ar: 'الإنترنت' },
  payments: { icon: 'card', en: 'Payments', ar: 'المدفوعات' },
};

const TONE: Record<string, { box: string; icon: string; label: { en: string; ar: string } }> = {
  operational: {
    box: 'border-emerald-200 bg-emerald-50/60',
    icon: 'bg-emerald-100 text-emerald-700',
    label: { en: 'Operational', ar: 'تعمل' },
  },
  degraded: {
    box: 'border-amber-200 bg-amber-50/60',
    icon: 'bg-amber-100 text-amber-700',
    label: { en: 'Degraded', ar: 'متأثرة جزئياً' },
  },
  outage: {
    box: 'border-red-200 bg-red-50/60',
    icon: 'bg-red-100 text-red-700',
    label: { en: 'Outage', ar: 'متوقفة' },
  },
};

export function StatusCard({ service }: { service: NationalStatusService }) {
  const { lang } = useLanguage();
  const meta = KEY_META[service.key] ?? { icon: 'signal', en: service.key, ar: service.key };
  const tone = TONE[service.status] ?? {
    box: '',
    icon: 'bg-ink-100 text-ink-600',
    label: { en: service.status, ar: service.status },
  };

  return (
    <div className={`card p-5 ${tone.box}`}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.icon}`}
        >
          <Icon name={meta.icon} className="h-5 w-5" />
        </span>
        <StatusPill status={service.status} label={pick(lang, tone.label.en, tone.label.ar)} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
        {pick(lang, meta.en, meta.ar)}
      </p>
      <p className="mt-1 font-bold leading-snug text-ink-900">{service.headline}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{service.detail}</p>
      <p className="mt-4 text-xs text-ink-400">
        {pick(lang, 'Updated', 'آخر تحديث')} {timeAgo(service.updatedAt, lang)}
      </p>
    </div>
  );
}
