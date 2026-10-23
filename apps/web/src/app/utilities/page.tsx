'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  EmptyState,
  FieldLabel,
  PageHeader,
  Select,
  SkeletonCard,
  Tabs,
} from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import { api } from '@/lib/api';
import type { Bill, OutageSchedule, Region } from '@/lib/types';
import { BillCard } from '@/components/money/BillCard';
import { OutageTable } from '@/components/status/OutageTable';

type TabId = 'bills' | 'outages';
type UtilityFilter = 'electricity' | 'water' | 'telecom';

const UTILITY_TABS: { id: UtilityFilter; en: string; ar: string }[] = [
  { id: 'electricity', en: 'Electricity', ar: 'الكهرباء' },
  { id: 'water', en: 'Water', ar: 'المياه' },
  { id: 'telecom', en: 'Telecom', ar: 'الاتصالات' },
];

function UtilitiesBrowser() {
  const { token, ready } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTab: TabId = searchParams.get('tab') === 'outages' ? 'outages' : 'bills';

  const [tab, setTab] = useState<TabId>(paramTab);

  // bills state
  const [bills, setBills] = useState<Bill[] | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidNote, setPaidNote] = useState(false);
  const [payError, setPayError] = useState('');

  // outages state
  const [regions, setRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState('');
  const [utility, setUtility] = useState<UtilityFilter>('electricity');
  const [outages, setOutages] = useState<OutageSchedule[] | null>(null);

  useEffect(() => {
    setTab(paramTab);
  }, [paramTab]);

  useEffect(() => {
    if (ready && !token) router.replace('/login');
  }, [ready, token, router]);

  const loadBills = (t: string) =>
    api
      .bills(t)
      .then(setBills)
      .catch(() => setBills([]));

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .bills(token)
      .then((b) => alive && setBills(b))
      .catch(() => alive && setBills([]));
    api
      .regions()
      .then((r) => alive && setRegions(r))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token || tab !== 'outages') return;
    let alive = true;
    setOutages(null);
    api
      .outages({ region: region || undefined, utility })
      .then((o) => alive && setOutages(o))
      .catch(() => alive && setOutages([]));
    return () => {
      alive = false;
    };
  }, [token, tab, region, utility]);

  const pay = async (id: string) => {
    if (!token || payingId) return;
    setPayingId(id);
    setPaidNote(false);
    setPayError('');
    try {
      await api.payUtilityBill(id, token);
      await loadBills(token);
      setPaidNote(true);
    } catch (e) {
      setPayError(
        e instanceof Error ? e.message : pick(lang, 'Payment failed.', 'فشل الدفع.'),
      );
    } finally {
      setPayingId(null);
    }
  };

  if (!ready || !token) {
    return (
      <div className="container-page py-10">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={pick(lang, 'Utilities', 'المرافق')}
        subtitle={pick(
          lang,
          'Pay electricity, water, telecom and gas bills — and see planned outage windows before the lights go out.',
          'ادفع فواتير الكهرباء والمياه والاتصالات والغاز — واطّلع على فترات الانقطاع المخطط لها قبل أن تنطفئ الأنوار.',
        )}
      />
      <div className="container-page space-y-6 py-8">
        <Tabs<TabId>
          tabs={[
            { id: 'bills', label: pick(lang, 'Bills', 'الفواتير') },
            { id: 'outages', label: pick(lang, 'Outage schedules', 'جداول الانقطاع') },
          ]}
          active={tab}
          onChange={setTab}
        />

        {tab === 'bills' ? (
          <section>
            {paidNote ? (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                <Icon name="check" className="h-4 w-4 shrink-0" />
                {pick(
                  lang,
                  'Paid · transaction recorded in wallet',
                  'تم الدفع · سُجلت العملية في المحفظة',
                )}
              </div>
            ) : null}
            {payError ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {payError}
              </div>
            ) : null}

            {bills === null ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : bills.length === 0 ? (
              <EmptyState
                title={pick(lang, 'No bills', 'لا فواتير')}
                hint={pick(
                  lang,
                  'When a utility issues you a bill it lands here, ready to pay in one tap.',
                  'عندما تصدر لك شركة مرافق فاتورة ستصل هنا جاهزة للدفع بضغطة واحدة.',
                )}
              />
            ) : (
              <div className="space-y-3">
                {bills.map((b) => (
                  <BillCard key={b.id} bill={b} paying={payingId === b.id} onPay={pay} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="mb-5 flex flex-wrap items-end gap-4">
              <div className="w-full sm:w-64">
                <FieldLabel>{pick(lang, 'Region', 'المنطقة')}</FieldLabel>
                <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">{pick(lang, 'All regions', 'كل المناطق')}</option>
                  {regions.map((r) => (
                    <option key={r.name} value={r.name}>
                      {pick(lang, r.name, r.nameAr)}
                    </option>
                  ))}
                </Select>
              </div>
              <Tabs<UtilityFilter>
                tabs={UTILITY_TABS.map((u) => ({ id: u.id, label: pick(lang, u.en, u.ar) }))}
                active={utility}
                onChange={setUtility}
              />
            </div>

            {outages === null ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <OutageTable rows={outages} />
            )}
          </section>
        )}
      </div>
    </>
  );
}

export default function UtilitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page space-y-3 py-10">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      }
    >
      <UtilitiesBrowser />
    </Suspense>
  );
}
