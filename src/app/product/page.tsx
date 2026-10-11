import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  HeroOperationsPreview,
  WhatsAppAttendancePreview,
  BentoCapabilityVisual,
} from "@/components/product-previews";

export const metadata: Metadata = {
  title: "Product Overview — Connected Security Workforce Platform",
  description:
    "Explore the Plethora platform architecture: guard and site records, pay-period rostering, OB attendance verification, five-stage payroll runs, client billing, and our staged AI roadmap.",
};

const MODULE_INVENTORY = [
  {
    id: "workforce",
    name: "Team & Employee Records",
    category: "Core Workforce",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Unified employee records for hourly pay-graded security guards and salaried office staff.",
    capabilities: [
      "13-digit South African ID number parsing (birth date & gender extraction)",
      "PSIRA registration number and grade tracking per officer",
      "BCEA employment terms, bank details, and tax fields captured up front",
      "Full employment lifecycle tracking: Applicant → Hired → Training → Active → Offboarded",
      "CSV template bulk import with pre-write validation error reporting",
    ],
    visualType: "workforce" as const,
  },
  {
    id: "sites",
    name: "Sites & Posts Registry",
    category: "Deployment",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Every protected client location held in a single operational record linked to rostering and billing.",
    capabilities: [
      "Service classification: Guarding, Access Control, and Patrols",
      "Site risk rating, physical address, contract references, and client contacts",
      "Day shift and night shift post definitions per location",
      "Live comparison of guards assigned versus guards required per site",
    ],
    visualType: "workforce" as const,
  },
  {
    id: "rostering",
    name: "Shift Planning & Rostering",
    category: "Operations",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Pattern-driven shift scheduling aligned directly to your company's pay period.",
    capabilities: [
      "Standard rotation patterns: 3 on 3 off, 4 on 4 off, weekdays, or custom patterns",
      "Plain-language published schedule view (Day shift, Night shift, Off)",
      "Advanced full-screen roster editor for bulk edits and replacements",
      "One-click PDF roster export per guard or for the entire site schedule",
    ],
    visualType: "rostering" as const,
  },
  {
    id: "attendance",
    name: "Attendance, Timesheets & WhatsApp",
    category: "Operations",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Roster-linked site timesheets with Occurrence Book (OB) verification and frontline WhatsApp communication.",
    capabilities: [
      "Separate day-shift and night-shift confirmation workflows per site",
      "Duty ON and Duty OFF Occurrence Book (OB) number capture on every shift entry",
      "Reliever and unrostered guard additions linked directly to the site timesheet",
      "Direct WhatsApp messaging from guard records and documented WhatsApp location check-in flow",
    ],
    visualType: "attendance" as const,
  },
  {
    id: "payroll",
    name: "Payroll Preparation & Leave",
    category: "Finance & HR",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Controlled five-stage payroll run pipeline backed by approved site timesheets and NBCPSS leave rules.",
    capabilities: [
      "Five-stage pipeline: 1. Attendance → 2. Create run → 3. Calculate → 4. Approve → 5. Mark paid",
      "Configured pay grades, overtime, Sunday, and public-holiday rules applied automatically",
      "Explicit attendance blocker safeguard prevents calculation while shift confirmations remain open",
      "Annual, sick, family responsibility, parental, and study leave for general staff and NBCPSS security officers",
      "SARS statutory exports, UIF reference tracking, and contract labour cost summaries",
    ],
    visualType: "payroll" as const,
  },
  {
    id: "billing",
    name: "Client Billing & Accounts Receivable",
    category: "Finance & Admin",
    status: "available" as const,
    statusLabel: "Internal operating base",
    summary:
      "Connect client contracts and site guard deployments to invoicing and statements.",
    capabilities: [
      "Client accounts overview with monthly contract values and active guard/site counts",
      "Invoices, quotes, and client statements management",
      "Accounts receivable ageing visibility across current, 30, 60, and 90+ day buckets",
    ],
    visualType: "billing" as const,
  },
  {
    id: "compliance",
    name: "Incident & Extended Compliance Workflows",
    category: "Governance",
    status: "in-development" as const,
    statusLabel: "In development",
    summary:
      "Expanding beyond core statutory record fields into dedicated operational incident and compliance modules.",
    capabilities: [
      "Available today: PSIRA, BCEA, NBCPSS, SARS, and UIF fields embedded in employee and payroll records",
      "In development: Dedicated Incident logging, escalation tracking, and site incident registers",
      "In development: Dedicated Compliance module and automated audit packs",
      "In development: In-context leave amendment/cancellation directly from attendance conflict screens",
    ],
    visualType: "compliance" as const,
  },
  {
    id: "ai-roadmap",
    name: "AI Assistant & Controlled Agent Workflows",
    category: "AI Roadmap",
    status: "planned" as const,
    statusLabel: "Planned · 12-month objective",
    summary:
      "Operations-aware AI assistance and bounded administrative workflows governed by permissions and human approval.",
    capabilities: [
      "Stage 1 (Internal base): Structured operational records, role-based access control, and audit trails",
      "Stage 2 (12-month target): Operations-aware assistant for defined questions across approved modules",
      "Stage 3 (12-month target): Repeatable administrative agent workflows with human review and rollback controls",
      "Stage 4 (Longer-term): Validated extension to incident, compliance, sales/support, and reporting workflows",
    ],
    visualType: "intelligence" as const,
  },
];

const SA_STATUTORY_PILLARS = [
  {
    code: "PSIRA",
    detail: "Registration numbers and security officer grades held per guard record.",
  },
  {
    code: "BCEA",
    detail: "Basic Conditions of Employment terms captured during employee onboarding.",
  },
  {
    code: "NBCPSS",
    detail: "Security-officer leave entitlements and cycle balance previews.",
  },
  {
    code: "SARS",
    detail: "Statutory tax exports generated directly from approved payroll runs.",
  },
  {
    code: "UIF",
    detail: "Company reference and monthly statutory deductions tracked per pay period.",
  },
];

export default function ProductPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[#e4e4e4] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Platform Overview
            </p>
            <h1 className="type-display mt-2 text-black">
              Every department of a security company in one connected system.
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700">
              Plethora connects sites, team records, shift rosters, attendance confirmations, leave balances, payroll preparation, and client billing—creating a shared operating view and a controlled foundation for AI assistance.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact#demo-request"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#ff6e14] px-6 py-3 text-base font-medium text-black hover:bg-[#fcb488]"
              >
                <span>Request a platform demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#release-inventory"
                className="inline-flex min-h-[48px] items-center rounded-lg border border-black bg-white px-6 py-3 text-base font-medium text-black hover:bg-[#f7f6f2]"
              >
                Inspect module inventory
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <HeroOperationsPreview />
          </div>
        </div>
      </section>

      {/* Built for South African Rules */}
      <section className="border-b border-[#e4e4e4] bg-[#ff6e14] py-14 sm:py-20 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-black/80">
                Local Domain Fit
              </p>
              <h2 className="type-section-title mt-2 text-black">
                Built for South African guarding rules.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/90">
                Plethora is not a generic international HR tool with a local skin. South African security industry fields live natively inside the employee record, the site timesheet, the leave request, and the payroll run.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="divide-y divide-black/15 rounded-2xl border border-black/20 bg-white p-6 shadow-xs">
                {SA_STATUTORY_PILLARS.map((pillar) => (
                  <div
                    key={pillar.code}
                    className="flex flex-col justify-between gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <span className="font-mono text-sm font-medium text-[#c04900]">
                      {pillar.code}
                    </span>
                    <span className="text-sm text-zinc-800 sm:text-right">
                      {pillar.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module & Capability Inventory */}
      <section
        id="release-inventory"
        aria-labelledby="inventory-heading"
        className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#c04900]">
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>Dated Capability &amp; Release Inventory</span>
            </div>
            <h2
              id="inventory-heading"
              className="type-section-title mt-2 text-black"
            >
              Transparent distinction between live internal modules, active development, and planned AI milestones.
            </h2>
            <p className="mt-3 text-base text-zinc-700">
              Our product roadmap spans 15 modules across workforce and security operations. Below is our verified operating position as documented in the 11 October 2026 business plan.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {MODULE_INVENTORY.map((mod) => (
              <article
                key={mod.id}
                id={mod.id}
                className="bento-card flex flex-col justify-between p-6 sm:p-8 scroll-mt-20"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                      {mod.category}
                    </span>
                    <StatusBadge
                      status={mod.status}
                      customLabel={mod.statusLabel}
                    />
                  </div>

                  <h3 className="font-heading mt-3 text-xl font-medium text-black">
                    {mod.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {mod.summary}
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-[#e4e4e4] pt-4 text-sm text-zinc-800">
                    {mod.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6e14]"
                          aria-hidden="true"
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <BentoCapabilityVisual type={mod.visualType} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Access Control & Governance + WhatsApp Preview */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Access Control &amp; Data Isolation
                </p>
                <h2 className="type-section-title mt-2 text-black">
                  A job title grants nothing automatically.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-700">
                  In Plethora, access is assigned to each user for each module independently. Capabilities do not bleed into one another: permission to edit a record does not imply permission to approve a payroll run or export sensitive financial data.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["View", "Create", "Edit", "Delete", "Approve", "Export"].map(
                  (cap) => (
                    <div
                      key={cap}
                      className="flex items-center justify-between rounded-xl border border-black bg-[#f7f6f2] px-4 py-3 text-sm font-medium text-black"
                    >
                      <span>{cap}</span>
                      <Lock
                        className="h-3.5 w-3.5 text-[#c04900]"
                        aria-hidden="true"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-5 space-y-2 text-sm text-zinc-800">
                <p className="font-medium text-black flex items-center gap-2">
                  <ShieldCheck
                    className="h-4 w-4 text-[#ff6e14]"
                    aria-hidden="true"
                  />
                  <span>Strict tenant isolation &amp; audit logging</span>
                </p>
                <p>
                  Each security company&apos;s operational data is isolated to its own workspace. Every modification to a roster, attendance entry, leave request, or payroll run is logged with the user, the action, and the record reference.
                </p>
              </div>

              <div className="rounded-xl border border-[#e4e4e4] bg-white p-5">
                <p className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  Commercial Structure
                </p>
                <h3 className="font-heading mt-1 text-base font-medium text-black">
                  Monthly subscriptions scaled by guard fleet size
                </h3>
                <p className="mt-1.5 text-sm text-zinc-700">
                  Our commercial model is structured around guard coverage tiers—accommodating Starter fleets (1–50 guards), Growth operators (51–150 guards), Scale fleets (151–300 guards), and Enterprise deployments (300+ guards). Tier limits, onboarding, and integrations are scoped directly during pilot evaluation.
                </p>
                <div className="mt-4">
                  <Link
                    href="/contact#demo-request"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#c04900] hover:text-black"
                  >
                    <span>Scope a pilot for your guard fleet</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <WhatsAppAttendancePreview />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
