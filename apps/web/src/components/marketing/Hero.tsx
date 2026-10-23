'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage, pick, type Lang } from '@/lib/i18n';
import { Stat, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const HERO_STATS: { v: [string, string]; l: [string, string] }[] = [
  { v: ['99', '٩٩'], l: ['documented problems mapped', 'مشكلة موثّقة وُضعت لها حلول'] },
  { v: ['24+', '+٢٤'], l: ['government services online', 'خدمة حكومية رقمية'] },
  { v: ['0', '٠'], l: ['queues or wasta needed', 'طوابير ولا واسطة'] },
  { v: ['EN · AR', 'EN · ع'], l: ['fully bilingual', 'ثنائية اللغة تمامًا'] },
];

function ArchPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full text-white/[0.05] sm:h-36"
      aria-hidden
    >
      <defs>
        <pattern id="hero-arches" width="72" height="104" patternUnits="userSpaceOnUse">
          <path
            d="M10 104V52c0-16 9-30 26-40 17 10 26 24 26 40v52"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-arches)" />
    </svg>
  );
}

function Skyline() {
  return (
    <svg
      viewBox="0 0 1440 190"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute bottom-0 end-0 h-36 w-full text-primary-900/60 sm:h-44"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 190v-42h72v-26l14-16 14 16v26h84v-52h12v-18a38 34 0 0 1 76 0v18h12v52h118v-38h12V86l8-24 8 24v34h12v38h104v-26h96v26h128v-48a52 30 0 0 1 104 0v48h58v-30h14V58l7-22 7 22v60h14v30h112v-22h98v22h64v42z" />
    </svg>
  );
}

function MockApplicationCard({ lang }: { lang: Lang }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="card rotate-1 p-5 shadow-lift">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Icon name="passport" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">
              {pick(lang, 'Passport renewal', 'تجديد جواز السفر')}
            </p>
            <p className="text-xs text-ink-400" dir="ltr">
              MNR-2026-04821
            </p>
          </div>
          <StatusPill status="in_review" label={pick(lang, 'In review', 'قيد المراجعة')} />
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-[11px] font-semibold text-ink-400">
            <span className="text-primary-700">{pick(lang, 'Submitted', 'قُدّم')}</span>
            <span className="text-primary-700">{pick(lang, 'In review', 'قيد المراجعة')}</span>
            <span>{pick(lang, 'Ready', 'جاهز')}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary-500 to-primary-700" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="wallet" className="h-3.5 w-3.5" />
            {pick(lang, '55 LYD', '٥٥ د.ل')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {pick(lang, '7 days', '٧ أيام')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="qr" className="h-3.5 w-3.5" />
            {pick(lang, 'QR-verified', 'موثّق برمز QR')}
          </span>
        </div>
      </div>

      <div
        className="card absolute -bottom-7 -start-3 flex -rotate-2 items-center gap-2.5 px-4 py-3 shadow-lift animate-fade-up sm:-start-8"
        style={{ animationDelay: '400ms' }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon name="bell" className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-xs font-bold text-ink-900">
            {pick(lang, 'Approved — ready for pickup', 'تمت الموافقة — جاهز للاستلام')}
          </span>
          <span className="block text-[10px] text-ink-400">
            {pick(lang, 'Just now · SMS + push', 'الآن · رسالة نصية + إشعار')}
          </span>
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const { lang, t } = useLanguage();
  return (
    <>
      <section className="relative overflow-hidden bg-primary-950 pb-24 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 45% at 82% 8%, rgba(232,167,46,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 8% 95%, rgba(59,182,180,0.14) 0%, transparent 60%)',
          }}
        />
        <ArchPattern />
        <Skyline />

        <div className="container-page relative pt-16 sm:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
            <div className="animate-fade-up">
              <span className="chip bg-white/10 text-gold-300 ring-1 ring-white/15 backdrop-blur-sm">
                ليبيا · Libya · Government-as-a-Service
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {pick(
                  lang,
                  <>Government services, <span className="text-gold-300">minus the queue.</span></>,
                  <>الخدمات الحكومية… <span className="text-gold-300">من غير طوابير.</span></>,
                )}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-100/80 sm:text-lg">
                {pick(
                  lang,
                  'Apply for documents, pay bills, book appointments and report outages — from your phone, wherever you are in Libya. No office visit, no middleman.',
                  'قدّم على المستندات، ادفع الفواتير، احجز المواعيد وأبلغ عن الأعطال — كل ذلك من هاتفك، أينما كنت في ليبيا. بلا زيارة مكاتب وبلا وسطاء.',
                )}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-base font-semibold text-ink-950 shadow-lift transition hover:bg-gold-400 active:scale-[.98]"
                >
                  {t('nav.getstarted')}
                  <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-[.98]"
                >
                  {pick(lang, 'Explore services', 'استكشف الخدمات')}
                </Link>
              </div>
            </div>

            <div className="animate-fade-up pb-6" style={{ animationDelay: '150ms' }}>
              <MockApplicationCard lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-page relative z-10 -mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {HERO_STATS.map((s, i) => (
          <div key={i} className="animate-fade-up" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <Stat value={pick(lang, s.v[0], s.v[1])} label={pick(lang, s.l[0], s.l[1])} />
          </div>
        ))}
      </div>
    </>
  );
}
