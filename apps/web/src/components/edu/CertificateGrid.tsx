'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate } from '@/lib/format';
import type { Certificate } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

const TYPE_LABELS: Record<Certificate['type'], { en: string; ar: string }> = {
  secondary: { en: 'Secondary', ar: 'ثانوية' },
  bachelor: { en: 'Bachelor', ar: 'بكالوريوس' },
  master: { en: 'Master', ar: 'ماجستير' },
  phd: { en: 'PhD', ar: 'دكتوراه' },
  vocational: { en: 'Vocational', ar: 'مهني' },
};

function Seal() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12 text-gold-500" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path
        d="m24 15 2.3 5 5.4.5-4.1 3.6 1.2 5.3-4.8-2.8-4.8 2.8 1.2-5.3-4.1-3.6 5.4-.5z"
        fill="currentColor"
      />
      <path d="m14 40-2 6 6-2M34 40l2 6-6-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

export function CertificateGrid() {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const [rows, setRows] = useState<Certificate[]>([]);
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
      .certificates(token)
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
  }, [token, ready]);

  if (!ready || loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!token) {
    return (
      <EmptyState
        title={pick(lang, 'Sign in to view your certificates', 'سجّل الدخول لعرض شهاداتك')}
        hint={pick(
          lang,
          'Verified e-certificates are issued to your Manara identity — re-downloadable anywhere, even if the paper is lost.',
          'الشهادات الإلكترونية الموثقة تصدر لهويتك في منارة — ويمكن إعادة تحميلها من أي مكان حتى لو فقدت الورقة.',
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
        title={pick(lang, 'Unable to load certificates', 'تعذّر تحميل الشهادات')}
        hint={pick(lang, 'Please try again shortly.', 'حاول مرة أخرى بعد قليل.')}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={pick(lang, 'No certificates issued yet', 'لا توجد شهادات صادرة بعد')}
        hint={pick(
          lang,
          'When an institution issues you a certificate it appears here automatically.',
          'عندما تصدر لك مؤسسة تعليمية شهادة ستظهر هنا تلقائيًا.',
        )}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((c) => (
        <div
          key={c.id}
          className="relative overflow-hidden rounded-2xl border-2 border-gold-400/60 bg-gradient-to-br from-white to-sand-50 p-5 shadow-card"
        >
          <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-gold-400/40" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <Badge tone="gold">{pick(lang, TYPE_LABELS[c.type].en, TYPE_LABELS[c.type].ar)}</Badge>
              <Seal />
            </div>
            <h3 className="mt-2 font-bold leading-snug text-ink-900">
              {pick(lang, c.title, c.titleAr)}
            </h3>
            <p className="text-sm text-ink-500">{pick(lang, c.titleAr, c.title)}</p>
            <p className="mt-2 text-sm font-semibold text-ink-700">{c.institution}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gold-400/30 pt-3 text-xs">
              <span className="font-semibold text-ink-600">
                {pick(lang, 'Issued', 'صادرة في')} {fmtDate(c.issuedAt, lang)}
              </span>
              <span className="font-mono text-ink-500" dir="ltr">
                {c.reference}
              </span>
            </div>
            {c.grade ? (
              <p className="mt-1 text-xs font-semibold text-primary-700">
                {pick(lang, 'Grade', 'التقدير')}: {c.grade}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
