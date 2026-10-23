'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import type { OutageSchedule } from '@/lib/types';

const UTILITY_META: Record<string, { icon: string; en: string; ar: string }> = {
  electricity: { icon: 'bolt', en: 'Electricity', ar: 'الكهرباء' },
  water: { icon: 'water', en: 'Water', ar: 'المياه' },
  telecom: { icon: 'signal', en: 'Telecom', ar: 'الاتصالات' },
};

const DAY_AR: Record<string, string> = {
  monday: 'الاثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
  friday: 'الجمعة',
  saturday: 'السبت',
  sunday: 'الأحد',
  daily: 'يومياً',
};

export function OutageTable({ rows }: { rows: OutageSchedule[] }) {
  const { lang } = useLanguage();

  if (rows.length === 0) {
    return (
      <p className="card px-5 py-8 text-center text-sm text-ink-400">
        {pick(lang, 'No outage schedules found.', 'لا توجد جداول انقطاع.')}
      </p>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[36rem] text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-start text-xs text-ink-400">
            <th className="px-5 py-3 text-start font-medium">
              {pick(lang, 'Municipality', 'البلدية')}
            </th>
            <th className="px-5 py-3 text-start font-medium">{pick(lang, 'Utility', 'المرفق')}</th>
            <th className="px-5 py-3 text-start font-medium">{pick(lang, 'Day', 'اليوم')}</th>
            <th className="px-5 py-3 text-start font-medium">
              {pick(lang, 'Windows', 'فترات الانقطاع')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50">
          {rows.map((o, i) => {
            const u = UTILITY_META[o.utility] ?? {
              icon: 'doc',
              en: o.utility,
              ar: o.utility,
            };
            return (
              <tr key={`${o.region}-${o.municipality}-${o.utility}-${o.day}-${i}`}>
                <td className="px-5 py-3">
                  <span className="block font-medium text-ink-800">{o.municipality}</span>
                  <span className="block text-xs text-ink-400">{o.region}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-ink-700">
                    <Icon name={u.icon} className="h-4 w-4 text-ink-400" />
                    {pick(lang, u.en, u.ar)}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-700">
                  {lang === 'ar' ? (DAY_AR[o.day.toLowerCase()] ?? o.day) : o.day}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {o.windows.map((w, j) => (
                      <span
                        key={j}
                        className="chip bg-ink-50 font-mono text-[11px] text-ink-600 ring-1 ring-ink-100"
                      >
                        {w.from}–{w.to}
                      </span>
                    ))}
                    {o.note ? (
                      <span className="text-xs text-ink-400">{o.note}</span>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
