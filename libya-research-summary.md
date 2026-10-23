# Libya GaaS — Citizen Pain-Point Research Summary

**Collected:** 2026-10-23 · **Method:** 5 parallel research agents, ~80 web searches (English + Arabic)
**Companion data file:** `libya-problems.json` — 99 deduplicated problems (34 critical, 52 high, 13 medium), each with evidence, sources, severity, and a GaaS opportunity note.

> **The core insight:** Libya's problem is *services*, not connectivity. Internet penetration is ~88.5%, mobile connections ~197% of population — yet the UN Online Service Index is **0.08/1.0** and e-participation ranks **190/193**. The pipes exist; the services don't.

---

## 1. What people actually suffer (by domain)

### Identity & Civil Registry — *the load-bearing wall*
- **315,000+ unlawful national ID numbers** found by the Attorney General; forged IDs sold on an open price list (LYD 150 in Benghazi → 70,000 in Tripoli). Fake IDs unlock salaries, grants, passports, voting.
- Civil registry **paper vs. electronic data unreconciled since the 1970s** (Intilaqa project hit 97% only in 2024). Mismatches silently block SIMs, bank accounts, salaries.
- **Passport misery**: application forms rationed to one day a week in limited numbers; dawn queues; selective name admission; 1-year mandatory wait to replace a lost passport; LD 1,500–5,000 bribes vs. LD 55 official fee; only ~6 embassies worldwide can issue passports.
- Two governments run **parallel registries**; IDP parents get children refused registration because they were born in the "rival" region; Derna survivors can't replace *any* documents because replacements "must be issued in Derna" (which was destroyed); no death certificates for the missing → no widows' pensions.
- Libya's dysfunction is now internationally legible: the **US travel ban explicitly cites the absence of a competent authority issuing reliable documents**.

### Money: cash, salaries, currency
- **Liquidity crisis**: withdrawals capped at LYD 1,000–3,000; hundreds queue for hours outside guarded banks; cash runs out mid-queue; ~300–450 ATMs for the whole country; people sleep at bank doors; queues have turned deadly (3 shot in 2016). **LYD 70 billion hoarded outside the banking system.**
- **Salaries**: 2.3M public employees, world's heaviest wage bill (~30% of GDP, 54% of spending), routinely **1–2 months late**; post-2014 contract staff unpaid for *years*; ghost workers — 412,687 fake IDs on defence payrolls, salaries to the deceased — coexist with real unpaid workers.
- **FX**: parallel rate ~50%+ above official; personal dollar allowance collapsed $10,000 → $4,000 → $2,000; counterfeit + Russian-printed dinars flood the east; letters of credit monopolized by the connected, SMEs pushed to the black market.
- Payments infra lags demand: **2M POS transactions in one day crashed the national e-payment system** (May 2026); ~67% of adults effectively unbanked.

### Utilities & infrastructure — the cascade
- **Electricity**: 6–20h daily cuts (up to 36–40h in peaks); generation ~5,000–5,800 MW vs ~7,000–8,000 MW demand; GECOL collects only **~13% of operating cost**; outages spark riots (parliament torched 2022, substations stormed 2026); hospitals lost ventilators, dialysis patients died.
- **Cascade mode**: power cut → fuel station can't pump → generator diesel ends → **Man-Made River wells trip → city loses water** (92 Sarir wells down in one July 2026 blackout; ~3M people without water).
- **Water**: militias physically seize control stations and hold millions hostage; trucked water gouges households; coastal aquifers saline (TDS >10,000 mg/l); ~500,000 m³/day raw sewage onto Tripoli beaches.
- **Fuel**: world's cheapest petrol (LYD 0.15/l) yet km-long queues; ~$6.7bn/yr smuggled out (~$20bn in 2022–24 — Guardian/The Sentry); black-market diesel at 73× official price.
- **Roads**: ~3,000 deaths in 2024, world's deadliest per capita; some roads unmaintained 60 years. No urban public transport. Mitiga airport shuts with every militia clash.
- **Telecom**: median ~9–14 Mbps; 25% of towers damaged/stolen; deliberate shutdowns during unrest; everything sits under one fragile state monopoly (LPTIC).

### Healthcare
- ~6,000 dialysis patients on 90 failing units; **only ~30% of needed supplies delivered**; 20 MoH warehouses completely out of stock.
- Medicine imports "almost completely stopped": 1.1M diabetics, ~23,000 cancer patients without drugs for long stretches.
- **Treatment-abroad program**: no eligibility standard, ~50% of foreign claims inflated by fraud (forged invoices, phantom patients, €7M Stuttgart "pigsty" case), and Tunisia halted state-funded care over **$112M unpaid bills** — stranding real patients.
- Workforce hollowed out >50%; health-worker strikes nationwide (Sept 2026); no EHR — doctors "rely on information related orally"; EMS collapsed; 43 of 98 hospitals non-functional; people die because they can't access their own cash *and* can't pay private prices.
- Precedent to avoid: the COVID vaccine portal **crashed at launch**; "Tahseen" app sits at ~2 stars — demand exists, execution failed.

### Education
- **Nationwide teachers' strike** (Sept 2026) keeps ~1.6M students home; teachers earn LYD 1,000–2,500/month.
- Textbook scandal: ~2–2.6M students bookless; **two successive education ministers detained**; families photocopy books at hundreds of dinars.
- 241 schools damaged/destroyed by conflict + 117 in Derna floods; double-shift schools for 2,000 students; southern children locked out.
- Scholarship students abroad **7+ months unpaid** — ministries ping-pong the file; students expelled-stranded.

### Governance & systemic
- Every institution's mandate is **expired** (HoR elected 2014; GNU refused to quit after 2021 elections collapsed; rival eastern GNS since 2022).
- **LYD 60bn off-budget eastern spending** (2024) forced devaluation; public debt ~LYD 303bn; no unified budget since 2014.
- Municipalities are responsible on paper (Law 59) but can't deliver — no taxes, no staff, unpredictable transfers.
- **Wasta/brokers are the de facto service channel**: 62% paid a bribe for basic services (TI); officers "delay on purpose, to make you desperate."
- Elections attacked physically: 2021 presidential vote collapsed; Aug 2025 municipal polls suspended in 37/63 municipalities after armed raids.
- Derna = the emblem: dams unmaintained since 2002 despite warnings + paid repair contracts → ~5,000–11,300 dead → survivors blocked from compensation, documents, death certificates.

---

## 2. Cross-cutting findings (design implications)

1. **Identity first.** Passport, payroll, grants, banking, SIMs, voting all key off the civil-registry/NID layer — the single most corrupted system. A canonical identity ledger with biometric dedup + audit trail is the foundational investment.
2. **Anywhere-issuance is the #1 UX win.** "Return to your place of origin" recurs across IDPs, Derna survivors, diaspora, east/west travelers. Decouple issuance from geography.
3. **Kill discretionary touchpoints.** Forms rationing, name-calling, clearances, queue order — every manual gate is a corruption surface. Appointments + status trackers + e-payment attack them without needing anti-corruption laws.
4. **Design for two administrations.** Federated architecture: shared ID namespace, region-scoped service nodes, no single physical seizure point.
5. **Offline-first & multi-channel.** Power cuts to 36h, politically-motivated internet shutdowns, elderly/cash-dependent users → SMS/USSD fallback, offline-sync, assisted kiosks (post offices), QR-verifiable documents.
6. **Ride existing rails, don't rebuild.** 3.11M e-payment app subscribers, NID–SIM binding already enforced, Brega gas-cylinder e-registration works, Instant Salary praised by the IMF — citizens *will* use ID-linked digital services when they work.
7. **The killer macro use case:** the IMF explicitly recommends replacing fuel subsidies with **direct cash transfers to citizens** — "easiest to implement and most accepted." That is literally a GaaS product.
8. **Highest single ROI fix:** a "dial-before-you-dig" permit API — uncoordinated excavation repeatedly kills both power cables (total western blackouts) and backbone fiber.
9. **Transparency is itself a service.** Citizens queue 5 hours because nobody publishes anything; outages announced via Facebook posts. Status dashboards + alerts have outsized value at near-zero marginal cost.
10. **Include, don't exclude.** ~hundreds of thousands (Tuareg, Tebu, IDPs, women married to foreigners' children) lack valid NINs — the platform must have a case-resolution pathway, not a hard ID wall.

---

## 3. Existing digital rails to build on (verified)

| Asset | What it is | Status |
|---|---|---|
| **Dawlati** | GNU national e-gov platform + physical centers in Libya Post offices | Launched 2025 (uptake unverified) |
| **es.moi.gov.ly** | Online criminal-record certificate (apply/track/download) — incl. from abroad | Active since 2023 |
| **LYPay / OnePay** | Instant payments; 834k subscribers, ~57k tx in first 2 months | Active (Aug 2024) |
| **Sadad / MobMoney** | Established e-payment (Sadad since 2017) | Active |
| **fcms.cbl.gov.ly** | FX allowance booking platform | Active |
| **Your Instant Salary** | Auto-matched payroll system | Active (Aug 2025) |
| **NID–SIM binding** | SIM activation requires national ID — used for OTP/MFA | Enforced |
| **ejraat.gov.ly** | UNCTAD eRegulations: business procedures documented step-by-step | Active |
| **booking.mofa.gov.ly** | Embassy passport appointments | Active |
| **Baladi Plus (Sebha)** | Municipal e-licensing | Pilot (Aug 2025) |
| **Brega e-registration** | ID-linked cooking-gas cylinder booking | Active |
| **Intilaqa** | Civil registry paper↔electronic reconciliation, 97% of 1.8M families | Near-complete |
| **E-passport project** | Announced: 220 offices, 4 print centers, 60 embassies | Announced |

---

## 4. Highest-value platform modules (suggested MVP stack)

1. **Digital identity / e-KYC** — verified NID + phone binding, dedup, tamper-evident records.
2. **Payment layer** — ride LYPay/OnePay/Sadad rails; offline-tolerant QR/USSD; agent cash-in/out.
3. **Entitlement engine** — salaries, pensions, family grants, subsidy-replacement transfers (IMF-recommended).
4. **Document e-issuance** — civil certificates, passport application/status, QR-verified PDFs, anywhere-issuance.
5. **Service-request pipeline** — outage/waste/pothole/water reporting with ticket IDs & ETAs; municipal dashboards.
6. **Health module** — medicine-stock visibility, dialysis/appointment booking, treatment-abroad digital referral.
7. **Education module** — teacher payroll verification, e-textbooks, exam results/e-certificates, scholarship tracking.
8. **Transparency layer** — status dashboards, open-budget/procurement publication, public incident record.

## 5. Caveats

- Reporting is **Tripoli/west-weighted**; eastern service failures are under-documented in English sources.
- Some 2026-dated wire URLs may reflect re-dating; single-source 2026 items are directional.
- Latest hard bribery-rate survey is 2013 (62% paid bribes); persistence confirmed by 89% corruption perception (Arab Barometer 2022) and CPI 173/180.
- Dawlati's real uptake could not be verified.
