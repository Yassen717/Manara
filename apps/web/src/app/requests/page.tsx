'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import type { RequestStatus, RequestType, ServiceRequest } from '@/lib/types';
import { EmptyState, PageHeader, Select, SkeletonCard } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { RequestCard } from '@/components/requests/RequestCard';
import {
  REQUEST_STATUS_META,
  REQUEST_STATUSES,
  REQUEST_TYPE_META,
  REQUEST_TYPES,
} from '@/components/requests/typeMeta';

type TypeFilter = RequestType | 'all';
type StatusFilter = RequestStatus | 'all';

export default function RequestsPage() {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    if (!token) return;
    let on = true;
    setLoading(true);
    api
      .requests(token, {
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      })
      .then((r) => {
        if (on) setRequests(r);
      })
      .catch(() => {
        if (on) setRequests([]);
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [token, typeFilter, statusFilter]);

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

  const visible = requests
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <PageHeader
        title={pick(lang, 'Service requests', 'الطلبات والبلاغات')}
        subtitle={pick(
          lang,
          'Report power, water, waste, road and telecom issues in your municipality.',
          'أبلغ عن مشاكل الكهرباء والمياه والقمامة والطرق والاتصالات في بلديتك.',
        )}
      />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="scroll-slim -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                typeFilter === 'all'
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {pick(lang, 'All', 'الكل')}
            </button>
            {REQUEST_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  typeFilter === type
                    ? 'border-primary-700 bg-primary-700 text-white'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                <Icon name={REQUEST_TYPE_META[type].icon} className="h-4 w-4" />
                {pick(lang, REQUEST_TYPE_META[type].en, REQUEST_TYPE_META[type].ar)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="!w-auto"
              aria-label={pick(lang, 'Filter by status', 'التصفية حسب الحالة')}
            >
              <option value="all">{pick(lang, 'All statuses', 'كل الحالات')}</option>
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {pick(lang, REQUEST_STATUS_META[s].en, REQUEST_STATUS_META[s].ar)}
                </option>
              ))}
            </Select>
            <Link href="/requests/new" className="btn-primary whitespace-nowrap">
              <Icon name="plus" className="h-4 w-4" />
              {pick(lang, 'New request', 'طلب جديد')}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visible.length ? (
          <div className="mt-6 space-y-4">
            {visible.map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title={pick(lang, 'No requests found', 'لا توجد طلبات')}
              hint={pick(
                lang,
                'Report an issue in your municipality and track it here.',
                'أبلغ عن مشكلة في بلديتك وتابعها هنا.',
              )}
              action={
                <Link href="/requests/new" className="btn-primary">
                  {pick(lang, 'New request', 'طلب جديد')}
                </Link>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
