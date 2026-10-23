'use client';

import React from 'react';
import Link from 'next/link';
import type { ServiceRequest } from '@/lib/types';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate, fmtDateTime } from '@/lib/format';
import { Badge, Card, StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import {
  PRIORITY_META,
  REQUEST_TYPE_META,
  requestStatusLabel,
  requestTypeLabel,
} from './typeMeta';

export function RequestCard({ request }: { request: ServiceRequest }) {
  const { lang } = useLanguage();
  const meta = REQUEST_TYPE_META[request.type] ?? REQUEST_TYPE_META.other;
  const hot = request.priority === 'high' || request.priority === 'urgent';
  return (
    <Link href={`/requests/${request.id}`} className="block">
      <Card hover className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Icon name={meta.icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-ink-900">{request.title}</h3>
              <StatusPill
                status={request.status}
                label={requestStatusLabel(lang, request.status)}
              />
            </div>
            <p className="mt-0.5 text-sm text-ink-500">
              {requestTypeLabel(lang, request.type)} · {request.municipality} ·{' '}
              {fmtDate(request.createdAt, lang)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {hot ? (
                <Badge tone={request.priority === 'urgent' ? 'red' : 'amber'}>
                  <Icon name="warn" className="h-3.5 w-3.5" />
                  {pick(
                    lang,
                    PRIORITY_META[request.priority].en,
                    PRIORITY_META[request.priority].ar,
                  )}
                </Badge>
              ) : null}
              {request.eta ? (
                <Badge tone="blue">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {pick(lang, 'ETA', 'الوقت المتوقع')}: {fmtDateTime(request.eta, lang)}
                </Badge>
              ) : null}
              <span className="font-mono text-xs text-ink-400">{request.reference}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
