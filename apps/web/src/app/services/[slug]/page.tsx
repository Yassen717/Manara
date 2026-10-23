'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney } from '@/lib/format';
import type { CategoryInfo, ServiceDetail } from '@/lib/types';
import { Badge, Button, Card, EmptyState, Skeleton } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { ApplyModal } from '@/components/services/ApplyModal';

function BackLink() {
  const { lang, isRtl } = useLanguage();
  return (
    <Link
      href="/services"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline"
    >
      <Icon name="arrow" className={`h-4 w-4 ${isRtl ? '' : 'rotate-180'}`} />
      {pick(lang, 'Back to services', 'العودة إلى الخدمات')}
    </Link>
  );
}

export default function ServiceDetailPage() {
  const { lang, t } = useLanguage();
  const { token, ready } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let on = true;
    setLoading(true);
    api
      .service(slug)
      .then((s) => {
        if (on) setService(s);
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
  }, [slug]);

  useEffect(() => {
    api
      .serviceCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="container-page py-8">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-6 h-32 w-full" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (missing || !service) {
    return (
      <div className="container-page py-8">
        <BackLink />
        <div className="mt-6">
          <EmptyState
            title={pick(lang, 'Service not found', 'الخدمة غير موجودة')}
            hint={pick(
              lang,
              'This service may have been moved or is no longer available.',
              'ربما تم نقل هذه الخدمة أو لم تعد متاحة.',
            )}
            action={
              <Link href="/services" className="btn-primary">
                {pick(lang, 'Browse services', 'تصفح الخدمات')}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === service.category);
  const categoryLabel = category ? pick(lang, category.name, category.nameAr) : service.category;
  const paragraphs = pick(lang, service.longDescription, service.longDescriptionAr)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="container-page py-8">
      <BackLink />

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white">
            <Icon name={service.icon} className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{categoryLabel}</Badge>
              {service.online ? (
                <Badge tone="green">
                  <Icon name="globe" className="h-3.5 w-3.5" />
                  {pick(lang, 'Online only', 'إلكترونية فقط')}
                </Badge>
              ) : null}
              <Badge tone="gray">
                {service.fee > 0 ? fmtMoney(service.fee, 'LYD', lang) : t('common.free')}
              </Badge>
              <Badge tone="gray">
                <Icon name="clock" className="h-3.5 w-3.5" />
                {service.processingDays} {t('common.days')}
              </Badge>
              {service.popular ? (
                <Badge tone="gold">{pick(lang, 'Popular', 'شائع')}</Badge>
              ) : null}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {pick(lang, service.name, service.nameAr)}
            </h1>
            <p className="mt-1 text-sm text-ink-500 sm:text-base">
              {pick(lang, service.shortDescription, service.shortDescriptionAr)}
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-ink-900">
              {pick(lang, 'About this service', 'عن هذه الخدمة')}
            </h2>
            <div className="mt-3 space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-7 text-ink-600">
                  {p}
                </p>
              ))}
            </div>
          </Card>

          {service.requiredDocuments.length ? (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink-900">
                {pick(lang, 'Required documents', 'المستندات المطلوبة')}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {service.requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Icon name="check" className="h-3 w-3" strokeWidth={2.4} />
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {service.steps.length ? (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink-900">
                {pick(lang, 'How it works', 'خطوات التقديم')}
              </h2>
              <ol className="mt-4">
                {service.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {i < service.steps.length - 1 ? (
                        <span className="w-px flex-1 bg-ink-100" />
                      ) : null}
                    </div>
                    <p className={`text-sm leading-7 text-ink-600 ${i < service.steps.length - 1 ? 'pb-5' : ''}`}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </Card>
          ) : null}

          {service.eligibility.length ? (
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink-900">
                {pick(lang, 'Eligibility', 'شروط الأهلية')}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {service.eligibility.map((e, i) => (
                  <Badge key={i} tone="gray">
                    {e}
                  </Badge>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        <aside className="self-start lg:sticky lg:top-6">
          <Card className="p-5">
            <h2 className="font-bold text-ink-900">
              {pick(lang, 'Service summary', 'ملخص الخدمة')}
            </h2>
            <dl className="mt-3 divide-y divide-ink-100">
              <div className="flex items-center justify-between py-2.5 text-sm">
                <dt className="text-ink-500">{pick(lang, 'Fee', 'الرسوم')}</dt>
                <dd className="font-semibold text-ink-900">
                  {service.fee > 0 ? fmtMoney(service.fee, 'LYD', lang) : t('common.free')}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5 text-sm">
                <dt className="text-ink-500">{pick(lang, 'Processing time', 'مدة المعالجة')}</dt>
                <dd className="font-semibold text-ink-900">
                  {service.processingDays} {t('common.days')}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5 text-sm">
                <dt className="text-ink-500">{pick(lang, 'Channel', 'القناة')}</dt>
                <dd className="font-semibold text-ink-900">
                  {service.online ? pick(lang, 'Online', 'إلكتروني') : pick(lang, 'In-person', 'حضوري')}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5 text-sm">
                <dt className="text-ink-500">{pick(lang, 'Category', 'الفئة')}</dt>
                <dd className="font-semibold text-ink-900">{categoryLabel}</dd>
              </div>
            </dl>
            {!ready ? (
              <Skeleton className="mt-4 h-10 w-full" />
            ) : token ? (
              <Button className="mt-4 w-full" onClick={() => setApplyOpen(true)}>
                <Icon name="send" className="h-4 w-4" />
                {pick(lang, 'Apply now', 'قدّم الآن')}
              </Button>
            ) : (
              <div className="mt-4 rounded-2xl bg-primary-50 p-4 text-center">
                <p className="text-sm font-bold text-ink-900">
                  {pick(lang, 'Sign in required', 'تسجيل الدخول مطلوب')}
                </p>
                <p className="mt-1 text-xs text-ink-600">
                  {pick(
                    lang,
                    'Sign in with your National ID to apply.',
                    'سجّل الدخول برقمك الوطني للتقديم.',
                  )}
                </p>
                <Link href="/login" className="btn-primary mt-3 w-full">
                  {t('nav.login')}
                </Link>
              </div>
            )}
          </Card>
        </aside>
      </div>

      <ApplyModal service={service} open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  );
}
