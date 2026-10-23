'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type { CategoryInfo, ServiceCategory } from '@/lib/types';
import { EmptyState, SectionTitle, Skeleton } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const CATEGORY_ICONS: Record<ServiceCategory, string> = {
  identity: 'id',
  documents: 'doc',
  travel: 'passport',
  health: 'health',
  education: 'education',
  utilities: 'bolt',
  payments: 'wallet',
  business: 'briefcase',
  social: 'people',
  justice: 'court',
  municipal: 'building',
  employment: 'card',
};

export function ServiceCategoryGrid() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState<CategoryInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .serviceCategories()
      .then((d) => alive && setCategories(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="container-page py-14 sm:py-16">
      <SectionTitle
        title={pick(lang, 'Every government service, one door', 'كل الخدمات الحكومية، باب واحد')}
        subtitle={pick(
          lang,
          'Twelve categories covering the services Libyans queue for most.',
          'اثنتا عشرة فئة تغطي الخدمات التي يقف الليبيون في طوابيرها أكثر من غيرها.',
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
          title={pick(lang, 'Could not load service categories', 'تعذّر تحميل فئات الخدمات')}
          hint={pick(
            lang,
            'The services catalog is unavailable right now. Try again shortly.',
            'دليل الخدمات غير متاح حاليًا. حاول مجددًا بعد قليل.',
          )}
        />
      ) : categories === null ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No categories yet', 'لا توجد فئات بعد')}
          hint={pick(lang, 'Service categories will appear here.', 'ستظهر فئات الخدمات هنا.')}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/services?category=${c.id}`}
              className="card group flex animate-fade-up flex-col p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lift sm:p-5"
              style={{ animationDelay: `${(i % 8) * 50}ms` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-100">
                <Icon name={CATEGORY_ICONS[c.id] ?? 'doc'} className="h-6 w-6" />
              </span>
              <span className="mt-3 text-sm font-bold text-ink-900 group-hover:text-primary-800">
                {pick(lang, c.name, c.nameAr)}
              </span>
              <span className="mt-0.5 text-xs font-medium text-ink-400">
                {pick(lang, `${c.count} services`, `${c.count} خدمة`)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
