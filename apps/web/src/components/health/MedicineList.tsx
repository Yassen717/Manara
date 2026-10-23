'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type { MedicineStock } from '@/lib/types';
import { StatusPill } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icons';

const AVAILABILITY: Record<MedicineStock['availability'], { en: string; ar: string }> = {
  in_stock: { en: 'In stock', ar: 'متوفر' },
  low: { en: 'Low stock', ar: 'كمية محدودة' },
  out: { en: 'Out of stock', ar: 'غير متوفر' },
};

export function MedicineList() {
  const { lang } = useLanguage();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<MedicineStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .medicines(q || undefined)
        .then((data) => {
          if (alive) {
            setRows(data);
            setFailed(false);
          }
        })
        .catch(() => {
          if (alive) {
            setRows([]);
            setFailed(true);
          }
        })
        .finally(() => alive && setLoading(false));
    }, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q]);

  return (
    <section>
      <div className="relative mb-5 max-w-md">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-400">
          <Icon name="search" className="h-4 w-4" />
        </span>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={pick(
            lang,
            'Search medicine or generic name…',
            'ابحث عن دواء أو مادة فعالة…',
          )}
          className="!ps-9"
          aria-label={pick(lang, 'Search medicines', 'البحث في الأدوية')}
        />
      </div>

      {loading ? (
        <div className="card divide-y divide-ink-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-2 h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : failed ? (
        <EmptyState
          title={pick(lang, 'Unable to load stock data', 'تعذّر تحميل بيانات المخزون')}
          hint={pick(
            lang,
            'Medicine availability is unreachable right now. Please try again shortly.',
            'بيانات توفر الأدوية غير متاحة حاليًا. حاول مرة أخرى بعد قليل.',
          )}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No medicines found', 'لا توجد أدوية')}
          hint={pick(
            lang,
            'Try the generic name — e.g. “metformin” instead of a brand.',
            'جرّب الاسم العلمي — مثل «metformin» بدل الاسم التجاري.',
          )}
        />
      ) : (
        <div className="card divide-y divide-ink-100">
          {rows.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Icon name="plus" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink-900">{m.name}</p>
                <p className="text-sm text-ink-500" dir="ltr">
                  {m.genericName}
                </p>
              </div>
              <p className="text-xs font-semibold text-ink-500">
                {m.facilities.length > 0
                  ? pick(
                      lang,
                      `Available at ${m.facilities.length} ${
                        m.facilities.length === 1 ? 'facility' : 'facilities'
                      }`,
                      `متوفر في ${m.facilities.length} مرفق`,
                    )
                  : pick(lang, 'Not stocked anywhere right now', 'غير متوفر حاليًا في أي مرفق')}
              </p>
              <StatusPill
                status={m.availability}
                label={pick(lang, AVAILABILITY[m.availability].en, AVAILABILITY[m.availability].ar)}
              />
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-ink-400">
        {pick(
          lang,
          'Stock levels are indicative — confirm by phone before travelling.',
          'مستويات المخزون استرشادية — أكّد هاتفيًا قبل الانتقال.',
        )}
      </p>
    </section>
  );
}
