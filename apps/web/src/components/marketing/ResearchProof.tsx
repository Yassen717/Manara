'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { Card, SectionTitle } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const PROBLEMS: {
  icon: string;
  stat: [string, string];
  problem: [string, string];
  solution: [string, string];
}[] = [
  {
    icon: 'wallet',
    stat: ['LYD 1,000', '١,٠٠٠ د.ل'],
    problem: [
      'Daily bank withdrawal caps — cash runs out while you are still in the queue.',
      'سقف يومي للسحب من المصارف — والسيولة تنفد وأنت ما زلت في الطابور.',
    ],
    solution: ['Digital payments & a citizen wallet', 'مدفوعات رقمية ومحفظة للمواطن'],
  },
  {
    icon: 'shield',
    stat: ['315,000+', '+٣١٥,٠٠٠'],
    problem: [
      'Fraudulent national ID numbers found in the civil registry.',
      'رقم وطني مزوّر اكتُشف في السجل المدني.',
    ],
    solution: ['Biometric-verified eKYC identity', 'هوية موثّقة بالتحقق الإلكتروني'],
  },
  {
    icon: 'bolt',
    stat: ['12h+', '+١٢ ساعة'],
    problem: [
      'Daily power cuts — announced nowhere, tracked by no one.',
      'انقطاعات يومية للكهرباء — بلا إعلان وبلا متابعة.',
    ],
    solution: ['Outage tracking & restoration ETAs', 'تتبّع الأعطال ومواعيد عودة الخدمة'],
  },
  {
    icon: 'doc',
    stat: ['1 day/wk', 'يوم/أسبوع'],
    problem: [
      'Passport forms rationed to a single morning each week.',
      'نماذج الجوازات تُوزَّع في صباح يوم واحد كل أسبوع.',
    ],
    solution: ['Apply online anytime, issued anywhere', 'قدّم أونلاين في أي وقت واستلم من أي مكان'],
  },
];

export function ResearchProof() {
  const { lang } = useLanguage();
  return (
    <section className="border-y border-ink-100 bg-white py-14 sm:py-16">
      <div className="container-page">
        <SectionTitle
          title={pick(lang, 'Built from real research', 'مبنية على بحث ميداني حقيقي')}
          subtitle={pick(
            lang,
            'Every feature answers a documented problem Libyan citizens face today.',
            'كل ميزة هنا تجيب على مشكلة موثّقة يواجهها المواطن الليبي اليوم.',
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map((p, i) => (
            <Card
              key={i}
              hover
              className="flex animate-fade-up flex-col p-5"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">
                {pick(lang, p.stat[0], p.stat[1])}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {pick(lang, p.problem[0], p.problem[1])}
              </p>
              <div className="my-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-300">
                <span className="h-px flex-1 bg-ink-100" />
                {pick(lang, 'Manara answers', 'حلّ منارة')}
                <span className="h-px flex-1 bg-ink-100" />
              </div>
              <p className="mt-auto flex items-start gap-2 text-sm font-bold text-primary-700">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
                {pick(lang, p.solution[0], p.solution[1])}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
