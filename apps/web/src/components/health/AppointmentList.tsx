'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDateTime } from '@/lib/format';
import type { Appointment } from '@/lib/types';
import { StatusPill } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icons';

const STATUS: Record<Appointment['status'], { en: string; ar: string }> = {
  booked: { en: 'Booked', ar: 'محجوز' },
  confirmed: { en: 'Confirmed', ar: 'مؤكد' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },
};

export function AppointmentList({ refreshKey = 0 }: { refreshKey?: number }) {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    api
      .appointments(token)
      .then((data) => {
        if (alive) {
          setRows(data);
          setFailed(false);
        }
      })
      .catch(() => {
        if (alive) {
          setRows([]);
          setFailed(true);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [token, ready, refreshKey]);

  if (!ready || loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!token) {
    return (
      <EmptyState
        title={pick(lang, 'Sign in to see your appointments', 'سجّل الدخول لعرض مواعيدك')}
        hint={pick(
          lang,
          'Your bookings are tied to your verified Manara identity.',
          'مواعيدك مرتبطة بهويتك الموثّقة في منارة.',
        )}
        action={
          <Link href="/login" className="btn-primary">
            {pick(lang, 'Sign in', 'تسجيل الدخول')}
          </Link>
        }
      />
    );
  }

  if (failed) {
    return (
      <EmptyState
        title={pick(lang, 'Unable to load appointments', 'تعذّر تحميل المواعيد')}
        hint={pick(lang, 'Please try again shortly.', 'حاول مرة أخرى بعد قليل.')}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={pick(lang, 'No appointments yet', 'لا توجد مواعيد بعد')}
        hint={pick(
          lang,
          'Book from the Facilities tab — no queue, no waiting at dawn.',
          'احجز من تبويب المرافق — بلا طوابير ولا انتظار فجرًا.',
        )}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {rows.map((a) => (
        <div key={a.id} className="card flex flex-wrap items-center gap-4 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Icon name="clock" className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink-900">{a.facilityName}</p>
            <p className="text-sm text-ink-500">
              {a.department} · {fmtDateTime(a.scheduledFor, lang)}
            </p>
          </div>
          <div className="text-end">
            <p className="font-mono text-xs font-semibold text-ink-500" dir="ltr">
              {a.reference}
            </p>
            <div className="mt-1">
              <StatusPill status={a.status} label={pick(lang, STATUS[a.status].en, STATUS[a.status].ar)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
