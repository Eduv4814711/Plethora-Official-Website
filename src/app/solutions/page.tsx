import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  FileSpreadsheet,
  ShieldCheck,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Solutions — Operational Workflows for Private Security",
  description:
    "See how Plethora connects multi-site guard deployment, pay-period rostering, Occurrence Book attendance verification, NBCPSS leave, and payroll preparation.",
};

const WORKFLOW_SOLUTIONS = [
  {
    id: "multi-site",
    number: "01",
    title: "Multi-site guard & post coordination",
    subtitle: "For operators managing 50 to 250+ guards across diverse client locations",
    status: "available" as const,
    icon: Building2,
    problem:
      "When client site requirements, post counts, and assigned guards are tracked in separate spreadsheets, controllers cannot easily see which locations are under-assigned or how contract changes affect staffing.",
    workflow: [
      "Register each protected location once with its service type (Guarding, Access Control, or Patrols), risk rating, and client contacts.",
      "Break each site into day and night posts with explicit required guard counts.",
      "Assign active guards directly to sites or posts and view live assigned-versus-required status badges.",
    ],
    outcome:
      "Operations managers and controllers work from a single site registry that feeds directly into shift rostering, attendance sheets, and client billing.",
  },
  {
    id: "roster-to-payroll",
    number: "02",
    title: "The connected roster-to-payroll chain",
    subtitle: "Eliminating manual re-keying between scheduling, timesheets, and pay runs",
    status: "available" as const,
    icon: Calendar,
    problem:
      "Re-typing shift schedules into attendance spreadsheets and then re-entering hours into payroll software wastes administrative hours and introduces calculation errors at month-end.",
    workflow: [
      "Generate pay-period-aligned rosters using standard patterns (3 on 3 off, 4 on 4 off, weekdays, or custom rotations).",
      "Review day and night shifts separately on the site timesheet, capturing Duty ON and Duty OFF Occurrence Book (OB) numbers and reliever replacements.",
      "Run the five-stage payroll workflow (Attendance → Create run → Calculate → Approve → Mark paid) where approved timesheets drive hourly guard pay and statutory calculations.",
    ],
    outcome:
      "The roster you publish becomes the timesheet you confirm, and the approved timesheet becomes the audit evidence for the payroll you run.",
  },
  {
    id: "leave-and-relief",
    number: "03",
    title: "NBCPSS leave & relief coverage coordination",
    subtitle: "Managing annual, sick, family responsibility, parental, and study leave",
    status: "available" as const,
    icon: Clock,
    problem:
      "Approving leave without checking cycle balances or coordinating relief cover leads to uncovered posts or timesheet conflicts during payroll calculation.",
    workflow: [
      "Preview leave requests against the employee's leave rules and current cycle balance before submission—accounting for public holidays inside annual leave periods.",
      "Route requests through a structured approval queue with full audit history.",
      "Assign available relief officers on the site roster and timesheet so replacement hours are captured for payroll.",
    ],
    outcome:
      "HR and control room teams maintain clear leave balances while active development continues on deeper in-context leave-and-attendance conflict resolution.",
  },
  {
    id: "governance",
    number: "04",
    title: "Role-based access control & onboarding migration",
    subtitle: "Bringing existing security company records online safely",
    status: "available" as const,
    icon: ShieldCheck,
    problem:
      "Migrating off legacy spreadsheets is risky if bad data is written blindly or if every administrative user has unrestricted access to payroll and billing.",
    workflow: [
      "Configure company parameters once—PSIRA registration, tax number, UIF reference, pay period, and employee ID prefix.",
      "Download structured employee and site CSV templates and run pre-write validation so every formatting error is listed before records are saved.",
      "Assign per-user, per-module capabilities (View, Create, Edit, Delete, Approve, Export) with strict company data isolation.",
    ],
    outcome:
      "Security companies onboard clean operational records while preserving strict separation of duties across control room, HR, and finance staff.",
  },
];

export default function SolutionsPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#e4e4e4] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Operational Workflows &amp; Use Cases
            </p>
            <h1 className="type-display mt-2 text-black">
              Workflows built around how guarding companies actually run.
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700">
              Explore how Plethora replaces disconnected spreadsheets and manual handovers across multi-site deployment, shift rostering, attendance confirmation, and payroll preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Deep Dives */}
      <section className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {WORKFLOW_SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <article
                key={sol.id}
                id={sol.id}
                className="bento-card p-6 sm:p-10 scroll-mt-20"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e4e4] pb-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6e14] font-mono text-sm font-medium text-black">
                      {sol.number}
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-medium text-black sm:text-2xl">
                        {sol.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-600">
                        {sol.subtitle}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={sol.status} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-xl bg-[#f7f6f2] border border-[#e4e4e4] p-5">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                        The Operational Challenge
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                        {sol.problem}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#fff3eb] border border-[#fcb488] p-5">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                        Connected Outcome
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-black">
                        {sol.outcome}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-8 flex flex-col justify-between rounded-xl border border-[#e4e4e4] bg-white p-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500">
                        <Icon className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                        <span>Step-by-Step Operational Flow</span>
                      </div>
                      <ol className="mt-4 space-y-4">
                        {sol.workflow.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6e14]"
                              aria-hidden="true"
                            />
                            <span className="text-sm sm:text-base leading-relaxed text-zinc-800">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e4e4] pt-4 text-xs text-zinc-600">
                      <span>
                        Governed by per-module role permissions and audit logging
                      </span>
                      <Link
                        href="/contact#demo-request"
                        className="font-medium text-[#c04900] hover:text-black"
                      >
                        Request a walkthrough of this workflow →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Onboarding & Migration Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-black bg-black p-8 sm:p-12 text-white">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#fcb488]">
                  <Upload className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                  <span>Structured Onboarding &amp; Pilot Scoping</span>
                </div>
                <h2 className="type-section-title mt-2 text-white">
                  Evaluate Plethora through a controlled operational pilot.
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300">
                  We work directly with South African private security operators to discover your current rostering, attendance, and payroll workflow, import existing employee and site CSV records with pre-write validation, and define clear success criteria for a controlled pilot.
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  href="/contact#demo-request"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#ff6e14] px-6 py-3 text-base font-medium text-black hover:bg-[#fcb488]"
                >
                  <span>Request a demo &amp; pilot discussion</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/blog/how-security-companies-can-evaluate-workforce-management-software"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Read our software evaluation guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
