'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick } from '@/lib/i18n';

// Centered split card for /login and /register: brand panel on the side
// (hidden on mobile), form content on the other.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { lang, t } = useLanguage();

  const bullets = [
    pick(lang, 'One account for every ministry', 'حساب واحد لكل الوزارات'),
    pick(lang, 'Apply, pay and track online', 'قدّم وادفع وتتبّع إلكترونيًا'),
    pick(lang, 'Bilingual — English and Arabic', 'ثنائية اللغة — العربية والإنجليزية'),
  ];

  return (
    <div className="container-page flex items-center justify-center py-10 sm:py-16">
      <div className="card grid w-full max-w-4xl overflow-hidden md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-primary-950 p-10 text-white md:flex">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-gold-500/20" />
          <div className="pointer-events-none absolute bottom-24 left-10 h-24 w-24 rounded-full bg-white/5" />

          <Link href="/" className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
                <path d="M12 3 4.5 20h15L12 3z" strokeLinejoin="round" />
                <path d="M12 3v17M7.5 14h9" strokeLinecap="round" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight">Manara</span>
              <span className="block text-xs font-semibold text-primary-100">منارة · {t('brand.tagline')}</span>
            </span>
          </Link>

          <div className="relative">
            <h2 className="text-2xl font-bold leading-snug">
              {pick(lang, 'Public services, without the queue.', 'خدمات حكومية بلا طوابير.')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-100">
              {pick(
                lang,
                'Documents, payments, utilities and health — one secure account for every Libyan citizen.',
                'المستندات والمدفوعات والمرافق والصحة — حساب واحد آمن لكل مواطن ليبي.',
              )}
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm font-medium text-primary-50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5">
                      <path d="m4.5 12.5 5 5L19.5 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative text-xs text-primary-200">
            {pick(lang, 'Government-as-a-Service concept platform', 'منصة مفهوم الحكومة كخدمة')}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
          {footer ? <div className="mt-7 border-t border-ink-100 pt-5 text-sm text-ink-500">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
