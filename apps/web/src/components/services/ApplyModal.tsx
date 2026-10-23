'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney } from '@/lib/format';
import type { Application, ServiceDetail } from '@/lib/types';
import { Button, Modal, Spinner } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

type Delivery = 'digital' | 'pickup' | 'courier';

const DELIVERY_OPTIONS: { id: Delivery; icon: string; en: string; ar: string; descEn: string; descAr: string }[] = [
  {
    id: 'digital',
    icon: 'phone',
    en: 'Digital delivery',
    ar: 'تسليم إلكتروني',
    descEn: 'Issued straight into your Manara account',
    descAr: 'يصدر مباشرة إلى حسابك في منارة',
  },
  {
    id: 'pickup',
    icon: 'building',
    en: 'Office pickup',
    ar: 'استلام من المكتب',
    descEn: 'Collect from your municipality office',
    descAr: 'الاستلام من مكتب البلدية',
  },
  {
    id: 'courier',
    icon: 'truck',
    en: 'Courier delivery',
    ar: 'توصيل بالبريد',
    descEn: 'Delivered to your registered address',
    descAr: 'يوصَّل إلى عنوانك المسجل',
  },
];

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}

function SignInPanel({ onClose }: { onClose: () => void }) {
  const { lang, t } = useLanguage();
  return (
    <div className="rounded-2xl bg-primary-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary-700">
        <Icon name="shield" className="h-6 w-6" />
      </div>
      <p className="font-bold text-ink-900">{pick(lang, 'Sign in required', 'تسجيل الدخول مطلوب')}</p>
      <p className="mt-1 text-sm text-ink-600">
        {pick(
          lang,
          'You need to sign in with your National ID to apply for this service.',
          'تحتاج إلى تسجيل الدخول برقمك الوطني للتقديم على هذه الخدمة.',
        )}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Link href="/login" className="btn-primary" onClick={onClose}>
          {t('nav.login')}
        </Link>
        <Button variant="secondary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  );
}

export function ApplyModal({
  service,
  open,
  onClose,
}: {
  service: ServiceDetail;
  open: boolean;
  onClose: () => void;
}) {
  const { lang, t } = useLanguage();
  const { token, citizen } = useAuth();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState<Delivery>('digital');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [result, setResult] = useState<Application | null>(null);

  useEffect(() => {
    if (open) {
      setStep(0);
      setDelivery('digital');
      setNote('');
      setSubmitting(false);
      setError(null);
      setNeedsAuth(false);
      setResult(null);
    }
  }, [open]);

  const deliveryMeta = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;

  const submit = async () => {
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const app = await api.applyForService(
        service.slug,
        { delivery, note: note.trim() || undefined },
        token,
      );
      setResult(app);
      setStep(3);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setNeedsAuth(true);
      else setError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = [
    pick(lang, 'Your details', 'بياناتك'),
    pick(lang, 'Delivery', 'التسليم'),
    pick(lang, 'Review', 'المراجعة'),
  ];

  const content = () => {
    if (!token || needsAuth) return <SignInPanel onClose={onClose} />;

    if (step === 3 && result) {
      return (
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check" className="h-7 w-7" strokeWidth={2} />
          </div>
          <p className="text-lg font-bold text-ink-900">
            {pick(lang, 'Application submitted', 'تم تقديم الطلب')}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {pick(lang, 'Your reference number', 'رقم المرجع الخاص بك')}
          </p>
          <p className="chip mx-auto mt-2 bg-ink-50 font-mono text-sm text-ink-800 ring-1 ring-ink-200">
            {result.reference}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/applications" className="btn-primary" onClick={onClose}>
              {pick(lang, 'Track in Applications', 'تابع في طلباتي')}
            </Link>
            <Button variant="secondary" onClick={onClose}>
              {pick(lang, 'Close', 'إغلاق')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <ol className="mb-5 flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  i <= step ? 'bg-primary-700 text-white' : 'bg-ink-100 text-ink-400'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-xs font-semibold ${i <= step ? 'text-ink-800' : 'text-ink-400'}`}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 ? <span className="mx-1 h-px w-5 bg-ink-200" /> : null}
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 px-4">
            <Row
              label={pick(lang, 'Full name', 'الاسم الكامل')}
              value={
                citizen
                  ? pick(
                      lang,
                      `${citizen.firstName} ${citizen.lastName}`,
                      `${citizen.firstNameAr} ${citizen.lastNameAr}`,
                    )
                  : '—'
              }
            />
            <Row label={pick(lang, 'National ID (NIN)', 'الرقم الوطني')} value={citizen?.nin ?? '—'} />
            <Row
              label={pick(lang, 'Municipality', 'البلدية')}
              value={citizen?.municipality ?? '—'}
            />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-3">
            {DELIVERY_OPTIONS.map((d) => (
              <label
                key={d.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  delivery === d.id
                    ? 'border-primary-400 bg-primary-50/60 ring-2 ring-primary-100'
                    : 'border-ink-200 hover:border-primary-200'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  className="mt-1 accent-primary-700"
                  checked={delivery === d.id}
                  onChange={() => setDelivery(d.id)}
                />
                <Icon name={d.icon} className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <span>
                  <span className="block text-sm font-semibold text-ink-900">
                    {pick(lang, d.en, d.ar)}
                  </span>
                  <span className="block text-xs text-ink-500">{pick(lang, d.descEn, d.descAr)}</span>
                </span>
              </label>
            ))}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-800">
                {pick(lang, 'Note', 'ملاحظة')}
                <span className="ms-1 text-xs font-normal text-ink-400">
                  ({pick(lang, 'optional', 'اختياري')})
                </span>
              </label>
              <textarea
                className="input min-h-[5rem]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={pick(
                  lang,
                  'Anything the office should know…',
                  'أي شيء يجب أن يعرفه المكتب…',
                )}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 px-4">
            <Row
              label={pick(lang, 'Service', 'الخدمة')}
              value={pick(lang, service.name, service.nameAr)}
            />
            <Row
              label={pick(lang, 'Delivery', 'التسليم')}
              value={pick(lang, deliveryMeta.en, deliveryMeta.ar)}
            />
            {note.trim() ? (
              <Row label={pick(lang, 'Note', 'ملاحظة')} value={note.trim()} />
            ) : null}
            <Row
              label={pick(lang, 'Fee', 'الرسوم')}
              value={service.fee > 0 ? fmtMoney(service.fee, 'LYD', lang) : t('common.free')}
            />
          </div>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-between gap-2">
          <Button variant="ghost" onClick={() => (step === 0 ? onClose() : setStep(step - 1))}>
            {step === 0 ? t('common.cancel') : t('common.back')}
          </Button>
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)}>{pick(lang, 'Continue', 'متابعة')}</Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? <Spinner className="h-4 w-4" /> : null}
              {pick(lang, 'Submit application', 'إرسال الطلب')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${pick(lang, 'Apply', 'تقديم')}: ${pick(lang, service.name, service.nameAr)}`}
    >
      {content()}
    </Modal>
  );
}
