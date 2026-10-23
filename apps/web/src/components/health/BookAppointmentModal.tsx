'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage, pick } from '@/lib/i18n';
import type { Appointment, Facility } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/Spinner';

const DEPARTMENTS: { value: string; en: string; ar: string }[] = [
  { value: 'Emergency', en: 'Emergency', ar: 'الطوارئ' },
  { value: 'Dialysis', en: 'Dialysis', ar: 'غسيل الكلى' },
  { value: 'Cardiology', en: 'Cardiology', ar: 'القلب' },
  { value: 'Maternity', en: 'Maternity', ar: 'الأمومة والولادة' },
  { value: 'Pediatrics', en: 'Pediatrics', ar: 'الأطفال' },
  { value: 'Oncology', en: 'Oncology', ar: 'الأورام' },
  { value: 'General', en: 'General', ar: 'عيادة عامة' },
];

export function BookAppointmentModal({
  facility,
  onClose,
  onBooked,
}: {
  facility: Facility | null;
  onClose: () => void;
  onBooked: (appt: Appointment) => void;
}) {
  const { lang } = useLanguage();
  const { token, ready } = useAuth();
  const [department, setDepartment] = useState(DEPARTMENTS[0].value);
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booked, setBooked] = useState<Appointment | null>(null);

  // Reset the form whenever a different facility is targeted.
  useEffect(() => {
    setDepartment(DEPARTMENTS[0].value);
    setDate('');
    setError('');
    setBooked(null);
    setSubmitting(false);
  }, [facility]);

  const today = new Date().toISOString().slice(0, 10);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!facility || !token || !date) return;
    setSubmitting(true);
    setError('');
    try {
      const appt = await api.bookAppointment(
        { facilityId: facility.id, department, preferredDate: date },
        token,
      );
      setBooked(appt);
      onBooked(appt);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : pick(lang, 'Booking failed. Please try again.', 'فشل الحجز. حاول مرة أخرى.'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={!!facility}
      onClose={onClose}
      title={pick(lang, 'Book an appointment', 'حجز موعد')}
    >
      {facility ? (
        <div>
          <div className="mb-4 rounded-xl bg-primary-50 px-4 py-3">
            <p className="text-sm font-bold text-primary-800">
              {pick(lang, facility.name, facility.nameAr)}
            </p>
            <p className="text-xs text-primary-700/80">
              {pick(lang, facility.nameAr, facility.name)} · {facility.municipality}
            </p>
          </div>

          {booked ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" className="h-5 w-5" />
              </div>
              <p className="font-bold text-emerald-800">
                {pick(lang, 'Appointment booked', 'تم حجز الموعد')}
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                {pick(lang, 'Reference', 'المرجع')}:{' '}
                <span className="font-mono font-bold" dir="ltr">
                  {booked.reference}
                </span>
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                {pick(
                  lang,
                  'Track it any time under “My appointments”.',
                  'يمكنك متابعته في أي وقت ضمن «مواعيدي».',
                )}
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={onClose}>
                {pick(lang, 'Done', 'تم')}
              </Button>
            </div>
          ) : !ready ? (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          ) : !token ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p className="font-semibold text-amber-800">
                {pick(lang, 'Sign in required', 'تسجيل الدخول مطلوب')}
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {pick(
                  lang,
                  'Booking an appointment needs a verified Manara identity. Browsing facilities stays free.',
                  'حجز الموعد يتطلب هوية منارة موثّقة. تصفّح المرافق متاح للجميع.',
                )}
              </p>
              <Link href="/login" className="btn-primary mt-4 inline-flex">
                {pick(lang, 'Sign in', 'تسجيل الدخول')}
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <FieldLabel>{pick(lang, 'Department', 'القسم')}</FieldLabel>
                <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {pick(lang, d.en, d.ar)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <FieldLabel hint={pick(lang, 'subject to confirmation', 'قابل للتأكيد')}>
                  {pick(lang, 'Preferred date', 'التاريخ المفضل')}
                </FieldLabel>
                <Input
                  type="date"
                  min={today}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              {error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={onClose}>
                  {pick(lang, 'Cancel', 'إلغاء')}
                </Button>
                <Button type="submit" disabled={submitting || !date}>
                  {submitting ? <Spinner className="h-4 w-4 text-white" /> : null}
                  {pick(lang, 'Confirm booking', 'تأكيد الحجز')}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
