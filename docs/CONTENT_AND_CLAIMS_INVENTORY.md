# Plethora (Pty) Ltd — Content, Brand & Product Claims Inventory

**Document Version:** 1.0  
**Source of Truth Date:** 11 October 2026 (`Plethora_Business_Plan_Final_v1.pdf`, `Brand Guidelines.svg`, `Features.pdf`, `Module Walkthrough.pdf`)

---

## 1. Brand Identity & Design Tokens (Verified from `Brand Guidelines.svg`)

### 1.1 Official Logo Variants
| Asset File | Variant & Approved Usage | Artwork Colours |
| :--- | :--- | :--- |
| `Original Plethora Logo.svg` (`/public/brand/logo-primary.svg`) | **Primary Logo** — Use on white (`#ffffff`) and light neutral (`#f7f6f2`, `#e4e4e4`) backgrounds. | Icon mark `#ff751f` with `#ffffff` inner geometry; Wordmark `#000000` (Master Font: Roboto Mono). |
| `Original Plethora Logo Orange and White.svg` (`/public/brand/logo-orange-white.svg`) | **Reversed Primary Logo** — Use on black (`#000000`) and dark backgrounds (e.g., dark footer or dark bento surface). | Icon mark `#ff751f` with `#ffffff` inner geometry; Wordmark `#ffffff`. |
| `Original Plethora Logo White.svg` (`/public/brand/logo-white.svg`) | **Monochrome White Logo** — Use on black (`#000000`) or high-contrast dark surfaces where monochrome treatment is required. | Icon mark `#ffffff` with `#d9d9d9` inner geometry; Wordmark `#ffffff`. |
| `Plethora Official  Favicon.svg` (`/public/brand/favicon.svg`, `src/app/icon.svg`) | **Official Compact Mark / Favicon** — Browser tab icon and compact square mark. | Rounded square `#ff751f` with `#ffffff` geometric hourglass/bowtie mark. |

### 1.2 Official Colour Specification
| Token Name | Guideline Label | Hex Value | Usage Rule |
| :--- | :--- | :--- | :--- |
| `--color-text` | Text | `#000000` | Primary typography, high-contrast structural elements, dark footer surface. |
| `--color-bg` | Background | `#ffffff` | Primary page background and card surfaces. |
| `--color-primary` | Primary Colour | `#ff6e14` | Brand recognition, primary CTAs, active indicators, key operational highlights. *(Note: SVG fill in guideline swatch is `#ff6c12`; logo mark fill is `#ff751f`.)* |
| `--color-secondary` | Secondary Colour | `#fcb488` | Soft orange accent, secondary highlights, subtle badges and borders. |
| `--color-accent` | Accent Colour | `#c04900` | Darker orange accent for hover states, high-contrast text accents on light backgrounds, and active borders. |
| `--color-status-positive` | Positive Status | `#5ad824` | Semantically appropriate positive interface statuses (e.g., `Confirmed`, `Payroll ready`, `Verified`). |
| `--color-status-negative` | Negative Status | `#f63232` | Semantically appropriate negative/blocker statuses (e.g., `Blocker`, `Missed`, `Error`). |
| `--color-status-warning` | Warning Status | `#f4a834` | Semantically appropriate warning/pending statuses (e.g., `Needs confirmation`, `Coverage check`). |
| `--color-surface-warm` | Neutral Surface | `#f7f6f2` | Restrained secondary section and bento surface background from `Brand Guidelines.svg` and ERP canvas. |
| `--color-border-neutral` | Neutral Container | `#e4e4e4` | Structural borders and dividers from `Brand Guidelines.svg`. |

### 1.3 Official Typography Hierarchy
- **Headings & Subheadings:** `Inter`
  - **First Level Heading (`H1`):** `20px` UI / `34px+` Marketing Display (per guideline note: *"based on a typographic scale of 12, 14, 16, 20, and 34"*), `500 Medium`, `32px` line-height (UI), `2%` (`0.02em`) letter-spacing, Sentence case.
  - **Subtitle 2 (`H2`):** `18px`, `500 Medium`, `24px` line-height, `2%` letter-spacing, Sentence case.
  - **Subtitle 3 (`H3`):** `16px`, `400 Regular`, `28px` line-height, `2%` letter-spacing, Sentence case.
  - **Subtitle 4 (`H4`):** `14px`, `500 Medium`, `20px` line-height, `2%` letter-spacing, Sentence case.
- **Main Text:** `Roboto`
  - **Body Large (`Body L`):** `16px`, `400 Regular`, `24px` line-height, `2%` letter-spacing, Sentence case.
  - **Body Large Bold (`Body L Bold`):** `16px`, `500 Medium`, `24px` line-height, `2%` letter-spacing, Sentence case.
  - **Body Small (`Body S`):** `14px`, `400 Regular`, `20px` line-height, `2%` letter-spacing, Sentence case.
  - **Body Small Bold (`Body S Bold`):** `14px`, `500 Medium`, `20px` line-height, `2%` letter-spacing, Sentence case.
  - **Caption (`caption`):** `12px`, `400 Regular`, `14px` line-height, `2%` letter-spacing, Sentence case.
  - **Helper Text (`Helper`):** `10px` (`12px` web accessible floor), `500 Medium`, `14px` line-height, `2%` letter-spacing, Sentence case.
- **Technical / Monospace Details:** `Roboto Mono` (Master font for the logo; restrained use for IDs, OB numbers, and timestamps).

---

## 2. Capability & Release Status Inventory

Per Section 2 and Section 13 (Phase 3) of the implementation brief, every product capability on the website is strictly classified into one of three states:

### State A: Available in Internal Operating Environment (Verified in MVP / Internal Deployment)
*Evidence: `Plethora_Business_Plan_Final_v1.pdf` (Sections 1, 4.1, 5.3, Pages 8–12), `Features.pdf`, `Module Walkthrough.pdf`, and ERP screenshots.*
1. **Workforce & Guard Records (`Team`):** Unified records for hourly pay-graded security guards and salaried office staff; 13-digit SA ID date/gender extraction; PSIRA registration and grade tracking; BCEA employment fields; bank and tax details; lifecycle tracking (`Applicant → Hired → Training → Active → Offboarded`); CSV template import with pre-write error validation.
2. **Site & Post Management (`Sites`):** Client site registry with service type (`Guarding`, `Access Control`, `Patrols`), risk rating, site contacts, day/night post definitions, and assigned vs. required guard counts.
3. **Shift Planning & Rostering (`Rostering`):** Pattern-based shift generation (`3 on 3 off`, `4 on 4 off`, weekdays, custom patterns), pay-period-aligned roster periods, plain-language schedule views (`Day shift`, `Night shift`, `Off`), advanced roster editor, and PDF roster export.
4. **Attendance & Timesheet Confirmation (`Attendance`):** Roster-linked day and night shift timesheets, Duty ON and Duty OFF Occurrence Book (OB) number capture, reliever and unrostered guard additions, coverage-short indicators, and timesheet approval serving as the source of truth for payroll.
5. **WhatsApp Frontline Communication & Attendance Flow (`WhatsApp`):** Direct guard messaging from employee records and documented WhatsApp location check-in/clock-out workflow (labelled as internal operating workflow / illustrative preview).
6. **Payroll Preparation & Run Pipeline (`Payroll`):** Five-stage controlled workflow (`1. Attendance → 2. Create run → 3. Calculate → 4. Approve → 5. Mark paid`), pay grade arithmetic, overtime/Sunday/public-holiday rules, attendance blocker enforcement prior to calculation, SARS export support, and reserve/labour cost summaries.
7. **Leave Management (`Leave`):** Annual, sick, family responsibility, parental, and study leave tracking for general staff and NBCPSS security officers, balance impact previews, approval queue, and audit trail.
8. **Client Billing & Administration (`Client Billing`):** Accounts receivable overview, invoices, quotes, client statements, and contract billing rates.
9. **Role-Based Access Control & Audit Trail:** Granular module-level permissions (`View`, `Create`, `Edit`, `Delete`, `Approve`, `Export`) assigned per user, strict company data isolation, and action logging.

### State B: In Development
*Evidence: `Plethora_Business_Plan_Final_v1.pdf` (Section 4.1 table, Page 4) and `report 24july Plethora.pdf`.*
1. **Incident Workflows (`Incidents`):** Structured operational incident logging, escalation workflows, and site incident reporting. Must be explicitly badged as **In development**.
2. **Extended Compliance Workflows (`Compliance`):** Dedicated compliance module workflows and automated audit packs (beyond the core PSIRA, BCEA, NBCPSS, SARS, and UIF fields already captured on employee, leave, and payroll records). Must be explicitly badged as **In development**.
3. **In-Context Leave & Attendance Conflict Resolution:** Direct leave amendment/cancellation actions surfaced inside attendance conflict alerts.

### State C: Planned (12-Month Roadmap Objectives)
*Evidence: `Plethora_Business_Plan_Final_v1.pdf` (Sections 1, 4.1, 4.2, 7).*
1. **Stage 2 — Operations-Aware AI Assistant:** Contextual assistant designed to answer defined operational questions and assist with approved tasks across modules, subject to permission checks and quality review gates. **Status: Planned (12-month objective).**
2. **Stage 3 — Agent Workflows:** Selected repeatable administrative workflows operating within defined action boundaries, exception handling, human approval controls, audit logs, and rollback paths. **Status: Planned (12-month objective).**
3. **Stage 4 — Expanded AI Operations:** Progressive extension of validated AI assistance to incident, compliance, sales/support, and reporting workflows. **Status: Planned (longer-term roadmap).**

---

## 3. Business Claims & Confidentiality Guardrails

| Topic | Business Plan Fact (11 Oct 2026) | Public Website Treatment |
| :--- | :--- | :--- |
| **Company Identity** | Plethora (Pty) Ltd, CIPC Reg. `2026/747460/07`, registered 16 Sept 2026. Founder & Active Director: Aobakwe Dipitso. | Approved for public disclosure on About, Contact, Privacy, Terms, and Footer. |
| **B-BBEE Status** | Level 1 B-BBEE Exempted Micro Enterprise (EME), 100% Black-owned. | Stated factually on About page without inventing external certifications. |
| **Target Market** | South African private security companies, prioritising operators with ~50–250 guards (accommodating smaller operators and 300+ guard fleets). | Used across Homepage, Product, Solutions, and Demo form guard-count selector. |
| **Internal Deployment** | Deployed internally at Quick Bopha Security (88 guards and 103 platform users recorded in the dated operating plan). | Described transparently as Plethora's internal operating base at Quick Bopha Security. Never misrepresented as an external paying customer or third-party case study. |
| **External Commercial Traction** | 0 external paying customers; R0 external revenue as at 11 October 2026. | No fabricated customer logos, fake testimonials, or unverified ROI/time-saved statistics anywhere on the site. |
| **Pricing Hypothesis** | Starter (1–50 guards: R1,350/mo), Growth (51–150: R2,000/mo), Scale (151–300: R3,000/mo), Enterprise (300+: R6,000/mo) — explicitly noted in BP Section 5.1 as an *initial price schedule to be confirmed through paid customer validation before publishing a standard offer*. | We explain that subscriptions scale by guard count across fleet tiers and invite operators to request a scoped demo/pilot, without misrepresenting unvalidated planning assumptions as a locked public tariff unless requested. |
| **Confidential Investor Data** | R1.5m pre-seed funding request, Oakvale discussions, 36-month cash-flow deficit/reconciliation in Months 21–22, internal cost assumptions. | **Strictly excluded** from the public website per Section 3 of the brief. |
| **Employee PII in Screenshots** | Raw screenshots contain employee full names, mobile numbers, and GPS coordinates. | **Strictly excluded/redacted.** All interface visuals on the public site use sanitised demonstration records explicitly labelled as illustrative previews. |
