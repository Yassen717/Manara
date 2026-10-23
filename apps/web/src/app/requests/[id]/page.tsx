'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDateTime } from '@/lib/format';
import type { ServiceRequest } from '@/lib/types';
import { Badge, Card, EmptyState, Skeleton, SkeletonCard, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { StatusTimeline } from '@/components/requests/StatusTimeline';
import {
  PRIORITY_META,
  REQUEST_TYPE_META,
  requestStatusLabel,
  requestTypeLabel,
} from '@/components/requests/typeMeta';

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  );
}

export default function RequestDetailPage() {
  const { lang, isRtl } = useLanguage();
  const { token, ready } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    if (!token || !id) return;
    let on = true;
    setLoading(true);
    api
      .request_(id, token)
      .then((r) => {
        if (on) setRequest(r);
      })
      .catch(() => {
        if (on) setMissing(true);
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [token, id]);

  const backLink = (
    <Link
      href="/requests"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline"
    >
      <Icon name="arrow" className={`h-4 w-4 ${isRtl ? '' : 'rotate-180'}`} />
      {pick(lang, 'Back to requests', 'العودة إلى الطلبات')}
    </Link>
  );

  if (!ready || !token || loading) {
    return (
      <div className="container-page py-8">
        <Skeleton className="h-4 w-36" />
        <div className="mt-6">
          <SkeletonCard />
        </div>
        <div className="mt-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (missing || !request) {
    return (
      <div className="container-page py-8">
        {backLink}
        <div className="mt-6">
          <EmptyState
            title={pick(lang, 'Request not found', 'الطلب غير موجود')}
            hint={pick(
              lang,
              'It may have been removed, or the link is wrong.',
              'ربما تم حذفه أو أن الرابط غير صحيح.',
            )}
            action={
              <Link href="/requests" className="btn-primary">
                {pick(lang, 'All requests', 'كل الطلبات')}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const meta = REQUEST_TYPE_META[request.type] ?? REQUEST_TYPE_META.other;

  return (
    <div className="container-page py-8">
      {backLink}

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <Icon name={meta.icon} className="h-6 w-6" />
            </div>
            <div>
              <p className="font-mono text-xs text-ink-400">{request.reference}</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
                {request.title}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {requestTypeLabel(lang, request.type)} · {request.municipality}
              </p>
            </div>
          </div>
          <StatusPill status={request.status} label={requestStatusLabel(lang, request.status)} />
        </div>
      </Card>

      {request.eta ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {pick(lang, 'Estimated resolution', 'الوقت المتوقع للإنجاز')}
            </p>
            <p className="text-sm text-amber-700">{fmtDateTime(request.eta, lang)}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink-900">
              {pick(lang, 'Description', 'الوصف')}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-600">
              {request.description}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink-900">
              {pick(lang, 'Progress', 'سجل المتابعة')}
            </h2>
            <div className="mt-4">
              <StatusTimeline
                items={request.timeline}
                labelOf={(s) => requestStatusLabel(lang, s)}
                time="ago"
              />
            </div>
          </Card>
        </div>

        <aside className="self-start lg:sticky lg:top-6">
          <Card className="p-5">
            <h2 className="font-bold text-ink-900">{pick(lang, 'Details', 'التفاصيل')}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <MetaItem
                label={pick(lang, 'Type', 'النوع')}
                value={requestTypeLabel(lang, request.type)}
              />
              <MetaItem
                label={pick(lang, 'Municipality', 'البلدية')}
                value={request.municipality}
              />
              {request.region ? (
                <MetaItem label={pick(lang, 'Region', 'المنطقة')} value={request.region} />
              ) : null}
              <MetaItem
                label={pick(lang, 'Priority', 'الأولوية')}
                value={
                  <Badge
                    tone={
                      request.priority === 'urgent'
                        ? 'red'
                        : request.priority === 'high'
                          ? 'amber'
                          : 'gray'
                    }
                  >
                    {pick(
                      lang,
                      PRIORITY_META[request.priority]?.en ?? request.priority,
                      PRIORITY_META[request.priority]?.ar ?? request.priority,
                    )}
                  </Badge>
                }
              />
              <MetaItem
                label={pick(lang, 'Created', 'أُنشئ')}
                value={fmtDateTime(request.createdAt, lang)}
              />
              <MetaItem
                label={pick(lang, 'Updated', 'حُدّث')}
                value={fmtDateTime(request.updatedAt, lang)}
              />
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
