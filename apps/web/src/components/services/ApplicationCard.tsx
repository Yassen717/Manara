'use client';

import React, { useState } from 'react';
import type { Application, ApplicationStatus } from '@/lib/types';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate } from '@/lib/format';
import { Card, StatusPill } from '@/components/ui';
import { StatusTimeline } from '@/components/requests/StatusTimeline';

export const APPLICATION_STATUS_META: Record<ApplicationStatus, { en: string; ar: string }> = {
  submitted: { en: 'Submitted', ar: 'مُقدَّم' },
  in_review: { en: 'In review', ar: 'قيد المراجعة' },
  approved: { en: 'Approved', ar: 'مقبول' },
  rejected: { en: 'Rejected', ar: 'مرفوض' },
  completed: { en: 'Completed', ar: 'مكتمل' },
};

export function applicationStatusLabel(lang: 'en' | 'ar', status: string): string {
  const meta = APPLICATION_STATUS_META[status as ApplicationStatus];
  return meta ? pick(lang, meta.en, meta.ar) : status.replace(/_/g, ' ');
}

export function ApplicationCard({ application }: { application: Application }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const altName = lang === 'ar' ? application.serviceName : application.serviceNameAr;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-ink-900">
            {pick(lang, application.serviceName, application.serviceNameAr)}
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">{altName}</p>
          <p className="mt-1 text-xs text-ink-400">
            <span className="font-mono">{application.reference}</span> ·{' '}
            {fmtDate(application.submittedAt, lang)}
          </p>
        </div>
        <StatusPill
          status={application.status}
          label={applicationStatusLabel(lang, application.status)}
        />
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        aria-expanded={open}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        {open ? pick(lang, 'Hide timeline', 'إخفاء المتابعة') : pick(lang, 'Show timeline', 'عرض المتابعة')}
      </button>
      {open ? (
        <div className="mt-4 border-t border-ink-100 pt-4">
          <StatusTimeline
            items={application.timeline}
            labelOf={(s) => applicationStatusLabel(lang, s)}
          />
        </div>
      ) : null}
    </Card>
  );
}
