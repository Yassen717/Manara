'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { Button, FieldLabel, Input } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { IdentityStep } from './IdentityStep';
import { OtpVerifyStep } from './OtpVerifyStep';

type Step = 'name' | 'identity' | 'otp';

interface OtpCtx {
  nin: string;
  phone: string;
  otpId: string;
  devCode: string;
}

// Registration = optional name collection, then the same OTP flow as login.
// The mock backend accepts any NIN; copy below explains a real eKYC check
// would plug in at this point.
export function RegisterForm() {
  const { lang } = useLanguage();
  const { requestOtp } = useAuth();
  const [step, setStep] = useState<Step>('name');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [ctx, setCtx] = useState<OtpCtx | null>(null);

  if (step === 'otp' && ctx) {
    return (
      <OtpVerifyStep
        nin={ctx.nin}
        phone={ctx.phone}
        otpId={ctx.otpId}
        devCode={ctx.devCode}
        onEdit={() => setStep('identity')}
      />
    );
  }

  if (step === 'identity') {
    return (
      <IdentityStep
        submitLabel={pick(lang, 'Send code', 'أرسل الرمز')}
        topNote={
          nameEn || nameAr ? (
            <p className="rounded-xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800">
              {pick(lang, 'Welcome', 'مرحبًا')}{' '}
              {pick(lang, nameEn || nameAr, nameAr || nameEn)} —{' '}
              {pick(lang, 'one more step.', 'خطوة أخرى فقط.')}
            </p>
          ) : undefined
        }
        onSubmit={async (nin, phone) => {
          const r = await requestOtp(nin, phone);
          setCtx({ nin, phone, otpId: r.otpId, devCode: r.devCode });
          setStep('otp');
        }}
      />
    );
  }

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setStep('identity');
      }}
    >
      <div className="flex items-start gap-2.5 rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-3 text-xs leading-relaxed text-primary-800">
        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          {pick(
            lang,
            'Mock registration: any National ID is accepted and a profile is created on the fly. A real eKYC identity check would plug in at this step.',
            'تسجيل تجريبي: يُقبل أي رقم وطني وتُنشأ صفحة شخصية تلقائيًا. سيُدمج هنا لاحقًا فحص حقيقي للتحقق من الهوية (eKYC).',
          )}
        </span>
      </div>

      <div>
        <FieldLabel hint={pick(lang, 'optional', 'اختياري')}>
          {pick(lang, 'Full name', 'الاسم الكامل')}
        </FieldLabel>
        <Input
          autoComplete="name"
          placeholder={pick(lang, 'Ahmed Al-Mansouri', 'Ahmed Al-Mansouri')}
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
      </div>

      <div dir="rtl">
        <FieldLabel hint={pick(lang, 'optional', 'اختياري')}>الاسم الكامل بالعربية</FieldLabel>
        <Input
          autoComplete="off"
          placeholder="أحمد المنصوري"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        {pick(lang, 'Continue', 'متابعة')}
      </Button>
    </form>
  );
}
