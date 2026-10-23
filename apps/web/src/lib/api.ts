// Typed API client for the Manara backend. Frontend code must call THESE
// functions only — never raw fetch to a new path. See docs/API_CONTRACT.md.

import type {
  Application,
  AppNotification,
  Appointment,
  Bill,
  CategoryInfo,
  Certificate,
  CitizenProfile,
  DigitalDocument,
  Entitlement,
  EntitlementPayment,
  ExamResult,
  Facility,
  MedicineStock,
  Municipality,
  NationalStatus,
  OutageSchedule,
  Region,
  Scholarship,
  ServiceCategory,
  ServiceDetail,
  ServiceRequest,
  ServiceSummary,
  Transaction,
  Wallet,
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:24020/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, msg);
  }
  return (await res.json()) as T;
}

const get = <T>(p: string, t?: string | null) => request<T>(p, undefined, t);
const post = <T>(p: string, body: unknown, t?: string | null) =>
  request<T>(p, { method: 'POST', body: JSON.stringify(body) }, t);
const patch = <T>(p: string, body: unknown, t?: string | null) =>
  request<T>(p, { method: 'PATCH', body: JSON.stringify(body) }, t);

const qs = (params: Record<string, string | number | undefined>) => {
  const s = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '') as [string, string][],
  ).toString();
  return s ? `?${s}` : '';
};

export const api = {
  health: () => get<{ status: string }>('/health'),

  // auth
  requestOtp: (nin: string, phone: string) =>
    post<{ otpId: string; expiresInSec: number; devCode: string }>('/auth/request-otp', { nin, phone }),
  verifyOtp: (otpId: string, code: string) =>
    post<{ token: string; citizen: CitizenProfile }>('/auth/verify-otp', { otpId, code }),
  me: (token: string) => get<CitizenProfile>('/auth/me', token),

  // citizens
  profile: (token: string) => get<CitizenProfile>('/citizens/me/profile', token),
  updateProfile: (token: string, body: { phone?: string; email?: string; address?: string }) =>
    patch<CitizenProfile>('/citizens/me/profile', body, token),

  // services catalog + applications
  services: (params?: { category?: ServiceCategory; q?: string; popular?: boolean }) =>
    get<ServiceSummary[]>(
      `/services${qs({
        category: params?.category,
        q: params?.q,
        popular: params?.popular === undefined ? undefined : String(params?.popular),
      })}`,
    ),
  serviceCategories: () => get<CategoryInfo[]>('/services/categories'),
  service: (slug: string) => get<ServiceDetail>(`/services/${slug}`),
  applyForService: (slug: string, formData: Record<string, unknown>, token: string) =>
    post<Application>(`/services/${slug}/apply`, { formData }, token),
  applications: (token: string) => get<Application[]>('/services/applications', token),
  application: (id: string, token: string) => get<Application>(`/services/applications/${id}`, token),

  // documents
  documents: (token: string) => get<DigitalDocument[]>('/documents', token),
  document: (id: string, token: string) => get<DigitalDocument>(`/documents/${id}`, token),
  requestDocument: (type: string, details: Record<string, string>, token: string) =>
    post<DigitalDocument>('/documents/request', { type, details }, token),

  // requests / tickets
  requests: (token: string, params?: { status?: string; type?: string }) =>
    get<ServiceRequest[]>(`/requests${qs({ status: params?.status, type: params?.type })}`, token),
  createRequest: (
    body: { type: string; title: string; description: string; municipality: string; region?: string },
    token: string,
  ) => post<ServiceRequest>('/requests', body, token),
  request_: (id: string, token: string) => get<ServiceRequest>(`/requests/${id}`, token),
  requestStats: () =>
    get<{ total: number; byStatus: Record<string, number>; byType: Record<string, number> }>(
      '/requests/stats/summary',
    ),

  // notifications
  notifications: (token: string) => get<AppNotification[]>('/notifications', token),
  markRead: (id: string, token: string) => patch<AppNotification>(`/notifications/${id}/read`, {}, token),
  markAllRead: (token: string) => patch<{ updated: number }>('/notifications/read-all', {}, token),

  // national status
  nationalStatus: () => get<NationalStatus>('/status/national'),
  outages: (params?: { region?: string; utility?: string }) =>
    get<OutageSchedule[]>(`/status/outages${qs({ region: params?.region, utility: params?.utility })}`),

  // wallet + entitlements
  wallet: (token: string) => get<Wallet>('/wallet', token),
  transactions: (token: string) => get<Transaction[]>('/wallet/transactions', token),
  payBill: (billId: string, token: string) =>
    post<Transaction>('/wallet/pay', { billId }, token),
  entitlements: (token: string) => get<Entitlement[]>('/entitlements', token),
  entitlementHistory: (id: string, token: string) =>
    get<EntitlementPayment[]>(`/entitlements/${id}/history`, token),

  // utilities
  bills: (token: string) => get<Bill[]>('/utilities/bills', token),
  payUtilityBill: (id: string, token: string) =>
    post<Bill>(`/utilities/bills/${id}/pay`, {}, token),

  // health
  facilities: (params?: { municipality?: string; type?: string }) =>
    get<Facility[]>(`/health/facilities${qs({ municipality: params?.municipality, type: params?.type })}`),
  medicines: (q?: string) => get<MedicineStock[]>(`/health/medicines${qs({ q })}`),
  bookAppointment: (
    body: { facilityId: string; department: string; preferredDate: string },
    token: string,
  ) => post<Appointment>('/health/appointments', body, token),
  appointments: (token: string) => get<Appointment[]>('/health/appointments', token),

  // education
  certificates: (token: string) => get<Certificate[]>('/education/certificates', token),
  examResult: (seat: string) => get<ExamResult>(`/education/exam-results${qs({ seat })}`),
  scholarship: (token: string) => get<Scholarship | null>('/education/scholarship', token),

  // reference
  municipalities: () => get<Municipality[]>('/reference/municipalities'),
  regions: () => get<Region[]>('/reference/regions'),
};
