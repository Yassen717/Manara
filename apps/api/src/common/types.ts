// Shared domain types for the Manara API. Mirror of web/src/lib/types.ts.
// Keep in sync with docs/API_CONTRACT.md.

export type EkycStatus = 'verified' | 'pending' | 'unverified';

export interface CitizenProfile {
  nin: string;
  firstName: string;
  lastName: string;
  firstNameAr: string;
  lastNameAr: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  municipality: string;
  address: string;
  ekycStatus: EkycStatus;
  registeredAt: string;
}

export type ServiceCategory =
  | 'identity' | 'documents' | 'travel' | 'health' | 'education' | 'utilities'
  | 'payments' | 'business' | 'social' | 'justice' | 'municipal' | 'employment';

export interface ServiceSummary {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  category: ServiceCategory;
  shortDescription: string;
  shortDescriptionAr: string;
  icon: string;
  processingDays: number;
  fee: number;
  online: boolean;
  popular: boolean;
}

export interface ServiceDetail extends ServiceSummary {
  longDescription: string;
  longDescriptionAr: string;
  requiredDocuments: string[];
  steps: string[];
  eligibility: string[];
}

export type ApplicationStatus = 'submitted' | 'in_review' | 'approved' | 'rejected' | 'completed';

export interface Application {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  serviceNameAr: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  timeline: { status: string; at: string; note: string }[];
  delivery: 'digital' | 'pickup' | 'courier';
}

export interface DigitalDocument {
  id: string;
  type: string;
  typeAr: string;
  reference: string;
  issuedAt: string;
  expiresAt?: string;
  holderName: string;
  status: 'active' | 'expired' | 'revoked';
  qrPayload: string;
  data: Record<string, string>;
}

export type RequestType = 'power_outage' | 'water_supply' | 'waste' | 'road' | 'telecom' | 'other';
export type RequestStatus = 'received' | 'dispatched' | 'in_progress' | 'resolved' | 'closed';

export interface ServiceRequest {
  id: string;
  reference: string;
  type: RequestType;
  title: string;
  description: string;
  municipality: string;
  region?: string;
  status: RequestStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  eta?: string;
  timeline: { status: string; at: string; note: string }[];
}

export interface Wallet {
  balance: number;
  currency: 'LYD';
  cardLast4: string;
  monthlyLimit: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  descriptionAr: string;
  at: string;
  category: string;
}

export interface Entitlement {
  id: string;
  kind: 'salary' | 'pension' | 'family_grant' | 'subsidy_transfer' | 'scholarship';
  title: string;
  titleAr: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  nextPaymentAt: string;
  status: 'active' | 'pending' | 'paused';
}

export interface EntitlementPayment {
  id: string;
  amount: number;
  paidAt: string;
  reference: string;
  status: 'paid' | 'scheduled' | 'delayed';
}

export interface OutageSchedule {
  region: string;
  municipality: string;
  utility: 'electricity' | 'water' | 'telecom';
  day: string;
  windows: { from: string; to: string }[];
  note?: string;
}

export interface Bill {
  id: string;
  utility: 'electricity' | 'water' | 'telecom' | 'gas';
  period: string;
  amount: number;
  currency: string;
  dueAt: string;
  status: 'due' | 'paid' | 'overdue';
}

export interface Facility {
  id: string;
  name: string;
  nameAr: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'phc';
  municipality: string;
  region: string;
  services: string[];
  status: 'open' | 'limited' | 'closed';
}

export interface MedicineStock {
  id: string;
  name: string;
  genericName: string;
  availability: 'in_stock' | 'low' | 'out';
  facilities: string[];
}

export interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  department: string;
  scheduledFor: string;
  status: 'booked' | 'confirmed' | 'completed' | 'cancelled';
  reference: string;
}

export interface Certificate {
  id: string;
  type: 'secondary' | 'bachelor' | 'master' | 'phd' | 'vocational';
  title: string;
  titleAr: string;
  institution: string;
  issuedAt: string;
  reference: string;
  grade?: string;
}

export interface ExamResult {
  seat: string;
  name: string;
  nameAr: string;
  year: number;
  term: string;
  stream: string;
  passed: boolean;
  totalScore: number;
  maxScore: number;
  subjects: { name: string; score: number; max: number }[];
}

export interface Scholarship {
  id: string;
  country: string;
  university: string;
  program: string;
  degree: string;
  stipendAmount: number;
  currency: string;
  status: 'active' | 'suspended' | 'graduated';
  lastPaymentAt?: string;
  nextPaymentAt?: string;
}

export interface NationalStatusService {
  key: 'power' | 'water' | 'fuel' | 'internet' | 'payments';
  status: 'operational' | 'degraded' | 'outage';
  headline: string;
  detail: string;
  updatedAt: string;
}

export interface NationalStatus {
  generatedAt: string;
  services: NationalStatusService[];
}

export interface AppNotification {
  id: string;
  kind: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  at: string;
  read: boolean;
}

export interface Municipality {
  name: string;
  nameAr: string;
  region: string;
}

export interface Region {
  name: string;
  nameAr: string;
}
