'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { StatusPill } from '@/components/ui';
import type { CitizenProfile } from '@/lib/types';
import { statusLabel } from './labels';

export function GreetingHeader({ citizen }: { citizen: CitizenProfile }) {
  const { lang } = useLanguage();
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? pick(lang, 'Sabah alkheir', 'صباح الخير')
      : pick(lang, 'Masa alkheir', 'مساء الخير');
  const name = pick(lang, citizen.firstName, citizen.firstNameAr);
  const today = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LY' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          {greeting}, {name}
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">{today}</p>
      </div>
      <StatusPill status={citizen.ekycStatus} label={statusLabel(lang, citizen.ekycStatus)} />
    </header>
  );
}
