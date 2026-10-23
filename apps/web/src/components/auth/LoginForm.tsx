'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { IdentityStep } from './IdentityStep';
import { OtpVerifyStep } from './OtpVerifyStep';

interface OtpCtx {
  nin: string;
  phone: string;
  otpId: string;
  devCode: string;
}

export function LoginForm() {
  const { lang } = useLanguage();
  const { requestOtp } = useAuth();
  const [ctx, setCtx] = useState<OtpCtx | null>(null);

  if (ctx) {
    return (
      <OtpVerifyStep
        nin={ctx.nin}
        phone={ctx.phone}
        otpId={ctx.otpId}
        devCode={ctx.devCode}
        onEdit={() => setCtx(null)}
      />
    );
  }

  return (
    <IdentityStep
      submitLabel={pick(lang, 'Send code', 'أرسل الرمز')}
      onSubmit={async (nin, phone) => {
        const r = await requestOtp(nin, phone);
        setCtx({ nin, phone, otpId: r.otpId, devCode: r.devCode });
      }}
    />
  );
}
