'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { Button, Spinner } from '@/components/ui';
import { ErrorBanner } from './ErrorBanner';
import { DevCodeHint } from './DevCodeHint';
import { OtpInput } from './OtpInput';

// Second step of the OTP flow: enter the 6-digit code, verify, resend.
export function OtpVerifyStep({
  nin,
  phone,
  otpId: initialOtpId,
  devCode: initialDevCode,
  onEdit,
}: {
  nin: string;
  phone: string;
  otpId: string;
  devCode: string;
  onEdit?: () => void;
}) {
  const router = useRouter();
  const { lang } = useLanguage();
  const { requestOtp, login } = useAuth();

  const [otpId, setOtpId] = useState(initialOtpId);
  const [devCode, setDevCode] = useState(initialDevCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const verify = async (c: string) => {
    if (busy || c.length !== 6) return;
    setError(null);
    setBusy(true);
    try {
      await login(otpId, c);
      router.push('/dashboard');
    } catch {
      setError(
        pick(lang, 'Incorrect or expired code — try again.', 'رمز غير صحيح أو منتهي — حاول مرة أخرى.'),
      );
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (resending) return;
    setError(null);
    setResent(false);
    setResending(true);
    try {
      const r = await requestOtp(nin, phone);
      setOtpId(r.otpId);
      setDevCode(r.devCode);
      setCode('');
      setResent(true);
    } catch {
      setError(pick(lang, 'Could not resend the code.', 'تعذر إعادة إرسال الرمز.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-sm leading-relaxed text-ink-600">
        {pick(lang, 'We sent a 6-digit code to', 'أرسلنا رمزًا مكونًا من 6 أرقام إلى')}{' '}
        <span dir="ltr" className="font-bold text-ink-900">
          {phone}
        </span>
        {onEdit ? (
          <>
            {' · '}
            <button type="button" onClick={onEdit} className="link">
              {pick(lang, 'Edit', 'تعديل')}
            </button>
          </>
        ) : null}
      </div>

      <DevCodeHint code={devCode} />
      <ErrorBanner message={error} />
      {resent ? (
        <p className="text-xs font-semibold text-emerald-600">
          {pick(lang, 'A new code was sent.', 'تم إرسال رمز جديد.')}
        </p>
      ) : null}

      <OtpInput value={code} onChange={setCode} onComplete={verify} disabled={busy} />

      <Button
        type="button"
        className="w-full"
        disabled={busy || code.length !== 6}
        onClick={() => verify(code)}
      >
        {busy ? <Spinner className="!text-white" /> : null}
        {pick(lang, 'Verify and sign in', 'تحقق وسجّل الدخول')}
      </Button>

      <p className="text-center text-xs text-ink-500">
        {pick(lang, "Didn't get it?", 'لم يصلك الرمز؟')}{' '}
        <button
          type="button"
          onClick={resend}
          disabled={resending}
          className="link disabled:opacity-50"
        >
          {resending ? pick(lang, 'Sending…', 'جارٍ الإرسال…') : pick(lang, 'Resend code', 'أعد إرسال الرمز')}
        </button>
      </p>
    </div>
  );
}
