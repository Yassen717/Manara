'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate } from '@/lib/format';
import type { Scholarship } from '@/lib/types';
import { StatusPill } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icons';

const STATUS: Record<Scholarship['status'], { en: string; ar: string }> = {
  active: { en: 'Active', ar: 'نشطة' },
  suspended: { en: 'Suspended', ar: 'موقوفة' },
  graduated: { en: 'Graduated', ar: 'متخرج' },
};

function fmtStipend(amount: number, currency: string, lang: 'en' | 'ar') {
  const n = new Intl.NumberFormat(lang === 'ar' ? 'ar-LY' : 'en-LY').format(amount);
  return `${n} ${currency}`;
}

export function ScholarshipCard() {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const [data, setData] = useState<Scholarship | null>(null);
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
      .scholarship(token)
      .then((s) => {
        if (alive) {
          setData(s);
          setFailed(false);
        }
      })
      .catch(() => {
        if (alive) {
          setData(null);
          setFailed(true);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [token, ready]);

  if (!ready || loading) {
    return (
      <div className="max-w-2xl">
        <SkeletonCard />
      </div>
    );
  }

  if (!token) {
    return (
      <EmptyState
        title={pick(lang, 'Sign in to track your scholarship', 'سجّل الدخول لتتبع منحتك')}
        hint={pick(
          lang,
          'Stipend status and payment dates follow your file — no ministry visits.',
          'حالة المنحة ومواعيد الصرف تتبع ملفك — دون زيارة الوزارة.',
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
        title={pick(lang, 'Unable to load scholarship', 'تعذّر تحميل بيانات المنحة')}
        hint={pick(lang, 'Please try again shortly.', 'حاول مرة أخرى بعد قليل.')}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title={pick(lang, 'No scholarship on file', 'لا توجد منحة مسجلة')}
        hint={pick(
          lang,
          'If you are awarded a study-abroad scholarship it will appear here with live payment tracking.',
          'إذا حصلت على منحة دراسية بالخارج ستظهر هنا مع تتبع مباشر للمدفوعات.',
        )}
      />
    );
  }

  const delayed = !!data.nextPaymentAt && new Date(data.nextPaymentAt).getTime() < Date.now();

  return (
    <div className="card max-w-2xl overflow-hidden">
      <div className="border-b border-ink-100 bg-primary-50/50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-700 shadow-card">
              <Icon name="globe" className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-ink-900">{data.university}</p>
              <p className="text-sm text-ink-500">{data.country}</p>
            </div>
          </div>
          <StatusPill status={data.status} label={pick(lang, STATUS[data.status].en, STATUS[data.status].ar)} />
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {pick(lang, 'Program', 'البرنامج')}
          </p>
          <p className="mt-0.5 font-semibold text-ink-800">
            {data.degree} — {data.program}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {pick(lang, 'Monthly stipend', 'المنحة الشهرية')}
          </p>
          <p className="mt-0.5 font-semibold text-ink-800" dir="ltr">
            {fmtStipend(data.stipendAmount, data.currency, lang)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {pick(lang, 'Last payment', 'آخر دفعة')}
          </p>
          <p className="mt-0.5 font-semibold text-ink-800">{fmtDate(data.lastPaymentAt, lang)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {pick(lang, 'Next payment', 'الدفعة القادمة')}
          </p>
          <p className="mt-0.5 font-semibold text-ink-800">{fmtDate(data.nextPaymentAt, lang)}</p>
        </div>
      </div>
      {delayed ? (
        <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Icon name="warn" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-bold text-amber-800">
              {pick(lang, 'Payment delayed', 'تأخر صرف الدفعة')}
            </p>
            <p className="text-sm text-amber-700">
              {pick(
                lang,
                'Tracked automatically — the delay is logged against the ministry, no office visit needed.',
                'يتم تتبعها تلقائيًا — التأخير مسجّل على الوزارة، ولا حاجة لزيارة أي مكتب.',
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
