'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { fmtDateTime, statusTone, timeAgo } from '@/lib/format';

const dotBg = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-sky-500',
  gray: 'bg-ink-400',
} as const;

// Generic vertical timeline for { status, at, note }[] items — used by
// applications cards and request detail pages.
export function StatusTimeline({
  items,
  labelOf,
  time = 'datetime',
}: {
  items: { status: string; at: string; note: string }[];
  labelOf?: (status: string) => string;
  time?: 'ago' | 'datetime';
}) {
  const { lang } = useLanguage();
  if (!items.length) return null;
  return (
    <ol className="space-y-0">
      {items.map((it, i) => (
        <li key={`${it.status}-${it.at}-${i}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white ${dotBg[statusTone(it.status)]}`}
            />
            {i < items.length - 1 ? <span className="w-px flex-1 bg-ink-100" /> : null}
          </div>
          <div className={i < items.length - 1 ? 'pb-5' : ''}>
            <p className="text-sm font-semibold text-ink-800">
              {labelOf ? labelOf(it.status) : it.status.replace(/_/g, ' ')}
            </p>
            {it.note ? <p className="mt-0.5 text-sm text-ink-500">{it.note}</p> : null}
            <p className="mt-0.5 text-xs text-ink-400">
              {time === 'ago' ? timeAgo(it.at, lang) : fmtDateTime(it.at, lang)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
