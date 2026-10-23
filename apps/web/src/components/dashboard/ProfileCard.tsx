'use client';

import React, { useState } from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import type { CitizenProfile } from '@/lib/types';
import { fmtDate } from '@/lib/format';
import { Button, Card, StatusPill } from '@/components/ui';
import { statusLabel } from './labels';
import { EditProfileModal } from './EditProfileModal';

export function ProfileCard({
  citizen,
  onSaved,
}: {
  citizen: CitizenProfile;
  onSaved: (c: CitizenProfile) => void;
}) {
  const { lang } = useLanguage();
  const [editing, setEditing] = useState(false);

  const fullName = `${pick(lang, citizen.firstName, citizen.firstNameAr)} ${pick(
    lang,
    citizen.lastName,
    citizen.lastNameAr,
  )}`;
  const altName =
    lang === 'ar'
      ? `${citizen.firstName} ${citizen.lastName}`
      : `${citizen.firstNameAr} ${citizen.lastNameAr}`;
  const initials = `${citizen.firstName[0] ?? ''}${citizen.lastName[0] ?? ''}`.toUpperCase();

  const rows: { label: string; value: React.ReactNode; ltr?: boolean }[] = [
    { label: pick(lang, 'National ID', 'الرقم الوطني'), value: citizen.nin, ltr: true },
    { label: pick(lang, 'Municipality', 'البلدية'), value: citizen.municipality },
    { label: pick(lang, 'Phone', 'الهاتف'), value: citizen.phone, ltr: true },
    { label: pick(lang, 'Email', 'البريد الإلكتروني'), value: citizen.email ?? '—', ltr: true },
    { label: pick(lang, 'Address', 'العنوان'), value: citizen.address },
    {
      label: pick(lang, 'Registered', 'تاريخ التسجيل'),
      value: fmtDate(citizen.registeredAt, lang),
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-lg font-bold text-white">
            {initials}
          </span>
          <div>
            <p className="text-lg font-bold text-ink-900">{fullName}</p>
            <p className="text-sm text-ink-500">{altName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={citizen.ekycStatus} label={statusLabel(lang, citizen.ekycStatus)} />
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            {pick(lang, 'Edit profile', 'تعديل الملف')}
          </Button>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-ink-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">{r.label}</dt>
            <dd className="mt-1 text-sm font-medium text-ink-800" dir={r.ltr ? 'ltr' : undefined}>
              <span className={r.ltr ? 'inline-block' : undefined}>{r.value}</span>
            </dd>
          </div>
        ))}
      </dl>

      <EditProfileModal
        open={editing}
        onClose={() => setEditing(false)}
        citizen={citizen}
        onSaved={onSaved}
      />
    </Card>
  );
}
