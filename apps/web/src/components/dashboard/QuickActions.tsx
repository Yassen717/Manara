'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';
import { Icon } from '@/components/ui/icons';

const tiles = [
  {
    href: '/services',
    icon: 'briefcase',
    en: 'Browse services',
    ar: 'تصفح الخدمات',
    subEn: 'Apply for documents & IDs',
    subAr: 'قدّم على مستندات وبطاقات',
    tint: 'bg-primary-50 text-primary-600',
  },
  {
    href: '/requests/new',
    icon: 'plus',
    en: 'New request',
    ar: 'بلاغ جديد',
    subEn: 'Report an outage or issue',
    subAr: 'أبلغ عن انقطاع أو مشكلة',
    tint: 'bg-gold-300/30 text-gold-700',
  },
  {
    href: '/utilities',
    icon: 'bolt',
    en: 'Utilities',
    ar: 'المرافق',
    subEn: 'Bills & outage schedules',
    subAr: 'الفواتير وجداول الانقطاع',
    tint: 'bg-amber-50 text-amber-600',
  },
  {
    href: '/health',
    icon: 'health',
    en: 'Health',
    ar: 'الصحة',
    subEn: 'Facilities & appointments',
    subAr: 'المرافق والمواعيد',
    tint: 'bg-rose-50 text-rose-600',
  },
];

export function QuickActions() {
  const { lang } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="card group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.tint} transition group-hover:scale-105`}
          >
            <Icon name={t.icon} className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink-900">{pick(lang, t.en, t.ar)}</span>
            <span className="mt-0.5 block text-xs text-ink-500">{pick(lang, t.subEn, t.subAr)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
