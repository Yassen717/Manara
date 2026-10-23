'use client';

import React, { useState } from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { Button, FieldLabel, Input, Spinner } from '@/components/ui';
import { ErrorBanner } from './ErrorBanner';

const NIN_RE = /^\d{8,14}$/;
const PHONE_RE = /^\+?\d{7,15}$/;

// Shared first step of the OTP flow: National ID number + phone.
// onSubmit should call requestOtp and throw on failure — the error is shown here.
export function IdentityStep({
  submitLabel,
  onSubmit,
  topNote,
}: {
  submitLabel: string;
  onSubmit: (nin: string, phone: string) => Promise<void>;
  topNote?: React.ReactNode;
}) {
  const { lang } = useLanguage();
  const [nin, setNin] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ nin?: string; phone?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { nin?: string; phone?: string } = {};
    if (!NIN_RE.test(nin.trim())) {
      next.nin = pick(
        lang,
        'National ID must be 8–14 digits',
        'الرقم الوطني يجب أن يتكون من 8 إلى 14 رقمًا',
      );
    }
    if (!PHONE_RE.test(phone.replace(/[\s-]/g, ''))) {
      next.phone = pick(lang, 'Enter a valid phone number', 'أدخل رقم هاتف صحيح');
    }
    setErrors(next);
    if (next.nin || next.phone) return;

    setFormError(null);
    setBusy(true);
    try {
      await onSubmit(nin.trim(), phone.trim());
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : pick(lang, 'Could not send the code. Try again.', 'تعذر إرسال الرمز. حاول مرة أخرى.'),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {topNote}
      <ErrorBanner message={formError} />

      <div>
        <FieldLabel hint={pick(lang, '8–14 digits', '8–14 رقمًا')}>
          {pick(lang, 'National ID number (NIN)', 'الرقم الوطني')}
        </FieldLabel>
        <Input
          dir="ltr"
          inputMode="numeric"
          autoComplete="off"
          placeholder={pick(lang, 'e.g. 120080012345', 'مثال: 120080012345')}
          value={nin}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
        />
        {errors.nin ? <p className="mt-1 text-xs font-medium text-red-600">{errors.nin}</p> : null}
      </div>

      <div>
        <FieldLabel hint={pick(lang, 'with country code', 'مع رمز الدولة')}>
          {pick(lang, 'Phone number', 'رقم الهاتف')}
        </FieldLabel>
        <Input
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+218 9X XXX XXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone ? <p className="mt-1 text-xs font-medium text-red-600">{errors.phone}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Spinner className="!text-white" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
