# Manara API Contract (v1)

Single source of truth. Backend agents implement EXACTLY these endpoints under global prefix `/api/v1`. Frontend agents call ONLY these endpoints via `lib/api.ts` (which already has a typed method for each — do not invent new endpoints or new fetch calls).

Base URL: `http://localhost:24020/api/v1` (env `PORT` on backend, `NEXT_PUBLIC_API_URL` on frontend).

Auth: `Authorization: Bearer <token>` — token comes from `POST /auth/verify-otp`. Dev OTP is always `123456` when `request-otp` is called; `request-otp` also returns `devCode` for convenience.

## Shared types (see web/src/lib/types.ts and api/src/common/types.ts)

- `CitizenProfile { nin, firstName, lastName, firstNameAr, lastNameAr, dateOfBirth, gender, phone, email?, municipality, address, ekycStatus: 'verified'|'pending'|'unverified', registeredAt }`
- `ServiceCategory = 'identity'|'documents'|'travel'|'health'|'education'|'utilities'|'payments'|'business'|'social'|'justice'|'municipal'|'employment'`
- `ServiceSummary { id, slug, name, nameAr, category, shortDescription, shortDescriptionAr, icon, processingDays, fee, online, popular }`
- `ServiceDetail extends ServiceSummary { longDescription, longDescriptionAr, requiredDocuments: string[], steps: string[], eligibility: string[] }`
- `Application { id, reference, serviceId, serviceName, serviceNameAr, status: 'submitted'|'in_review'|'approved'|'rejected'|'completed', submittedAt, updatedAt, timeline: {status, at, note}[], delivery: 'digital'|'pickup'|'courier' }`
- `DigitalDocument { id, type, typeAr, reference, issuedAt, expiresAt?, holderName, status: 'active'|'expired'|'revoked', qrPayload, data: Record<string,string> }`
- `ServiceRequest { id, reference, type: 'power_outage'|'water_supply'|'waste'|'road'|'telecom'|'other', title, description, municipality, region?, status: 'received'|'dispatched'|'in_progress'|'resolved'|'closed', priority, createdAt, updatedAt, eta?, timeline: {status, at, note}[] }`
- `Wallet { balance, currency:'LYD', cardLast4, monthlyLimit }`
- `Transaction { id, type:'credit'|'debit', amount, currency, description, descriptionAr, at, category }`
- `Entitlement { id, kind:'salary'|'pension'|'family_grant'|'subsidy_transfer'|'scholarship', title, titleAr, amount, currency, period:'monthly'|'quarterly'|'annual'|'one_time', nextPaymentAt, status:'active'|'pending'|'paused' }`
- `EntitlementPayment { id, amount, paidAt, reference, status:'paid'|'scheduled'|'delayed' }`
- `OutageSchedule { region, municipality, utility:'electricity'|'water'|'telecom', day, windows: {from, to}[] , note? }`
- `Bill { id, utility:'electricity'|'water'|'telecom'|'gas', period, amount, currency, dueAt, status:'due'|'paid'|'overdue' }`
- `Facility { id, name, nameAr, type:'hospital'|'clinic'|'pharmacy'|'phc', municipality, region, services: string[], status:'open'|'limited'|'closed' }`
- `MedicineStock { id, name, genericName, availability:'in_stock'|'low'|'out', facilities: string[] }`
- `Appointment { id, facilityId, facilityName, department, scheduledFor, status:'booked'|'confirmed'|'completed'|'cancelled', reference }`
- `Certificate { id, type:'secondary'|'bachelor'|'master'|'phd'|'vocational', title, titleAr, institution, issuedAt, reference, grade? }`
- `ExamResult { seat, name, nameAr, year, term, stream, passed, totalScore, maxScore, subjects: {name, score, max}[] }`
- `Scholarship { id, country, university, program, degree, stipendAmount, currency, status:'active'|'suspended'|'graduated', lastPaymentAt?, nextPaymentAt? }`
- `NationalStatus { generatedAt, services: {key:'power'|'water'|'fuel'|'internet'|'payments'|'payments', status:'operational'|'degraded'|'outage', headline, detail, updatedAt}[] }`
- `Notification { id, kind:'info'|'success'|'warning'|'alert', title, titleAr, body, bodyAr, at, read }`

## Endpoints

### Health
- `GET /health` -> `{ status:'ok', service:'manara-api', time }`

### Auth (module: auth)
- `POST /auth/request-otp` body `{ nin: string(8-14 digits), phone: string }` -> `{ otpId, expiresInSec, devCode }`
- `POST /auth/verify-otp` body `{ otpId, code }` -> `{ token, citizen: CitizenProfile }` (code `123456` always succeeds; unknown nin creates citizen on the fly)
- `GET /auth/me` (Bearer) -> `CitizenProfile`

### Citizens (module: citizens)
- `GET /citizens/me/profile` (Bearer) -> `CitizenProfile`
- `PATCH /citizens/me/profile` (Bearer) body `{ phone?, email?, address? }` -> `CitizenProfile`

### Services catalog (module: services)
- `GET /services` query `?category=&q=&popular=` -> `ServiceSummary[]`
- `GET /services/categories` -> `{ id: ServiceCategory, name, nameAr, count }[]`
- `GET /services/:slug` -> `ServiceDetail`
- `POST /services/:slug/apply` (Bearer) body `{ formData: Record<string,unknown> }` -> `Application`
- `GET /services/applications` (Bearer) -> `Application[]`  *(implemented in services module)*
- `GET /services/applications/:id` (Bearer) -> `Application` *(implemented in services module)*

### Documents (module: documents)
- `GET /documents` (Bearer) -> `DigitalDocument[]`
- `GET /documents/:id` (Bearer) -> `DigitalDocument`
- `POST /documents/request` (Bearer) body `{ type, details? }` -> `DigitalDocument` (status active, issuedAt now)

### Requests / service tickets (module: requests)
- `GET /requests` (Bearer) query `?status=&type=` -> `ServiceRequest[]`
- `POST /requests` (Bearer) body `{ type, title, description, municipality, region? }` -> `ServiceRequest`
- `GET /requests/:id` (Bearer) -> `ServiceRequest`
- `GET /requests/stats/summary` -> `{ total, byStatus: Record<string,number>, byType: Record<string,number> }` (public, includes seeded public requests + citizen's)

### Notifications (module: notifications)
- `GET /notifications` (Bearer) -> `Notification[]`
- `PATCH /notifications/:id/read` (Bearer) -> `Notification`
- `PATCH /notifications/read-all` (Bearer) -> `{ updated: number }`

### National status (module: status)
- `GET /status/national` -> `NationalStatus`
- `GET /status/outages` query `?region=&utility=` -> `OutageSchedule[]`

### Wallet & payments (module: wallet)
- `GET /wallet` (Bearer) -> `Wallet`
- `GET /wallet/transactions` (Bearer) -> `Transaction[]`
- `POST /wallet/pay` (Bearer) body `{ billId }` -> `Transaction`

### Entitlements (module: entitlements)
- `GET /entitlements` (Bearer) -> `Entitlement[]`
- `GET /entitlements/:id/history` (Bearer) -> `EntitlementPayment[]`

### Utilities (module: utilities)
- `GET /utilities/bills` (Bearer) -> `Bill[]`
- `POST /utilities/bills/:id/pay` (Bearer) -> `Bill`

### Health (module: health)
- `GET /health/facilities` query `?municipality=&type=` -> `Facility[]`
- `GET /health/medicines` query `?q=` -> `MedicineStock[]`
- `POST /health/appointments` (Bearer) body `{ facilityId, department, preferredDate }` -> `Appointment`
- `GET /health/appointments` (Bearer) -> `Appointment[]`

NOTE: `GET /health` (no sub-path) is the liveness endpoint — keep it in AppController, NOT in the health module. Health module routes are under `/api/v1/health/*`.

### Education (module: education)
- `GET /education/certificates` (Bearer) -> `Certificate[]`
- `GET /education/exam-results` query `?seat=` -> `ExamResult` (seat=any seeded seat or 404)
- `GET /education/scholarship` (Bearer) -> `Scholarship | null`

### Reference (module: citizens — public helpers)
- `GET /reference/municipalities` -> `{ name, nameAr, region }[]`
- `GET /reference/regions` -> `{ name, nameAr }[]`

## Conventions

- Every list endpoint returns a JSON array (no envelope). Single resources return the object.
- Errors: standard Nest error shape `{ statusCode, message, error }`. 401 without valid Bearer token on protected routes.
- IDs: prefixed strings (`app_`, `doc_`, `req_`, `tx_`, `ntf_`...). References human-readable (`MNR-2026-XXXXX`).
- All dates ISO-8601 strings. Amounts in LYD numbers.
- Bilingual: every user-visible name/title has `name` + `nameAr` (or `title`/`titleAr`, `description`/`descriptionAr`).
