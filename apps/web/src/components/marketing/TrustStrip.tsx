'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { Card, SectionTitle } from '@/components/ui';
import { Icon } from '@/components/ui/icons';

const TRUST: { icon: string; title: [string, string]; desc: [string, string] }[] = [
  {
    icon: 'shield',
    title: ['Identity-verified (eKYC)', 'هوية موثّقة (تحقق إلكتروني)'],
    desc: [
      'One verified citizen per account — no forged paper trail.',
      'حساب واحد لكل مواطن موثّق — بلا مستندات مزوّرة.',
    ],
  },
  {
    icon: 'globe',
    title: ['Anywhere-issuance', 'إصدار من أي مكان'],
    desc: [
      'Documents issued wherever you are — no “return to your birthplace”.',
      'تُصدر مستنداتك أينما كنت — بلا “ارجع إلى مسقط رأسك”.',
    ],
  },
  {
    icon: 'check',
    title: ['No discretionary queues', 'بلا طوابير ولا واسطة'],
    desc: [
      'Transparent digital queues replace name-lists and middlemen.',
      'قوائم انتظار رقمية شفافة بدل قوائم الأسماء والوسطاء.',
    ],
  },
  {
    icon: 'signal',
    title: ['Works offline & SMS-ready', 'يعمل دون اتصال وعبر SMS'],
    desc: [
      'Designed for blackouts — SMS and offline sync keep you moving.',
      'مصممة لانقطاع الكهرباء — الرسائل النصية والمزامنة اللاحقة تُبقيك متصلًا.',
    ],
  },
];

export function TrustStrip() {
  const { lang } = useLanguage();
  return (
    <section className="container-page pb-14 sm:pb-16">
      <SectionTitle
        title={pick(lang, 'Designed for Libya, not adapted to it', 'صُممت لليبيا — لم تُكيَّف معها')}
        subtitle={pick(
          lang,
          'Ground-up answers to how services actually fail here.',
          'إجابات صُممت من الصفر لطريقة تعطّل الخدمات فعليًا هنا.',
        )}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((f, i) => (
          <Card
            key={i}
            hover
            className="animate-fade-up p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-300/30 text-gold-700 ring-1 ring-gold-400/40">
              <Icon name={f.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-ink-900">
              {pick(lang, f.title[0], f.title[1])}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              {pick(lang, f.desc[0], f.desc[1])}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
