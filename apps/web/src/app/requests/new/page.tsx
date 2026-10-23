'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import type { Municipality, Region, RequestType } from '@/lib/types';
import { Button, Card, FieldLabel, Input, PageHeader, Select, SkeletonCard, Spinner } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { REQUEST_TYPE_META, REQUEST_TYPES } from '@/components/requests/typeMeta';

type FieldErrors = Partial<Record<'type' | 'municipality' | 'title' | 'description', true>>;

export default function NewRequestPage() {
  const { lang, t, isRtl } = useLanguage();
  const { token, citizen, ready } = useAuth();
  const router = useRouter();

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [type, setType] = useState<RequestType | null>(null);
  const [municipality, setMunicipality] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    api
      .municipalities()
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]));
    api
      .regions()
      .then(setRegions)
      .catch(() => setRegions([]));
  }, []);

  useEffect(() => {
    if (citizen?.municipality && !municipality) setMunicipality(citizen.municipality);
  }, [citizen, municipality]);

  const grouped = useMemo(() => {
    const m = new Map<string, Municipality[]>();
    for (const mun of municipalities) {
      const arr = m.get(mun.region) ?? [];
      arr.push(mun);
      m.set(mun.region, arr);
    }
    return [...m.entries()];
  }, [municipalities]);

  const regionLabel = (region: string) => {
    const r = regions.find((x) => x.name === region);
    return r ? pick(lang, r.name, r.nameAr) : region;
  };

  if (!ready || !token) {
    return (
      <div className="container-page py-8">
        <SkeletonCard />
      </div>
    );
  }

  const invalid = (field: keyof FieldErrors) =>
    errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (!type) errs.type = true;
    if (!municipality) errs.municipality = true;
    if (!title.trim()) errs.title = true;
    if (!description.trim()) errs.description = true;
    setErrors(errs);
    if (Object.keys(errs).length) {
      setBanner(
        pick(
          lang,
          'Please complete the highlighted fields.',
          'يرجى استكمال الحقول المحددة.',
        ),
      );
      return;
    }
    setBanner(null);
    setSubmitting(true);
    const selected = municipalities.find((m) => m.name === municipality);
    const desc = landmark.trim()
      ? `${description.trim()}\n\n${pick(lang, 'Nearby landmark', 'معلم قريب')}: ${landmark.trim()}`
      : description.trim();
    try {
      const created = await api.createRequest(
        {
          type: type as RequestType,
          title: title.trim(),
          description: desc,
          municipality,
          ...(selected?.region ? { region: selected.region } : {}),
        },
        token,
      );
      router.push(`/requests/${created.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/login');
        return;
      }
      setBanner(err instanceof Error ? err.message : pick(lang, 'Submission failed', 'فشل الإرسال'));
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title={pick(lang, 'New service request', 'طلب خدمة جديد')}
        subtitle={pick(
          lang,
          'Report a utility or municipal issue — the right team gets it directly.',
          'أبلغ عن مشكلة في المرافق أو البلدية — تصل مباشرة إلى الفريق المختص.',
        )}
      />
      <div className="container-page py-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline"
          >
            <Icon name="arrow" className={`h-4 w-4 ${isRtl ? '' : 'rotate-180'}`} />
            {pick(lang, 'Back to requests', 'العودة إلى الطلبات')}
          </Link>

          <form onSubmit={submit} noValidate>
            <Card className="mt-4 space-y-5 p-6">
              {banner ? (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-200">
                  <Icon name="warn" className="mt-0.5 h-4 w-4 shrink-0" />
                  {banner}
                </div>
              ) : null}

              <div>
                <FieldLabel>{pick(lang, 'Request type', 'نوع الطلب')}</FieldLabel>
                <div
                  className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${
                    errors.type ? 'rounded-2xl ring-2 ring-red-200 p-1' : ''
                  }`}
                >
                  {REQUEST_TYPES.map((rt) => {
                    const meta = REQUEST_TYPE_META[rt];
                    const selected = type === rt;
                    return (
                      <label
                        key={rt}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                          selected
                            ? 'border-primary-500 bg-primary-50/70 ring-2 ring-primary-100'
                            : 'border-ink-200 bg-white hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="request-type"
                          className="sr-only"
                          checked={selected}
                          onChange={() => setType(rt)}
                        />
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                            selected ? 'bg-primary-700 text-white' : 'bg-primary-50 text-primary-700'
                          }`}
                        >
                          <Icon name={meta.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-semibold text-ink-800">
                          {pick(lang, meta.en, meta.ar)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel>{pick(lang, 'Municipality', 'البلدية')}</FieldLabel>
                <Select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className={invalid('municipality')}
                >
                  <option value="" disabled>
                    {pick(lang, 'Select municipality', 'اختر البلدية')}
                  </option>
                  {grouped.map(([region, muns]) => (
                    <optgroup key={region} label={regionLabel(region)}>
                      {muns.map((m) => (
                        <option key={m.name} value={m.name}>
                          {pick(lang, m.name, m.nameAr)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </div>

              <div>
                <FieldLabel>{pick(lang, 'Title', 'العنوان')}</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={pick(
                    lang,
                    'e.g. Power outage in Hadba since morning',
                    'مثال: انقطاع الكهرباء في هدبة منذ الصباح',
                  )}
                  className={invalid('title')}
                />
              </div>

              <div>
                <FieldLabel>{pick(lang, 'Description', 'الوصف')}</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={pick(
                    lang,
                    'Describe the issue, when it started, and how many households are affected…',
                    'صِف المشكلة ومتى بدأت وعدد الأسر المتأثرة…',
                  )}
                  className={`input min-h-[7rem] ${invalid('description')}`}
                />
              </div>

              <div>
                <FieldLabel hint={pick(lang, 'optional', 'اختياري')}>
                  {pick(lang, 'Nearby landmark', 'معلم قريب')}
                </FieldLabel>
                <Input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder={pick(
                    lang,
                    'e.g. Next to the old market',
                    'مثال: بجانب السوق القديم',
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-ink-100 pt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/requests')}
                  disabled={submitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Spinner className="h-4 w-4" /> : null}
                  {t('common.submit')}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
}
