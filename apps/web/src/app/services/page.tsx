'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type { CategoryInfo, ServiceCategory, ServiceSummary } from '@/lib/types';
import { EmptyState, Input, PageHeader, SkeletonCard, Tabs } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { ServiceCard } from '@/components/services/ServiceCard';

type CategoryFilter = ServiceCategory | 'all';

const CATEGORY_IDS: ServiceCategory[] = [
  'identity',
  'documents',
  'travel',
  'health',
  'education',
  'utilities',
  'payments',
  'business',
  'social',
  'justice',
  'municipal',
  'employment',
];

function ServicesBrowser() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const paramFilter: CategoryFilter = (CATEGORY_IDS as string[]).includes(categoryParam ?? '')
    ? (categoryParam as CategoryFilter)
    : 'all';
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [active, setActive] = useState<CategoryFilter>(paramFilter);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActive(paramFilter);
  }, [paramFilter]);

  useEffect(() => {
    api
      .serviceCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(h);
  }, [q]);

  useEffect(() => {
    let on = true;
    setLoading(true);
    api
      .services({ category: active === 'all' ? undefined : active, q: debouncedQ || undefined })
      .then((s) => {
        if (on) setServices(s);
      })
      .catch(() => {
        if (on) setServices([]);
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [active, debouncedQ]);

  const tabs = [
    { id: 'all' as CategoryFilter, label: pick(lang, 'All', 'الكل') },
    ...categories.map((c) => ({
      id: c.id as CategoryFilter,
      label: `${pick(lang, c.name, c.nameAr)} (${c.count})`,
    })),
  ];

  return (
    <>
      <PageHeader
        title={pick(lang, 'Government services', 'الخدمات الحكومية')}
        subtitle={pick(
          lang,
          'Apply for documents, IDs, permits and more — online, without queues.',
          'قدّم على الوثائق والهويات والتصاريح وغيرها — إلكترونيًا وبدون طوابير.',
        )}
      />
      <div className="container-page py-8">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Icon
              name="search"
              className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={pick(lang, 'Search services…', 'ابحث عن خدمة…')}
              className="ps-10"
              aria-label={t('common.search')}
            />
          </div>
          <Tabs tabs={tabs} active={active} onChange={setActive} />
        </div>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : services.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title={pick(lang, 'No services found', 'لا توجد خدمات')}
              hint={pick(
                lang,
                'Try a different search term or category.',
                'جرّب كلمة بحث أو فئة مختلفة.',
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ServicesBrowser />
    </Suspense>
  );
}
