'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { Spinner } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { ready, token } = useAuth();

  useEffect(() => {
    if (ready && token) router.replace('/dashboard');
  }, [ready, token, router]);

  if (!ready || token) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <AuthShell
      title={pick(lang, 'Create your account', 'أنشئ حسابك')}
      subtitle={pick(
        lang,
        'A few details, then a one-time code by SMS.',
        'بضع تفاصيل، ثم رمز لمرة واحدة عبر الرسائل القصيرة.',
      )}
      footer={
        <>
          {pick(lang, 'Already registered?', 'لديك حساب بالفعل؟')}{' '}
          <Link href="/login" className="link">
            {pick(lang, 'Sign in', 'تسجيل الدخول')}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
