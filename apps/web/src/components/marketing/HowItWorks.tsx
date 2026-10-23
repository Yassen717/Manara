'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { SectionTitle } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const STEPS: { icon: string; title: [string, string]; desc: [string, string] }[] = [
  {
    icon: 'id',
    title: ['Sign in with National ID + OTP', 'سجّل بالرقم الوطني ورمز التحقق'],
    desc: [
      'Your national number and a one-time SMS code — no new passwords, no paperwork.',
      'رقمك الوطني ورمز لمرة واحدة عبر رسالة نصية — بلا كلمات مرور وبلا أوراق.',
    ],
  },
  {
    icon: 'send',
    title: ['Apply, renew or report online', 'قدّم، جدّد أو أبلغ أونلاين'],
    desc: [
      'Forms are pre-filled from your verified profile — most take under five minutes.',
      'النماذج تُملأ تلقائيًا من ملفك الموثّق — ومعظمها يستغرق أقل من خمس دقائق.',
    ],
  },
  {
    icon: 'bell',
    title: ['Track status & get notified', 'تابع الحالة واستقبل الإشعارات'],
    desc: [
      'Every request has a live status line and a reference number — SMS updates included.',
      'لكل طلب رقم مرجعي وحالة محدّثة لحظة بلحظة — مع إشعارات بالرسائل النصية.',
    ],
  },
];

export function HowItWorks() {
  const { lang } = useLanguage();
  return (
    <section className="container-page py-14 sm:py-16">
      <SectionTitle
        title={pick(lang, 'How it works', 'كيف تعمل منارة')}
        subtitle={pick(
          lang,
          'Three steps. No office visit required.',
          'ثلاث خطوات فقط — دون زيارة أي مكتب.',
        )}
      />
      <div className="relative">
        <div className="absolute inset-x-16 top-7 hidden border-t-2 border-dashed border-primary-200 md:block" />
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="relative flex animate-fade-up flex-col items-center text-center"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-700 text-xl font-extrabold text-white shadow-lift">
                  {i + 1}
                </span>
                <span className="absolute -bottom-1.5 -end-1.5 flex h-7 w-7 items-center justify-center rounded-lg border border-ink-100 bg-white text-primary-700 shadow-card">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-ink-900">
                {pick(lang, s.title[0], s.title[1])}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">
                {pick(lang, s.desc[0], s.desc[1])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
