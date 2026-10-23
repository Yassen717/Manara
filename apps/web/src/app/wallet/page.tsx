'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState, PageHeader, SectionTitle, Skeleton, SkeletonCard } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import type { Entitlement, Transaction, Wallet } from '@/lib/types';
import { BalanceHero } from '@/components/money/BalanceHero';
import { EntitlementCard } from '@/components/money/EntitlementCard';
import { TransactionList } from '@/components/money/TransactionList';

export default function WalletPage() {
  const { token, ready } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlement[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .wallet(token)
      .then((w) => alive && setWallet(w))
      .catch(() => alive && setWallet(null));
    api
      .entitlements(token)
      .then((e) => alive && setEntitlements(e))
      .catch(() => alive && setEntitlements([]));
    api
      .transactions(token)
      .then((t) => alive && setTransactions(t))
      .catch(() => alive && setTransactions([]));
    return () => {
      alive = false;
    };
  }, [token]);

  if (!ready || !token) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={pick(lang, 'Wallet', 'المحفظة')}
        subtitle={pick(
          lang,
          'Your balance, entitlements and every payment in one place.',
          'رصيدك ومستحقاتك وكل عملياتك في مكان واحد.',
        )}
      />
      <div className="container-page space-y-10 py-8">
        {wallet ? (
          <BalanceHero wallet={wallet} />
        ) : (
          <Skeleton className="h-44 w-full rounded-2xl" />
        )}

        <section>
          <SectionTitle
            title={pick(lang, 'Entitlements', 'المستحقات')}
            subtitle={pick(
              lang,
              'Salaries, grants and subsidies owed to you — tap one to see its payment history.',
              'الرواتب والمنح والإعانات المستحقة لك — اضغط على أي منها لعرض سجل الدفعات.',
            )}
          />
          {entitlements === null ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : entitlements.length === 0 ? (
            <EmptyState
              title={pick(lang, 'No entitlements', 'لا مستحقات')}
              hint={pick(
                lang,
                'When the state owes you a salary, grant or subsidy it will show up here.',
                'عندما تستحق لك الدولة راتباً أو منحة أو إعانة ستظهر هنا.',
              )}
            />
          ) : (
            <div className="space-y-3">
              {entitlements.map((e) => (
                <EntitlementCard key={e.id} entitlement={e} token={token} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionTitle
            title={pick(lang, 'Transactions', 'العمليات')}
            subtitle={pick(lang, 'Money in and out of your wallet.', 'حركة الأموال في محفظتك.')}
          />
          {transactions === null ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              title={pick(lang, 'No transactions yet', 'لا عمليات بعد')}
              hint={pick(
                lang,
                'Payments you make — like utility bills — are recorded here.',
                'المدفوعات التي تجريها — مثل فواتير المرافق — تُسجل هنا.',
              )}
            />
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </section>
      </div>
    </>
  );
}
