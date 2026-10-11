import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  FileSpreadsheet,
  Receipt,
  ShieldAlert,
  Sparkles,
  Users,
  Lock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  HeroOperationsPreview,
  WhatsAppAttendancePreview,
  BentoCapabilityVisual,
} from "@/components/product-previews";
import {
  DemoRequestForm,
  EmailSubscriptionForm,
} from "@/components/conversion-forms";
import { getPublishedArticles } from "@/lib/blog";
import { getSiteSettings } from "@/lib/site-settings";

const OPERATIONAL_PROBLEMS = [
  {
    number: "01",
    title: "Fragmented workforce and site information",
    description:
      "Guard records, PSIRA registration details, employment terms, and client site post requirements are often scattered across disconnected files and spreadsheets.",
  },
  {
    number: "02",
    title: "Complex rostering across multiple locations",
    description:
      "Coordinating day shifts, night shifts, rotation patterns, and relief cover across dozens of client posts creates scheduling friction when rosters are managed manually.",
  },
  {
    number: "03",
    title: "Inconsistent attendance records",
    description:
      "When frontline shift check-ins, Occurrence Book (OB) numbers, and reliever assignments arrive out of sync with the published roster, timesheets require manual reconstruction.",
  },
  {
    number: "04",
    title: "Difficult payroll preparation",
    description:
      "Turning shift hours, overtime, Sunday and public-holiday rules, and leave balances into an accurate payroll run stalls when attendance exceptions remain unresolved at cut-off.",
  },
  {
    number: "05",
    title: "Disconnected administrative workflows",
    description:
      "Re-keying information between HR records, leave requests, site rosters, payroll runs, and client billing increases administrative workload and introduces avoidable discrepancies.",
  },
  {
    number: "06",
    title: "Limited visibility into operational exceptions",
    description:
      "Without a shared operating view, controllers and managers struggle to spot unconfirmed shifts, coverage gaps, or payroll blockers until the end of the pay period.",
  },
];

const CONNECTED_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Organise workforce and site records",
    detail:
      "Register hourly guards and salaried office staff once—capturing SA ID details, PSIRA grades, BCEA employment terms, and client site post requirements.",
  },
  {
    step: "02",
    title: "Plan and assign shifts",
    detail:
      "Generate shift schedules using standard security rotation patterns (such as 3 on 3 off or 4 on 4 off) aligned directly to the company's pay period.",
  },
  {
    step: "03",
    title: "Capture and review attendance",
    detail:
      "Confirm day and night shift entries against the published roster, record Duty ON and Duty OFF Occurrence Book (OB) numbers, and log relief officers.",
  },
  {
    step: "04",
    title: "Support payroll preparation",
    detail:
      "Feed approved site timesheets and leave records into a five-stage payroll run with explicit blocker checks before calculation and approval.",
  },
  {
    step: "05",
    title: "Connect client and deployment records to billing",
    detail:
      "Link client site contracts, active guard allocations, and billing rates to invoices, quotes, and client statements.",
  },
  {
    step: "06",
    title: "Review exceptions and operational information",
    detail:
      "Surface open attendance discrepancies, staffing shortages, and pending approvals within a role-gated environment with full audit logging.",
  },
];

const AI_ROADMAP_STAGES = [
  {
    stage: "Stage 1",
    title: "Operational foundation",
    status: "available" as const,
    statusText: "Internal operating base",
    outcome:
      "Reliable workforce, site, roster, attendance, leave, and payroll support records governed by granular role-based access control.",
    releaseGate:
      "Named live workflows, module-level access control (View, Create, Edit, Delete, Approve, Export), and action audit trails.",
  },
  {
    stage: "Stage 2",
    title: "AI assistant",
    status: "planned" as const,
    statusText: "12-month roadmap objective",
    outcome:
      "An operations-aware assistant designed to answer defined questions and help authorised users navigate approved tasks using relevant workforce and site context.",
    releaseGate:
      "Production release record, scoped use cases, permission boundary tests, answer quality review, and monitoring.",
  },
  {
    stage: "Stage 3",
    title: "Agent workflows",
    status: "planned" as const,
    statusText: "12-month roadmap objective",
    outcome:
      "Selected repeatable administrative workflows with defined action boundaries, exception handling, and mandatory human review or approval.",
    releaseGate:
      "Documented action boundaries, exception handling, audit logs, human approval gates, and rollback or correction paths.",
  },
  {
    stage: "Stage 4",
    title: "Expanded operations",
    status: "planned" as const,
    statusText: "Longer-term roadmap",
    outcome:
      "Progressive extension of validated assistance to incident, compliance, sales/support, and operational reporting use cases.",
    releaseGate:
      "Each use case separately validated for accuracy, data privacy, security, and documented operational value.",
  },
];

const OPERATIONAL_ROLES = [
  {
    role: "Security controllers",
    focus: "Post coverage & shift handovers",
    description:
      "Monitor day and night shift assignments by site, assign available relievers when absences occur, and capture Occurrence Book (OB) numbers against the roster.",
  },
  {
    role: "Operations managers",
    focus: "Multi-site visibility & exception management",
    description:
      "Coordinate 50 to 250+ guards across client sites, track assigned versus required guard counts, and resolve operational alerts before they impact client service.",
  },
  {
    role: "HR and payroll teams",
    focus: "Single employee record & timesheet-to-pay chain",
    description:
      "Maintain unified guard and office staff records with PSIRA, BCEA, and NBCPSS leave balances that flow directly into payroll preparation without re-keying.",
  },
  {
    role: "Finance teams",
    focus: "Controlled payroll approvals & client billing",
    description:
      "Rely on a five-stage payroll approval pipeline with attendance blocker checks, contract labour cost summaries, SARS export support, and client invoicing.",
  },
  {
    role: "Business owners & directors",
    focus: "Operational governance & auditability",
    description:
      "Gain a clear operating picture across workforce deployment, payroll readiness, and client accounts—with independent per-user permissions and an audit trail of every change.",
  },
];

export default function HomePage() {
  const latestArticles = getPublishedArticles().slice(0, 3);
  const settings = getSiteSettings();

  return (
    <div>
      {/* SECTION 2: HERO */}
      <section className="border-b border-[#e4e4e4] bg-white pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e4e4e4] bg-[#f7f6f2] px-3.5 py-1.5 text-xs font-medium text-black">
              <span className="h-2 w-2 rounded-full bg-[#ff6e14]" aria-hidden="true" />
              <span>{settings.heroBadgeText}</span>
            </div>

            <h1 className="type-display text-black">
              {settings.heroHeadline}
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700">
              {settings.heroSubheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/contact#demo-request"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#ff6e14] px-6 py-3 text-base font-medium text-black transition-colors hover:bg-[#fcb488]"
              >
                <span>Request a demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/product"
                className="inline-flex min-h-[48px] items-center rounded-lg border border-black bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-[#f7f6f2]"
              >
                Explore the platform
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-600">
              Designed for South African private security operators (50–250+ guards) · Role-based permissions &amp; human approval by design
            </p>
          </div>

          <div className="mt-12 sm:mt-14">
            <HeroOperationsPreview />
          </div>
        </div>
      </section>

      {/* SECTION 3: THE OPERATIONAL PROBLEM */}
      <section
        aria-labelledby="operational-problem-heading"
        className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              The Operational Problem
            </p>
            <h2
              id="operational-problem-heading"
              className="type-section-title mt-2 text-black"
            >
              Security operations break down when critical records live in separate tools.
            </h2>
            <p className="mt-4 text-base text-zinc-700">
              Private security firms coordinate guards across client sites, day and night shifts, and changing service requirements. When rosters, attendance confirmations, leave records, and payroll preparation are disconnected, teams spend valuable operational time reconciling spreadsheets rather than managing exceptions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {OPERATIONAL_PROBLEMS.map((item) => (
              <div
                key={item.number}
                className="bento-card flex flex-col justify-between p-6"
              >
                <div>
                  <span className="font-mono text-xs font-medium text-[#c04900]">
                    {item.number}
                  </span>
                  <h3 className="font-heading mt-2 text-lg font-medium text-black">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCT BENTO GRID */}
      <section
        aria-labelledby="product-bento-heading"
        className="border-b border-[#e4e4e4] bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                Connected Platform Architecture
              </p>
              <h2
                id="product-bento-heading"
                className="type-section-title mt-2 text-black"
              >
                One connected view of your workforce operations.
              </h2>
              <p className="mt-3 text-base text-zinc-700">
                Plethora brings frontline guard deployment and back-office administration into a shared operating environment, with transparent release status across current modules and roadmap capabilities.
              </p>
            </div>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#c04900] hover:text-black"
            >
              <span>View full module &amp; release inventory</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Deliberate Asymmetric Bento Grid */}
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Card 1: Workforce & Deployment (7 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 sm:p-7 lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <Building2 className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Workforce &amp; Deployment</span>
                  </div>
                  <StatusBadge status="available" />
                </div>
                <h3 className="font-heading mt-3 text-xl font-medium text-black">
                  Unified guard, office staff, and client site records
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Maintain one authoritative record per employee and per client site. Capture 13-digit South African ID details, PSIRA registration numbers, BCEA terms, and pay grades alongside site risk ratings, posts, and required guard counts.
                </p>
              </div>
              <BentoCapabilityVisual type="workforce" />
            </article>

            {/* Card 2: Rostering (5 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <CalendarCheck className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Rostering</span>
                  </div>
                  <StatusBadge status="available" />
                </div>
                <h3 className="font-heading mt-3 text-xl font-medium text-black">
                  Shift planning aligned to your pay period
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Generate shift rosters using standard security rotations (`3 on 3 off`, `4 on 4 off`, weekdays, or custom patterns), inspect coverage gaps, and export plain-language PDF schedules per guard or site.
                </p>
              </div>
              <BentoCapabilityVisual type="rostering" />
            </article>

            {/* Card 3: Attendance & Communication (5 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 sm:p-7 lg:col-span-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <ClipboardCheck className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Attendance &amp; Communication</span>
                  </div>
                  <StatusBadge status="available" />
                </div>
                <h3 className="font-heading mt-3 text-xl font-medium text-black">
                  Timesheets backed by OB references and WhatsApp flows
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Review day and night shifts separately against the published roster, record Duty ON and Duty OFF Occurrence Book (OB) numbers, add relief guards, and message guards directly via WhatsApp.
                </p>
              </div>
              <BentoCapabilityVisual type="attendance" />
            </article>

            {/* Card 4: Payroll Support (7 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 sm:p-7 lg:col-span-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <FileSpreadsheet className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Payroll Support</span>
                  </div>
                  <StatusBadge status="available" />
                </div>
                <h3 className="font-heading mt-3 text-xl font-medium text-black">
                  From approved site timesheets to controlled payroll runs
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Follow a gated five-stage workflow—Attendance, Create Run, Calculate, Approve, and Mark Paid. Configured pay grades, overtime, Sunday, and public-holiday rules calculate automatically once attendance blockers are cleared.
                </p>
              </div>
              <BentoCapabilityVisual type="payroll" />
            </article>

            {/* Card 5: Billing & Administration (4 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <Receipt className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Billing &amp; Administration</span>
                  </div>
                  <StatusBadge status="available" />
                </div>
                <h3 className="font-heading mt-3 text-lg font-medium text-black">
                  Client billing, quotes, and statements
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Connect client accounts, contract guard allocations, and site billing rates to invoices, quotes, and accounts receivable tracking.
                </p>
              </div>
              <BentoCapabilityVisual type="billing" />
            </article>

            {/* Card 6: Compliance & Incidents (4 cols) */}
            <article className="bento-card flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <ShieldAlert className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Compliance &amp; Incidents</span>
                  </div>
                  <StatusBadge
                    status="in-development"
                    customLabel="In development"
                  />
                </div>
                <h3 className="font-heading mt-3 text-lg font-medium text-black">
                  South African statutory fields &amp; incident workflows
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  Employee and payroll records include native PSIRA, BCEA, NBCPSS leave, SARS, and UIF fields today, while dedicated incident and compliance modules are in active development.
                </p>
              </div>
              <BentoCapabilityVisual type="compliance" />
            </article>

            {/* Card 7: Operational Intelligence (4 cols - Dark Surface) */}
            <article className="bento-card-dark flex flex-col justify-between p-6 lg:col-span-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-medium text-[#fcb488]">
                    <Sparkles className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Operational Intelligence</span>
                  </div>
                  <StatusBadge
                    status="planned"
                    customLabel="12-month roadmap"
                    darkSurface
                  />
                </div>
                <h3 className="font-heading mt-3 text-lg font-medium text-white">
                  Controlled foundation for AI assistance
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Structured operational records and per-module permissions establish the foundation for our upcoming operations-aware AI assistant and human-approved agent workflows.
                </p>
              </div>
              <BentoCapabilityVisual type="intelligence" />
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 5: CONNECTED OPERATIONAL WORKFLOW */}
      <section
        aria-labelledby="connected-workflow-heading"
        className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Connected Operational Chain
            </p>
            <h2
              id="connected-workflow-heading"
              className="type-section-title mt-2 text-black"
            >
              One shared record from site setup to payroll preparation.
            </h2>
            <p className="mt-4 text-base text-zinc-700">
              Instead of exporting and re-typing data between departments, each operational step builds on the verified records of the previous step—governed by role-based permissions and human review.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONNECTED_WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-[#e4e4e4] bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6e14] font-mono text-xs font-medium text-black">
                    {item.step}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    Connected Record
                  </span>
                </div>
                <h3 className="font-heading mt-4 text-base font-medium text-black">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#d0ceca] bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#c04900]" aria-hidden="true" />
              <p className="text-sm text-zinc-800">
                <strong className="font-medium text-black">
                  Why data quality and permissions come first:
                </strong>{" "}
                Every module enforces independent capabilities (`View`, `Create`, `Edit`, `Delete`, `Approve`, `Export`) and logs every record change—creating the structured context required for dependable AI assistance.
              </p>
            </div>
            <Link
              href="/solutions"
              className="shrink-0 text-sm font-medium text-[#c04900] hover:text-black"
            >
              Explore workflows →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHATSAPP AND FRONTLINE WORKFLOWS */}
      <section
        aria-labelledby="whatsapp-workflow-heading"
        className="border-b border-[#e4e4e4] bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                Frontline &amp; Control Room Connection
              </p>
              <h2
                id="whatsapp-workflow-heading"
                className="type-section-title mt-2 text-black"
              >
                Connect frontline guards to operational records through WhatsApp.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-700">
                Security guards work on client sites, not behind office desks. Plethora includes direct WhatsApp communication from employee records and a documented WhatsApp attendance workflow designed to bridge frontline posts and control room administration.
              </p>

              <ol className="mt-6 space-y-4">
                {[
                  {
                    title: "1. Guard receives an attendance instruction",
                    text: "The guard receives a structured shift prompt for their assigned post with a clear clock-in or clock-out instruction.",
                  },
                  {
                    title: "2. Guard submits the requested location",
                    text: "Using native WhatsApp location sharing, the guard submits their arrival or departure check-in without installing a separate heavy mobile app.",
                  },
                  {
                    title: "3. System validates the attendance event against applicable rules",
                    text: "The check-in event is evaluated against the configured site parameters and shift window.",
                  },
                  {
                    title: "4. Recorded event becomes available to authorised users",
                    text: "Control room and payroll staff review attendance entries alongside Occurrence Book (OB) numbers before approving the site timesheet.",
                  },
                ].map((step) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-[#ff6e14]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-heading text-sm font-medium text-black">
                        {step.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-700">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-6">
              <WhatsAppAttendancePreview />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: THE AI ROADMAP */}
      <section
        aria-labelledby="ai-roadmap-heading"
        className="border-b border-zinc-800 bg-black py-16 text-white sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#fcb488]">
              Staged AI Product Strategy
            </p>
            <h2
              id="ai-roadmap-heading"
              className="type-section-title mt-2 text-white"
            >
              AI introduced through defined use cases, permissions, and human approval.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              AI is central to Plethora&apos;s long-term strategy, but security operations demand strict accountability. Our roadmap progresses through four explicit stages—where production launch and validation of our first AI assistant and agent workflows are 12-month objectives gated by permission checks and human sign-off.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {AI_ROADMAP_STAGES.map((item) => (
              <div
                key={item.stage}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-[#ff6e14]">
                      {item.stage}
                    </span>
                    <StatusBadge
                      status={item.status}
                      customLabel={item.statusText}
                      darkSurface
                    />
                  </div>
                  <h3 className="font-heading mt-4 text-lg font-medium text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
                    {item.outcome}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-800/80 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                    Release Gate
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {item.releaseGate}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-300">
            <strong className="font-medium text-white">
              Governance principle:
            </strong>{" "}
            Plethora does not replace the operational judgement of security controllers or managers. Any AI-assisted action affecting staffing, pay, client service, or official records must respect role-based permissions and receive appropriate human approval.
          </div>
        </div>
      </section>

      {/* SECTION 8: DESIGNED FOR THE REALITIES OF SECURITY OPERATIONS */}
      <section
        aria-labelledby="roles-heading"
        className="border-b border-[#e4e4e4] bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Built for Every Operational Role
            </p>
            <h2
              id="roles-heading"
              className="type-section-title mt-2 text-black"
            >
              Designed for the realities of security operations.
            </h2>
            <p className="mt-4 text-base text-zinc-700">
              A shared operating environment reduces fragmented administration while giving each team member access only to the modules and actions matched to their responsibilities.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {OPERATIONAL_ROLES.map((item) => (
              <div
                key={item.role}
                className="bento-card-warm flex flex-col justify-between p-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c04900]">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{item.focus}</span>
                  </div>
                  <h3 className="font-heading mt-2.5 text-lg font-medium text-black">
                    {item.role}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-[#fcb488] bg-[#fff3eb] p-6 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  Internal Operating Base
                </p>
                <h3 className="font-heading mt-2 text-lg font-medium text-black">
                  Grounded in live security operations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                  {settings.showInternalDeploymentMetrics
                    ? settings.internalDeploymentSummary
                    : "Plethora was originated inside an active South African private security company, providing a practical proving ground for workflow depth before external customer rollouts."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#fcb488]/60">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-black hover:text-[#c04900]"
                >
                  <span>Read about our origin &amp; mission</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: EARLY ACCESS AND DEMO CONVERSION */}
      <section
        id="conversion"
        aria-labelledby="conversion-heading"
        className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Evaluate Plethora
            </p>
            <h2
              id="conversion-heading"
              className="type-section-title mt-2 text-black"
            >
              Build a better way to manage security operations.
            </h2>
            <p className="mt-3 text-base text-zinc-700">
              Explore how connected workforce workflows can give your security operation a clearer operating picture.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Journey 1: Demo Request */}
            <div className="rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-8 lg:col-span-7">
              <div className="mb-6 border-b border-[#e4e4e4] pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  Journey 01 · Platform Evaluation
                </span>
                <h3
                  id="demo-form-heading"
                  className="font-heading mt-1 text-xl font-medium text-black"
                >
                  Request a scoped operational demo
                </h3>
                <p className="mt-1 text-sm text-zinc-600">
                  For private security companies interested in evaluating Plethora for their guard fleet.
                </p>
              </div>
              <DemoRequestForm />
            </div>

            {/* Journey 2: Email Subscription */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-8 lg:col-span-5">
              <div>
                <div className="mb-6 border-b border-[#e4e4e4] pb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-600">
                    Journey 02 · Product Updates &amp; Insights
                  </span>
                  <h3
                    id="subscribe-form-heading"
                    className="font-heading mt-1 text-xl font-medium text-black"
                  >
                    Follow our product &amp; AI roadmap
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Receive release updates, security operations articles, and early-access announcements.
                  </p>
                </div>
                <EmailSubscriptionForm source="homepage" />
              </div>

              <div className="mt-8 rounded-xl bg-[#f7f6f2] border border-[#e4e4e4] p-4 text-xs leading-relaxed text-zinc-700">
                <p className="font-medium text-black">
                  Separated communication journeys
                </p>
                <p className="mt-1">
                  We keep demo enquiries and email subscriptions separate. Requesting a demo only authorises us to respond to your operational enquiry—never to add you to unrelated marketing lists without explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: BLOG PREVIEW */}
      <section
        aria-labelledby="blog-preview-heading"
        className="bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                Editorial &amp; Operational Insights
              </p>
              <h2
                id="blog-preview-heading"
                className="type-section-title mt-2 text-black"
              >
                Perspectives on private security workforce management.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#c04900] hover:text-black"
            >
              <span>View all articles</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestArticles.map((article) => (
              <article
                key={article.slug}
                className="bento-card flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Restrained Editorial Cover Header */}
                  <div className="border-b border-[#e4e4e4] bg-[#f7f6f2] p-5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-medium text-[#c04900]">
                        {article.coverLabel}
                      </span>
                      <span className="rounded bg-white border border-[#e4e4e4] px-2 py-0.5 text-[11px] text-zinc-600">
                        {article.readingTimeMinutes} min read
                      </span>
                    </div>
                    <p className="mt-3 font-mono text-xs text-zinc-800">
                      {article.coverHighlight}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                      <span className="font-medium text-black">
                        {article.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={article.publishedAt}>
                        {article.publishedAt}
                      </time>
                    </div>

                    <h3 className="font-heading mt-2.5 text-lg font-medium text-black">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:text-[#c04900]"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#e4e4e4] px-6 py-3.5 flex items-center justify-between bg-white">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <BookOpen className="h-3.5 w-3.5 text-[#ff6e14]" aria-hidden="true" />
                    <span>{article.editorialNotice}</span>
                  </span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-medium text-black hover:text-[#c04900]"
                    aria-label={`Read article: ${article.title}`}
                  >
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
