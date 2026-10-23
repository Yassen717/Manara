'use client';

import React from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { SectionTitle } from '@/components/ui/Typography';
import { Stat } from '@/components/ui/Stat';
import { Icon } from '@/components/ui/icons';

const PRINCIPLES: { icon: string; en: [string, string]; ar: [string, string] }[] = [
  {
    icon: 'shield',
    en: ['Identity first', 'One verified NID anchors every service — biometric dedup and an audit trail end the market in forged IDs.'],
    ar: ['الهوية أولًا', 'رقم وطني موثق واحد يرسي كل خدمة — التحقق البيومتري وسجل التدقيق ينهيان سوق الهويات المزورة.'],
  },
  {
    icon: 'map',
    en: ['Anywhere issuance', 'Documents are re-issued where you are — not where the registry building used to stand.'],
    ar: ['الإصدار من أي مكان', 'تُعاد الوثائق حيث أنت — لا حيث كان مبنى السجل قائمًا.'],
  },
  {
    icon: 'check',
    en: ['No discretionary touchpoints', 'Appointments, status trackers and e-payment remove every manual gate a bribe could hide behind.'],
    ar: ['بلا بوابات تقديرية', 'المواعيد وتتبع الحالة والدفع الإلكتروني يزيلون كل بوابة يدوية يمكن أن تختبئ وراءها رشوة.'],
  },
  {
    icon: 'phone',
    en: ['Offline-first & SMS', 'Designed for 36-hour blackouts and shutdowns: SMS/USSD fallback, offline sync, QR-verifiable documents.'],
    ar: ['يعمل دون اتصال وعبر الرسائل', 'مصمم لانقطاعات ٣٦ ساعة وحجب الإنترنت: بدائل رسائل/USSD ومزامنة دون اتصال ووثائق قابلة للتحقق عبر QR.'],
  },
  {
    icon: 'building',
    en: ['Built for two administrations', 'A federated architecture — shared ID namespace, region-scoped service nodes, no single point to seize.'],
    ar: ['مصمم لإدارتين', 'بنية اتحادية — فضاء هوية مشترك وعقد خدمات إقليمية، بلا نقطة واحدة يمكن الاستيلاء عليها.'],
  },
];

const MAPPING: { icon: string; en: [string, string]; ar: [string, string] }[] = [
  {
    icon: 'clock',
    en: ['Dawn queues & rationed forms', 'Bookable appointments with a reference number — the queue is a schedule, not a crowd.'],
    ar: ['طوابير الفجر ونماذج مُرشّنة', 'مواعيد قابلة للحجز برقم مرجعي — الطابور جدول زمني لا حشد.'],
  },
  {
    icon: 'people',
    en: ['Wasta & broker gatekeeping', 'An audited digital trail — every action logged, nobody to “know” because there is no side door.'],
    ar: ['الواسطة وسماسرة البوابات', 'سجل رقمي قابل للتدقيق — كل إجراء موثّق، ولا أحد “تعرفه” لأن الباب الخلفي غير موجود.'],
  },
  {
    icon: 'wallet',
    en: ['Cash crisis, unbanked citizens', 'A wallet riding payment rails Libyans already trust — LYPay, Sadad, agent cash-in/out.'],
    ar: ['أزمة سيولة ومواطنون بلا حسابات', 'محفظة تعمل على قنوات دفع يثق بها الليبيون أصلًا — LYPay وصدد ونقاط صرافة.'],
  },
  {
    icon: 'signal',
    en: ['Blackout uncertainty', 'A national status board with outage schedules — transparency as a service, not a Facebook rumor.'],
    ar: ['غموض انقطاع الكهرباء', 'لوحة حالة وطنية بجداول الانقطاع — الشفافية خدمة، لا إشاعة على فيسبوك.'],
  },
  {
    icon: 'doc',
    en: ['Document loss & “return to origin”', 'Anywhere re-issuance with QR-verified digital copies — Derna survivors, IDPs and the diaspora included.'],
    ar: ['فقدان الوثائق و«عُد لموطنك»', 'إعادة إصدار من أي مكان بنسخ رقمية موثقة عبر QR — يشمل ناجي درنة والنازحين والمغتربين.'],
  },
];

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-primary-900/20 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="container-page py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            {pick(lang, 'منارة · Manara', 'منارة · Manara')}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {pick(lang, 'Why Manara exists', 'لماذا وُجدت منارة')}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-50/90 sm:text-lg">
            {pick(
              lang,
              'Libyans don’t lack connectivity — they lack services. People sleep at bank doors, queue at dawn for rationed forms, and pay brokers for what should be a right. Manara is one digital front-door where a verified identity, an appointment and a status tracker replace the queue, the bribe and the “come back tomorrow.”',
              'الليبيون لا ينقصهم الاتصال — بل تنقصهم الخدمات. الناس تنام أمام أبواب المصارف، وتصطف فجرًا للحصول على نماذج مُرشّنة، وتدفع للسماسرة مقابل ما يفترض أن يكون حقًا. منارة بوابة رقمية واحدة تحل فيها الهوية الموثقة والموعد وتتبع الحالة محل الطابور والرشوة و«عُد غدًا».',
            )}
          </p>
          <p className="mt-4 max-w-2xl border-s-2 border-gold-400 ps-4 text-sm italic text-primary-100/90">
            {pick(
              lang,
              '“The pipes exist; the services don’t.” — the core finding of the research behind this platform.',
              '«البنية التحتية موجودة؛ الخدمات هي الغائبة.» — الخلاصة الجوهرية للبحث الذي بُنيت عليه هذه المنصة.',
            )}
          </p>
        </div>
      </section>

      {/* Stat band */}
      <section className="container-page py-10">
        <SectionTitle
          title={pick(lang, 'Built on documented reality', 'مبنية على واقع موثّق')}
          subtitle={pick(
            lang,
            'Every feature answers a problem recorded in libya-problems.json — not a guess.',
            'كل ميزة تجيب على مشكلة موثقة في libya-problems.json — لا على تخمين.',
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            value="99"
            label={pick(lang, 'documented problems', 'مشكلة موثقة')}
            hint={pick(lang, '34 critical · 52 high · 13 medium', '٣٤ حرجة · ٥٢ عالية · ١٣ متوسطة')}
            accent
          />
          <Stat
            value="15"
            label={pick(lang, 'service domains mapped', 'مجال خدمة مُغطى')}
            hint={pick(
              lang,
              'identity → utilities → justice',
              'من الهوية إلى المرافق إلى العدل',
            )}
          />
          <Stat
            value="5+"
            label={pick(lang, 'global outlets + UN, IMF & WHO sources', 'مصدر عالمي + الأمم المتحدة وصندوق النقد والصحة العالمية')}
            hint={pick(
              lang,
              'Reuters, AFP, AP, The Guardian, Al Jazeera & more',
              'رويترز، فرانس برس، أسوشييتد برس، الغارديان، الجزيرة وغيرها',
            )}
          />
          <Stat
            value="0.08"
            label={pick(lang, 'UN Online Service Index / 1.0', 'مؤشر الأمم المتحدة للخدمات / ١٫٠')}
            hint={pick(
              lang,
              'despite ~88.5% internet penetration — a services gap, not an infrastructure gap',
              'رغم نفاذ إنترنت ~٨٨٫٥٪ — فجوة خدمات لا فجوة بنية تحتية',
            )}
          />
        </div>
      </section>

      {/* Design principles */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-page py-10">
          <SectionTitle
            title={pick(lang, 'Design principles', 'مبادئ التصميم')}
            subtitle={pick(
              lang,
              'Cross-cutting findings from 99 problems, distilled into five rules the whole platform obeys.',
              'نتائج عرضية استُخلصت من ٩٩ مشكلة وكُثّفت في خمس قواعد تلتزم بها المنصة كلها.',
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.en[0]} className="card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon name={p.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-bold text-ink-900">{pick(lang, p.en[0], p.ar[0])}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">
                  {pick(lang, p.en[1], p.ar[1])}
                </p>
              </div>
            ))}
            <div className="card flex items-center justify-center bg-primary-50/50 p-5 text-center">
              <p className="max-w-xs text-sm font-semibold text-primary-800">
                {pick(
                  lang,
                  'Plus: ride existing rails — NID–SIM binding, e-payment apps and Intilaqa already work.',
                  'وأيضًا: نبني على القنوات القائمة — ربط الشريحة بالرقم الوطني وتطبيقات الدفع ومشروع انطلاقة تعمل بالفعل.',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research → features mapping */}
      <section className="container-page py-10">
        <SectionTitle
          title={pick(lang, 'How research maps to features', 'كيف تتحول الأبحاث إلى ميزات')}
          subtitle={pick(
            lang,
            'Each row is a documented pain point and the Manara answer built into this portal.',
            'كل صف مشكلة موثقة وإجابة منارة المبنية في هذه البوابة.',
          )}
        />
        <div className="card overflow-hidden">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60 text-start">
                <th className="px-5 py-3 text-start text-xs font-bold uppercase tracking-wide text-ink-500">
                  {pick(lang, 'The problem on the ground', 'المشكلة على أرض الواقع')}
                </th>
                <th className="px-5 py-3 text-start text-xs font-bold uppercase tracking-wide text-ink-500">
                  {pick(lang, 'The Manara answer', 'إجابة منارة')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {MAPPING.map((m) => (
                <tr key={m.en[0]} className="align-top">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Icon name={m.icon} className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-ink-800">
                        {pick(lang, m.en[0], m.ar[0])}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-600">{pick(lang, m.en[1], m.ar[1])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech note */}
      <section className="container-page pb-12">
        <div className="card flex flex-col gap-4 border-primary-200 bg-primary-50/40 p-6 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-card">
            <Icon name="bolt" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-ink-900">
              {pick(lang, 'Built like a real ministry platform', 'مبنية كمنصة وزارة حقيقية')}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              {pick(
                lang,
                'Next.js 15 + Tailwind on the front, Nest.js 11 behind a Swagger-documented /api/v1 contract. All data today comes from mock providers that can be swapped for live ministry APIs without touching a controller — or this page.',
                'واجهة Next.js 15 مع Tailwind، وخلفها Nest.js 11 خلف عقد ‎/api/v1‎ موثّق عبر Swagger. كل البيانات اليوم من مزوّدات وهمية يمكن استبدالها بواجهات الوزارات الحقيقية دون لمس أي متحكّم — أو هذه الصفحة.',
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
