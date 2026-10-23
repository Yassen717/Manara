'use client';

import React from 'react';
import { StatusPill } from '@/components/ui';
import { Icon } from '@/components/ui/icons';
import { useLanguage, pick } from '@/lib/i18n';
import { fmtDate } from '@/lib/format';
import type { DigitalDocument } from '@/lib/types';
import { FakeQr } from './FakeQr';

// Per-type accent: icon + gradient strip, like the colored band on a real
// e-document. Matches by keyword since `type` is a free-form API string.
function docStyle(type: string): { icon: string; strip: string } {
  const s = type.toLowerCase();
  if (s.includes('passport')) return { icon: 'passport', strip: 'from-primary-800 to-primary-600' };
  if (s.includes('national') || s.includes('_id') || s === 'id')
    return { icon: 'id', strip: 'from-ink-800 to-ink-600' };
  if (s.includes('driving') || s.includes('license') || s.includes('licence'))
    return { icon: 'card', strip: 'from-gold-600 to-gold-400' };
  if (s.includes('criminal') || s.includes('record'))
    return { icon: 'shield', strip: 'from-sky-800 to-sky-600' };
  if (s.includes('birth')) return { icon: 'doc', strip: 'from-emerald-700 to-emerald-500' };
  if (s.includes('marriage')) return { icon: 'people', strip: 'from-rose-700 to-rose-500' };
  if (s.includes('death')) return { icon: 'doc', strip: 'from-ink-700 to-ink-500' };
  return { icon: 'doc', strip: 'from-primary-700 to-primary-500' };
}

export function DocumentCard({ doc, fresh = false }: { doc: DigitalDocument; fresh?: boolean }) {
  const { lang, t } = useLanguage();
  const style = docStyle(doc.type);

  return (
    <article
      className={`card overflow-hidden ${fresh ? 'animate-fade-up ring-2 ring-primary-300' : ''}`}
    >
      <div
        className={`flex items-center justify-between bg-gradient-to-r px-5 py-3 text-white ${style.strip}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Icon name={style.icon} className="h-5 w-5 shrink-0" />
          <span className="truncate text-sm font-bold">
            {pick(lang, doc.type, doc.typeAr)}
          </span>
        </div>
        {fresh ? (
          <span className="chip shrink-0 bg-white/20 text-white ring-1 ring-white/30">
            {t('common.new')}
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-400">
              {pick(lang, 'Holder', 'حامل المستند')}
            </p>
            <p className="truncate font-semibold text-ink-900">{doc.holderName}</p>
            <p className="mt-0.5 font-mono text-xs text-ink-500">{doc.reference}</p>
          </div>
          <StatusPill status={doc.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium text-ink-400">
              {pick(lang, 'Issued', 'تاريخ الإصدار')}
            </dt>
            <dd className="mt-0.5 font-medium text-ink-800">{fmtDate(doc.issuedAt, lang)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-ink-400">
              {pick(lang, 'Expires', 'تاريخ الانتهاء')}
            </dt>
            <dd className="mt-0.5 font-medium text-ink-800">
              {doc.expiresAt ? fmtDate(doc.expiresAt, lang) : pick(lang, 'No expiry', 'بلا انتهاء')}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-ink-200 bg-sand-50 p-3">
          <FakeQr seed={`${doc.id}|${doc.qrPayload}`} className="h-14 w-14 shrink-0 text-ink-900" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink-700">
              {pick(lang, 'Scan to verify', 'امسح للتحقق')}
            </p>
            <p className="truncate font-mono text-[10px] text-ink-400" title={doc.qrPayload}>
              {doc.qrPayload}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
