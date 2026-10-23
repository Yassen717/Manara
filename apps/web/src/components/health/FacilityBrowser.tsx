'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage, pick } from '@/lib/i18n';
import type { Appointment, Facility, Municipality } from '@/lib/types';
import { Badge, StatusPill } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Icon } from '@/components/ui/icons';
import { BookAppointmentModal } from './BookAppointmentModal';

const TYPE_LABELS: Record<Facility['type'], { en: string; ar: string }> = {
  hospital: { en: 'Hospital', ar: 'مستشفى' },
  clinic: { en: 'Clinic', ar: 'عيادة' },
  pharmacy: { en: 'Pharmacy', ar: 'صيدلية' },
  phc: { en: 'Primary care', ar: 'رعاية أولية' },
};

export const FACILITY_STATUS: Record<Facility['status'], { en: string; ar: string }> = {
  open: { en: 'Open', ar: 'مفتوح' },
  limited: { en: 'Limited service', ar: 'خدمة محدودة' },
  closed: { en: 'Closed', ar: 'مغلق' },
};

function FacilityCard({
  facility,
  onBook,
}: {
  facility: Facility;
  onBook: (f: Facility) => void;
}) {
  const { lang } = useLanguage();
  const shown = facility.services.slice(0, 4);
  return (
    <Card hover className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <Icon name={facility.type === 'pharmacy' ? 'plus' : 'health'} className="h-5 w-5" />
        </div>
        <StatusPill
          status={facility.status}
          label={pick(lang, FACILITY_STATUS[facility.status].en, FACILITY_STATUS[facility.status].ar)}
        />
      </div>
      <h3 className="mt-3 font-bold text-ink-900">{pick(lang, facility.name, facility.nameAr)}</h3>
      <p className="text-sm text-ink-500">{pick(lang, facility.nameAr, facility.name)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone="blue">
          {pick(lang, TYPE_LABELS[facility.type].en, TYPE_LABELS[facility.type].ar)}
        </Badge>
        <span className="text-xs font-semibold text-ink-500">{facility.municipality}</span>
        <span className="text-xs text-ink-400">· {facility.region}</span>
      </div>
      {facility.services.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shown.map((s) => (
            <span
              key={s}
              className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-600"
            >
              {s}
            </span>
          ))}
          {facility.services.length > shown.length ? (
            <span className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-semibold text-ink-500">
              +{facility.services.length - shown.length}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="mt-auto pt-4">
        <Button
          size="sm"
          variant={facility.status === 'closed' ? 'secondary' : 'primary'}
          disabled={facility.status === 'closed'}
          onClick={() => onBook(facility)}
          className="w-full"
        >
          {pick(lang, 'Book appointment', 'حجز موعد')}
        </Button>
      </div>
    </Card>
  );
}

export function FacilityBrowser({ onBooked }: { onBooked: (a: Appointment) => void }) {
  const { lang } = useLanguage();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [municipality, setMunicipality] = useState('');
  const [type, setType] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [booking, setBooking] = useState<Facility | null>(null);

  useEffect(() => {
    api
      .municipalities()
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]));
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .facilities({ municipality: municipality || undefined, type: type || undefined })
      .then((rows) => {
        if (alive) {
          setFacilities(rows);
          setFailed(false);
        }
      })
      .catch(() => {
        if (alive) {
          setFacilities([]);
          setFailed(true);
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [municipality, type]);

  return (
    <section>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
        <Select
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          aria-label={pick(lang, 'Municipality', 'البلدية')}
        >
          <option value="">{pick(lang, 'All municipalities', 'كل البلديات')}</option>
          {municipalities.map((m) => (
            <option key={m.name} value={m.name}>
              {pick(lang, m.name, m.nameAr)}
            </option>
          ))}
        </Select>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label={pick(lang, 'Facility type', 'نوع المرفق')}
        >
          <option value="">{pick(lang, 'All facility types', 'كل أنواع المرافق')}</option>
          {(Object.keys(TYPE_LABELS) as Facility['type'][]).map((k) => (
            <option key={k} value={k}>
              {pick(lang, TYPE_LABELS[k].en, TYPE_LABELS[k].ar)}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : failed ? (
        <EmptyState
          title={pick(lang, 'Unable to load facilities', 'تعذّر تحميل المرافق')}
          hint={pick(
            lang,
            'The health directory is unreachable right now. Please try again shortly.',
            'دليل المرافق الصحية غير متاح حاليًا. حاول مرة أخرى بعد قليل.',
          )}
        />
      ) : facilities.length === 0 ? (
        <EmptyState
          title={pick(lang, 'No facilities match', 'لا توجد مرافق مطابقة')}
          hint={pick(
            lang,
            'Try a different municipality or facility type.',
            'جرّب بلدية أو نوع مرفق مختلفًا.',
          )}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <FacilityCard key={f.id} facility={f} onBook={setBooking} />
          ))}
        </div>
      )}

      <BookAppointmentModal
        facility={booking}
        onClose={() => setBooking(null)}
        onBooked={onBooked}
      />
    </section>
  );
}
