'use client';

import React from 'react';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtMoney } from '@/lib/format';
import type { Wallet } from '@/lib/types';

export function BalanceHero({ wallet }: { wallet: Wallet }) {
  const { lang } = useLanguage();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 p-6 text-white shadow-lift sm:p-8">
      <div className="pointer-events-none absolute -top-16 -end-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -start-12 h-44 w-44 rounded-full bg-gold-400/20" />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-primary-100">
            {pick(lang, 'Total balance', 'الرصيد الإجمالي')}
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
            {fmtMoney(wallet.balance, wallet.currency, lang)}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-primary-100">
            <Icon name="card" className="h-4 w-4" />
            <span dir="ltr" className="font-mono tracking-wider">
              •••• {wallet.cardLast4}
            </span>
          </p>
        </div>
        <div className="max-w-xs text-sm">
          <p className="text-primary-100">
            {pick(lang, 'Monthly limit', 'الحد الشهري')}:{' '}
            <span className="font-semibold text-white">
              {fmtMoney(wallet.monthlyLimit, wallet.currency, lang)}
            </span>
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-primary-200/90">
            {pick(
              lang,
              'This wallet rides digital payment rails — no queues, no cash runs.',
              'تعمل هذه المحفظة على قضبان الدفع الرقمية — بلا طوابير وبلا عناء السيولة.',
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
