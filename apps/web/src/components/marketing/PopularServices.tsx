'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney } from '@/lib/format';
import type { ServiceSummary } from '@/lib/types';
import { EmptyState, SectionTitle, SkeletonCard } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

export function PopularServices() {
  const { lang, t } = useLanguage();
  const [services, setServices] = useState<ServiceSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .services({ popular: true })
      .then((d) => alive && setServices(d.slice(0, 4)))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="container-page pb-14 sm:pb-16">
      <SectionTitle
        title={pick(lang, 'Most-used services', 'الخدمات الأكثر استخدامًا')}
        subtitle={pick(
          lang,
          'The applications citizens file most — now fully online.',
          'أكثر الطلبات التي يقدّمها المواطنون — أصبحت الآن رقمية بالكامل.',
        )}
        action={
          <Link
            href="/services"
            className="hidden shrink-0 items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-800 hover:underline sm:inline-flex"
          >
            {t('common.viewAll')}
            <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
          </Link>
        }
      />

      {failed ? (
        <EmptyState
          title={pick(lang, 'Could not load popular services', 'تعذّر تحميل الخدمات الأكثر استخدامًا')}
          hint={pick(
            lang,
            'The services catalog is unavailable right now. Try again shortly.',
            'دليل الخدمات غير متاح حاليًا. حاول مجددًا بعد قليل.',
          )}
        />
      ) : services === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No popular services yet', 'لا توجد خدمات شائعة بعد')}
          hint={pick(lang, 'Popular services will appear here.', 'ستظهر الخدمات الأكثر استخدامًا هنا.')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="card group flex animate-fade-up flex-col p-5 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lift"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                {s.online ? (
                  <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    {pick(lang, 'Online', 'أونلاين')}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink-900 group-hover:text-primary-800">
                {pick(lang, s.name, s.nameAr)}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
                {pick(lang, s.shortDescription, s.shortDescriptionAr)}
              </p>
              <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-ink-400">
                <span className="inline-flex items-center gap-1">
                  <Icon name="wallet" className="h-3.5 w-3.5" />
                  {s.fee === 0 ? t('common.free') : fmtMoney(s.fee, 'LYD', lang)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {s.processingDays} {t('common.days')}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 border-t border-ink-100 pt-3 text-sm font-bold text-primary-700 transition-all group-hover:gap-2.5">
                {pick(lang, 'Apply', 'قدّم الآن')}
                <Icon name="arrow" className="h-4 w-4 rtl:rotate-180" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
