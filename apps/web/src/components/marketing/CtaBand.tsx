'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';
import { Icon } from '@/components/ui/icons';

export function CtaBand() {
  const { lang, t } = useLanguage();
  return (
    <section className="container-page pb-16 sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 px-6 py-12 text-white shadow-lift animate-fade-up sm:px-12 sm:py-14">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 60% at 88% 15%, rgba(232,167,46,0.22) 0%, transparent 60%), radial-gradient(40% 50% at 5% 100%, rgba(59,182,180,0.18) 0%, transparent 60%)',
          }}
        />
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-white/[0.06]"
          aria-hidden
        >
          <defs>
            <pattern id="cta-arches" width="64" height="92" patternUnits="userSpaceOnUse">
              <path
                d="M9 92V46c0-14 8-27 23-36 15 9 23 22 23 36v46"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-arches)" />
        </svg>

        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              {pick(lang, 'Your documents, your rights — online.', 'مستنداتك وحقوقك — أونلاين.')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-100/85 sm:text-base">
              {pick(
                lang,
                'Create your verified account in minutes and reach every government service from one place — in Arabic or English, with or without a bank queue.',
                'أنشئ حسابك الموثّق في دقائق وصِل إلى كل الخدمات الحكومية من مكان واحد — بالعربية أو الإنجليزية، ودون أي طابور.',
              )}
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold-500 px-7 py-3.5 text-base font-semibold text-ink-950 shadow-lift transition hover:bg-gold-400 active:scale-[.98]"
          >
            {t('nav.getstarted')}
            <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
