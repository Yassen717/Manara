'use client';

import React from 'react';
import Link from 'next/link';
import type { ServiceSummary } from '@/lib/types';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney } from '@/lib/format';
import { Badge, Card } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
    </svg>
  );
}

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const { lang, t } = useLanguage();
  return (
    <Link href={`/services/${service.slug}`} className="block h-full">
      <Card hover className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
            <Icon name={service.icon} className="h-6 w-6" />
          </div>
          {service.popular ? (
            <Badge tone="gold">
              <StarIcon />
              {pick(lang, 'Popular', 'شائع')}
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-4 font-bold text-ink-900">{pick(lang, service.name, service.nameAr)}</h3>
        <p className="mt-1 flex-1 text-sm leading-6 text-ink-500">
          {pick(lang, service.shortDescription, service.shortDescriptionAr)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="gray">
            {service.fee > 0 ? fmtMoney(service.fee, 'LYD', lang) : t('common.free')}
          </Badge>
          <Badge tone="blue">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {service.processingDays} {t('common.days')}
          </Badge>
          {!service.online ? (
            <Badge tone="amber">{pick(lang, 'In-person', 'حضوري')}</Badge>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
