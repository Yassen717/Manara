'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { Spinner } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
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
      title={pick(lang, 'Sign in to Manara', 'سجّل الدخول إلى منارة')}
      subtitle={pick(
        lang,
        'Use your National ID and phone number — no password needed.',
        'استخدم الرقم الوطني ورقم الهاتف — لا حاجة لكلمة مرور.',
      )}
      footer={
        <>
          {pick(lang, 'New to Manara?', 'جديد على منارة؟')}{' '}
          <Link href="/register" className="link">
            {pick(lang, 'Create your account', 'أنشئ حسابك')}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
