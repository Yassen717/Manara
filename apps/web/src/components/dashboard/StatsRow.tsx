'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { Skeleton, Stat } from '@/components/ui';

export function StatsRow({
  loading,
  openApplications,
  openRequests,
  documents,
  unreadNotifications,
}: {
  loading: boolean;
  openApplications: number;
  openRequests: number;
  documents: number;
  unreadNotifications: number;
}) {
  const { lang } = useLanguage();

  const stats = [
    { value: openApplications, label: pick(lang, 'Open applications', 'طلبات خدمات مفتوحة'), accent: true },
    { value: openRequests, label: pick(lang, 'Open requests', 'بلاغات مفتوحة') },
    { value: documents, label: pick(lang, 'Documents held', 'مستندات محفوظة') },
    { value: unreadNotifications, label: pick(lang, 'Unread notifications', 'إشعارات غير مقروءة') },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) =>
        loading ? (
          <div key={s.label} className="card p-5">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        ) : (
          <Stat key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ),
      )}
    </div>
  );
}
