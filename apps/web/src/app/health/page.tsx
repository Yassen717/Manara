'use client';

import React, { useState } from 'react';
import { useLanguage, pick } from '@/lib/i18n';
import { PageHeader } from '@/components/ui/Typography';
import { Tabs } from '@/components/ui/Tabs';
import { AppointmentList } from '@/components/health/AppointmentList';
import { FacilityBrowser } from '@/components/health/FacilityBrowser';
import { MedicineList } from '@/components/health/MedicineList';

type TabId = 'facilities' | 'medicines' | 'appointments';

export default function HealthPage() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<TabId>('facilities');
  // Bumped after a successful booking so the appointments list refetches.
  const [apptVersion, setApptVersion] = useState(0);

  return (
    <div>
      <PageHeader
        title={pick(lang, 'Health services', 'الخدمات الصحية')}
        subtitle={pick(
          lang,
          'Find open facilities, check medicine stock before you travel, and book appointments without queuing at dawn.',
          'اعثر على المرافق المفتوحة، وتحقق من توفر الأدوية قبل السفر، واحجز موعدك دون طوابير الفجر.',
        )}
      />
      <div className="container-page py-8">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'facilities', label: pick(lang, 'Facilities', 'المرافق') },
            { id: 'medicines', label: pick(lang, 'Medicine availability', 'توفر الأدوية') },
            { id: 'appointments', label: pick(lang, 'My appointments', 'مواعيدي') },
          ]}
        />
        <div className="mt-6">
          {tab === 'facilities' ? (
            <FacilityBrowser onBooked={() => setApptVersion((v) => v + 1)} />
          ) : tab === 'medicines' ? (
            <MedicineList />
          ) : (
            <AppointmentList refreshKey={apptVersion} />
          )}
        </div>
      </div>
    </div>
  );
}
