'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { Icon } from '@/components/ui/icons';

// Shows the mock OTP returned by request-otp so the dev build is testable
// without SMS delivery.
export function DevCodeHint({ code }: { code: string }) {
  const { lang } = useLanguage();
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gold-400/60 bg-gold-300/20 px-4 py-3 text-xs leading-relaxed text-gold-700">
      <Icon name="warn" className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        <span className="font-bold">{pick(lang, 'Development build', 'نسخة تطوير')}</span>
        {' — '}
        {pick(lang, `code is ${code}`, `الرمز هو ${code}`)}
      </span>
    </div>
  );
}
