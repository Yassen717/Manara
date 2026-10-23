'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import type { Application, ApplicationStatus } from '@/lib/types';
import { EmptyState, PageHeader, SkeletonCard, Tabs } from '@/components/ui';
import {
  ApplicationCard,
  APPLICATION_STATUS_META,
} from '@/components/services/ApplicationCard';

type StatusFilter = ApplicationStatus | 'all';

const FILTER_IDS: StatusFilter[] = [
  'all',
  'submitted',
  'in_review',
  'approved',
  'rejected',
  'completed',
];

export default function ApplicationsPage() {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    if (!token) return;
    let on = true;
    setLoading(true);
    api
      .applications(token)
      .then((apps) => {
        if (on) setApplications(apps);
      })
      .catch(() => {
        if (on) setApplications([]);
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [token]);

  if (!ready || !token) {
    return (
      <div className="container-page py-8">
        <SkeletonCard />
        <div className="mt-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const tabs = FILTER_IDS.map((id) => ({
    id,
    label:
      id === 'all'
        ? pick(lang, 'All', 'الكل')
        : pick(lang, APPLICATION_STATUS_META[id].en, APPLICATION_STATUS_META[id].ar),
  }));

  const visible = (
    filter === 'all' ? applications : applications.filter((a) => a.status === filter)
  )
    .slice()
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <>
      <PageHeader
        title={pick(lang, 'My applications', 'طلبات الخدمات')}
        subtitle={pick(
          lang,
          'Track every service application you have submitted.',
          'تابع جميع طلبات الخدمات التي قدّمتها.',
        )}
      />
      <div className="container-page py-8">
        <Tabs tabs={tabs} active={filter} onChange={setFilter} />
        {loading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visible.length ? (
          <div className="mt-6 space-y-4">
            {visible.map((a) => (
              <ApplicationCard key={a.id} application={a} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title={pick(lang, 'No applications yet', 'لا توجد طلبات بعد')}
              hint={pick(
                lang,
                'When you apply for a service it will show up here.',
                'عندما تقدّم على خدمة ستظهر هنا.',
              )}
              action={
                <Link href="/services" className="btn-primary">
                  {pick(lang, 'Browse services', 'تصفح الخدمات')}
                </Link>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
