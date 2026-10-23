import { ServiceRequest } from '../../common/types';
import { daysAgo, daysAhead } from '../../data/seed';

// Mock ticket store. ownerNin and isPublic are internal bookkeeping and are
// stripped from every response; swap this file for a real municipal
// ticketing provider later without touching the service/controller.
export interface StoredServiceRequest extends ServiceRequest {
  ownerNin: string;
  isPublic: boolean;
}

const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000).toISOString();

export const SEED_REQUESTS: StoredServiceRequest[] = [
  {
    id: 'req_0001',
    reference: 'REQ-2026-00104',
    type: 'power_outage',
    title: 'Main feeder cable fault - Hay Al-Andalus',
    description:
      'The whole block has been without power for 14 hours since the 11kV feeder tripped. A small clinic fridge on the street is warming up.',
    municipality: 'Hay Al-Andalus',
    region: 'Tripoli',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: hoursAgo(26),
    updatedAt: hoursAgo(3),
    eta: daysAhead(1),
    timeline: [
      { status: 'received', at: hoursAgo(26), note: 'Request received and routed to GECOL Tripoli distribution' },
      { status: 'dispatched', at: hoursAgo(20), note: 'Field crew dispatched to feeder pillar on Road 10' },
      { status: 'in_progress', at: hoursAgo(3), note: 'Fault located in an underground cable joint; excavation under way' },
    ],
    ownerNin: '119880123456',
    isPublic: false,
  },
  {
    id: 'req_0002',
    reference: 'REQ-2026-00098',
    type: 'waste',
    title: 'Missed garbage collection for 9 days',
    description:
      'The communal containers on our street have not been emptied for nine days and waste is piling up around them.',
    municipality: 'Janzour',
    region: 'Tripoli',
    status: 'dispatched',
    priority: 'normal',
    createdAt: daysAgo(9),
    updatedAt: hoursAgo(30),
    timeline: [
      { status: 'received', at: daysAgo(9), note: 'Request received and routed to Janzour municipal sanitation' },
      { status: 'dispatched', at: hoursAgo(30), note: 'Assigned to the sanitation contractor; collection scheduled' },
    ],
    ownerNin: '119880123456',
    isPublic: false,
  },
  {
    id: 'req_0003',
    reference: 'REQ-2026-00111',
    type: 'water_supply',
    title: 'No running water in apartment block for three days',
    description:
      'Our building has had no municipal water for three days after the last blackout tripped the local well pumps. Residents are buying trucked water.',
    municipality: 'Tripoli Center',
    region: 'Tripoli',
    status: 'received',
    priority: 'normal',
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    timeline: [
      { status: 'received', at: hoursAgo(8), note: 'Request received and routed to the water utility control room' },
    ],
    ownerNin: '119880123456',
    isPublic: false,
  },
  {
    id: 'req_0004',
    reference: 'REQ-2026-00077',
    type: 'road',
    title: 'Pothole cluster on Airport Road',
    description:
      'A cluster of deep potholes near the Airport Road overpass is forcing drivers into the oncoming lane. Several tyres blown this week.',
    municipality: 'Tripoli Center',
    region: 'Tripoli',
    status: 'in_progress',
    priority: 'normal',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    eta: daysAhead(3),
    timeline: [
      { status: 'received', at: daysAgo(5), note: 'Request received and routed to the roads maintenance directorate' },
      { status: 'dispatched', at: daysAgo(4), note: 'Inspection team surveyed and marked the damaged section' },
      { status: 'in_progress', at: daysAgo(1), note: 'Cold-patch repairs started; asphalt mill scheduled next' },
    ],
    ownerNin: 'public',
    isPublic: true,
  },
  {
    id: 'req_0005',
    reference: 'REQ-2026-00119',
    type: 'power_outage',
    title: 'Transformer fire near Al-Jalaa hospital feeder',
    description:
      'A distribution transformer caught fire last night. The hospital feeder is running on a backup line and surrounding streets have no power.',
    municipality: 'Benghazi',
    region: 'Benghazi',
    status: 'received',
    priority: 'urgent',
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(30),
    timeline: [
      { status: 'received', at: hoursAgo(30), note: 'Request received and escalated to GECOL Benghazi emergency desk' },
    ],
    ownerNin: 'public',
    isPublic: true,
  },
  {
    id: 'req_0006',
    reference: 'REQ-2026-00052',
    type: 'telecom',
    title: 'Fiber optic cut on Al-Nasr Street',
    description:
      'Contractor excavation cut the fiber duct on Al-Nasr Street; homes and shops lost internet and fixed-line service.',
    municipality: 'Tripoli Center',
    region: 'Tripoli',
    status: 'resolved',
    priority: 'normal',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(9),
    timeline: [
      { status: 'received', at: daysAgo(12), note: 'Request received and routed to the telecom operator field desk' },
      { status: 'dispatched', at: daysAgo(11), note: 'Splicing crew dispatched to the excavation site' },
      { status: 'in_progress', at: daysAgo(10), note: 'Damaged duct exposed; fiber splice in progress' },
      { status: 'resolved', at: daysAgo(9), note: 'Service restored and verified with affected subscribers' },
    ],
    ownerNin: 'public',
    isPublic: true,
  },
  {
    id: 'req_0007',
    reference: 'REQ-2026-00091',
    type: 'water_supply',
    title: 'Man-Made River supply valve failure',
    description:
      'A control valve on the southern conveyance failed and pressure across the city dropped sharply. Two districts report no flow at all.',
    municipality: 'Sabha',
    region: 'Fezzan',
    status: 'dispatched',
    priority: 'high',
    createdAt: daysAgo(2),
    updatedAt: hoursAgo(18),
    eta: daysAhead(2),
    timeline: [
      { status: 'received', at: daysAgo(2), note: 'Request received and routed to the Man-Made River Authority' },
      { status: 'dispatched', at: hoursAgo(18), note: 'Maintenance team sent with a replacement valve assembly' },
    ],
    ownerNin: 'public',
    isPublic: true,
  },
  {
    id: 'req_0008',
    reference: 'REQ-2026-00115',
    type: 'waste',
    title: 'Overflowing communal bins near central market',
    description:
      'The bins beside the central market are overflowing onto the pavement and blocking shop entrances after a week without collection.',
    municipality: 'Janzour',
    region: 'Tripoli',
    status: 'received',
    priority: 'low',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    timeline: [
      { status: 'received', at: daysAgo(4), note: 'Request received and queued for the sanitation contractor' },
    ],
    ownerNin: 'public',
    isPublic: true,
  },
];
