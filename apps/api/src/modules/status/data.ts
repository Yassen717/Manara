import { NationalStatus, OutageSchedule } from '../../common/types';

// National status board and planned-outage schedule. Details carry a short
// Arabic line after the English one, mirroring how Libyan authorities publish
// bilingual advisories. Swap for a real feed from GECOL / the utilities later.
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

export const NATIONAL_STATUS: Pick<NationalStatus, 'services'> = {
  services: [
    {
      key: 'power',
      status: 'degraded',
      headline: 'Load-shedding active',
      detail:
        'Rolling outages of 6-10 hours across the western grid; GECOL generation ~5,400 MW against ~7,800 MW demand. طرح أحمال متكرر في الشبكة الغربية.',
      updatedAt: hoursAgo(1),
    },
    {
      key: 'water',
      status: 'degraded',
      headline: 'Man-Made River output reduced',
      detail:
        'Well fields tripped during recent blackouts; pressure low in coastal districts and water trucking under way. ضعف في ضخ النهر الصناعي بعد انقطاعات الكهرباء.',
      updatedAt: hoursAgo(3),
    },
    {
      key: 'fuel',
      status: 'degraded',
      headline: 'Fuel supply tight in the south',
      detail:
        'Diesel and petrol queues reported in Sabha and Murzuq after convoy delays; coastal supply stable. طوابير وقود في الجنوب.',
      updatedAt: hoursAgo(6),
    },
    {
      key: 'internet',
      status: 'operational',
      headline: 'Networks operating normally',
      detail:
        'Backbone links stable; expect mobile congestion during evening peak hours. الشبكات تعمل بشكل طبيعي.',
      updatedAt: hoursAgo(2),
    },
    {
      key: 'payments',
      status: 'operational',
      headline: 'Payment rails operational',
      detail:
        'CBL clearing, card networks and mobile wallet services running normally. أنظمة الدفع تعمل بشكل طبيعي.',
      updatedAt: hoursAgo(0),
    },
  ],
};

export const OUTAGES: OutageSchedule[] = [
  {
    region: 'Tripoli',
    municipality: 'Janzour',
    utility: 'electricity',
    day: 'everyday',
    windows: [
      { from: '10:00', to: '14:00' },
      { from: '22:00', to: '02:00' },
    ],
    note: 'Load-shedding group 3 - coastal feeder',
  },
  {
    region: 'Tripoli',
    municipality: 'Hay Al-Andalus',
    utility: 'electricity',
    day: 'everyday',
    windows: [{ from: '12:00', to: '16:00' }],
    note: 'Load-shedding group 5',
  },
  {
    region: 'Tripoli',
    municipality: 'Tripoli Center',
    utility: 'electricity',
    day: 'weekday',
    windows: [{ from: '14:00', to: '18:00' }],
  },
  {
    region: 'Tripoli',
    municipality: 'Tajoura',
    utility: 'water',
    day: 'everyday',
    windows: [{ from: '06:00', to: '18:00' }],
    note: 'Well-field maintenance after pump trips',
  },
  {
    region: 'Benghazi',
    municipality: 'Benghazi',
    utility: 'electricity',
    day: 'everyday',
    windows: [
      { from: '08:00', to: '12:00' },
      { from: '20:00', to: '00:00' },
    ],
    note: 'North Benghazi plant derating',
  },
  {
    region: 'Benghazi',
    municipality: 'Benghazi',
    utility: 'telecom',
    day: 'weekday',
    windows: [{ from: '23:00', to: '05:00' }],
    note: 'Backbone maintenance window',
  },
  {
    region: 'Fezzan',
    municipality: 'Sabha',
    utility: 'electricity',
    day: 'everyday',
    windows: [{ from: '09:00', to: '15:00' }],
    note: 'Fuel shortage at Sabha power plant',
  },
  {
    region: 'Fezzan',
    municipality: 'Murzuq',
    utility: 'water',
    day: 'everyday',
    windows: [{ from: '05:00', to: '17:00' }],
    note: 'Borehole pumps offline pending spare parts',
  },
  {
    region: 'Misrata',
    municipality: 'Misrata',
    utility: 'electricity',
    day: 'weekday',
    windows: [{ from: '11:00', to: '14:00' }],
  },
  {
    region: 'Zawiya',
    municipality: 'Zawiya',
    utility: 'telecom',
    day: 'everyday',
    windows: [{ from: '01:00', to: '04:00' }],
    note: 'LTE upgrade works',
  },
];
