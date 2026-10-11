import React from "react";
import { BrandLogo } from "@/components/brand-logo";
import { StatusBadge } from "@/components/status-badge";
import {
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  FileSpreadsheet,
  Lock,
} from "lucide-react";

export function HeroOperationsPreview() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#d0ceca] bg-[#f7f6f2] shadow-sm"
      role="region"
      aria-label="Illustrative preview of the Plethora ERP connected operations workspace"
    >
      {/* Authentic Plethora ERP Orange Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ff6e14] px-4 py-2.5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded bg-white/15 px-2 py-1">
            <BrandLogo variant="icon" height={18} />
            <span className="font-mono text-xs font-medium tracking-wider text-white">
              PLETHORA
            </span>
          </div>
          <span className="text-xs font-medium text-white/90">
            Security Operations Workspace
          </span>
        </div>

        <div
          className="hidden lg:flex items-center gap-1 text-xs font-medium"
          aria-hidden="true"
        >
          <span className="rounded-full bg-white px-3 py-1 text-black">
            Dashboard
          </span>
          <span className="px-2.5 py-1 text-white/90">Team</span>
          <span className="px-2.5 py-1 text-white/90">Leave</span>
          <span className="px-2.5 py-1 text-white/90">Sites</span>
          <span className="px-2.5 py-1 text-white/90">Rostering</span>
          <span className="px-2.5 py-1 text-white/90">Attendance</span>
          <span className="px-2.5 py-1 text-white/90">Payroll</span>
          <span className="px-2.5 py-1 text-white/90">Client Billing</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-[11px] text-white">
            Illustrative Preview · Demo Data
          </span>
        </div>
      </div>

      {/* Main ERP Canvas */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-3 border-b border-[#e4e4e4] pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#c04900]">
              Operations Overview · Pay Period Aligned (26 Sep – 25 Oct)
            </p>
            <h2 className="font-heading mt-0.5 text-lg font-medium text-black">
              Connected Workforce & Site Operations
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5ad824]/50 bg-[#f4fde8] px-3 py-1 text-xs font-medium text-black">
              <span className="h-2 w-2 rounded-full bg-[#5ad824]" />
              Roster & Pay Period Linked
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e4e4] bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              Role-Based Access Active
            </span>
          </div>
        </div>

        {/* 3-Column Connected Workflow Preview */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Column 1: Sites & Rostering */}
          <div className="lg:col-span-5 rounded-xl border border-[#e4e4e4] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                01 · Sites & Rostering
              </span>
              <span className="rounded bg-[#f4fde8] px-2 py-0.5 text-[11px] font-medium text-black">
                Pattern: 3 on 3 off
              </span>
            </div>
            <p className="font-heading mt-1 text-sm font-medium text-black">
              Control Room & Perimeter Posts
            </p>
            <p className="text-xs text-zinc-600">
              Published shift schedule aligned to monthly pay period
            </p>

            <div className="mt-3 space-y-2 border-t border-[#e4e4e4] pt-3 text-xs">
              {[
                {
                  guard: "Guard #QBS-014 (Grade B)",
                  mon: "Day shift",
                  tue: "Day shift",
                  wed: "Night shift",
                },
                {
                  guard: "Guard #QBS-029 (Grade C)",
                  mon: "Night shift",
                  tue: "Off",
                  wed: "Day shift",
                },
                {
                  guard: "Guard #QBS-042 (Reliever)",
                  mon: "Off",
                  tue: "Night shift",
                  wed: "Day shift",
                },
              ].map((row) => (
                <div
                  key={row.guard}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[#f7f6f2] px-2.5 py-2"
                >
                  <span className="font-medium text-black truncate">
                    {row.guard}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="rounded bg-[#fff3eb] border border-[#fcb488] px-1.5 py-0.5 text-[10px] font-medium text-[#c04900]">
                      {row.mon}
                    </span>
                    <span className="rounded bg-white border border-[#e4e4e4] px-1.5 py-0.5 text-[10px] text-zinc-700">
                      {row.tue}
                    </span>
                    <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white">
                      {row.wed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Attendance & OB Verification */}
          <div className="lg:col-span-4 rounded-xl border border-[#e4e4e4] bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                02 · Site Timesheet
              </span>
              <span className="rounded bg-[#fff8eb] border border-[#f4a834]/50 px-2 py-0.5 text-[11px] font-medium text-black">
                OB Verification
              </span>
            </div>
            <p className="font-heading mt-1 text-sm font-medium text-black">
              Day & Night Shift Confirmation
            </p>
            <p className="text-xs text-zinc-600">
              Confirm against roster with Occurrence Book refs
            </p>

            <div className="mt-3 space-y-2 border-t border-[#e4e4e4] pt-3 text-xs">
              <div className="rounded-lg border border-[#e4e4e4] p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">
                    06:00 – 18:00 · Day Shift
                  </span>
                  <span className="rounded bg-[#f4fde8] px-1.5 py-0.5 text-[10px] font-medium text-black">
                    Confirmed
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-zinc-600">
                  <span>ON OB: #061</span>
                  <span>OFF OB: #074</span>
                  <span>12.0 hrs</span>
                </div>
              </div>

              <div className="rounded-lg border border-[#f4a834]/60 bg-[#fff8eb]/60 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">
                    18:00 – 06:00 · Night Shift
                  </span>
                  <span className="rounded bg-[#f4a834]/30 px-1.5 py-0.5 text-[10px] font-medium text-black">
                    Needs confirmation
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-zinc-700">
                  <span>ON OB: #075</span>
                  <span>Reliever assigned</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Payroll Process Guide */}
          <div className="lg:col-span-3 rounded-xl border border-[#e4e4e4] bg-white p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  03 · Payroll Run
                </span>
                <span className="font-mono text-[11px] text-[#c04900]">
                  5-Stage Gate
                </span>
              </div>
              <p className="font-heading mt-1 text-sm font-medium text-black">
                Controlled Approval Pipeline
              </p>

              <ol className="mt-3 space-y-1.5 border-t border-[#e4e4e4] pt-3 text-xs">
                {[
                  { step: "1. Attendance", state: "Verified per site", active: true },
                  { step: "2. Create run", state: "Open pay period", active: true },
                  {
                    step: "3. Calculate",
                    state: "Pay grades & statutory",
                    active: true,
                  },
                  { step: "4. Approve", state: "Finance sign-off", active: false },
                  { step: "5. Mark paid", state: "Close & SARS export", active: false },
                ].map((item) => (
                  <li
                    key={item.step}
                    className="flex items-center justify-between rounded px-2 py-1 bg-[#f7f6f2]"
                  >
                    <span className="font-medium text-black">{item.step}</span>
                    <span className="text-[11px] text-zinc-600">{item.state}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-3 rounded-lg bg-[#fff3eb] border border-[#fcb488] px-2.5 py-2 text-[11px] text-black">
              <span className="font-medium text-[#c04900]">Blocker rule:</span>{" "}
              Calculation remains locked until open attendance exceptions are resolved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppAttendancePreview() {
  return (
    <div
      className="rounded-2xl border border-[#e4e4e4] bg-white p-5 sm:p-6 shadow-xs"
      role="region"
      aria-label="Illustrative WhatsApp attendance workflow preview"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e4e4] pb-4">
        <div className="flex items-center gap-2.5">
          <BrandLogo variant="icon" height={24} />
          <div>
            <p className="font-heading text-sm font-medium text-black">
              Plethora Frontline Attendance Flow
            </p>
            <p className="text-xs text-zinc-600">
              Documented WhatsApp check-in & clock-out example
            </p>
          </div>
        </div>
        <StatusBadge
          status="illustrative"
          customLabel="Illustrative flow · Sanitised demo data"
        />
      </div>

      <div className="mt-5 space-y-3.5 text-xs sm:text-sm">
        {/* Step 1: Prompt */}
        <div className="max-w-[88%] rounded-xl rounded-tl-none border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-black">
          <p className="font-mono text-[11px] text-zinc-500 mb-1">
            STEP 1 · SHIFT INSTRUCTION PROMPT
          </p>
          <p>
            🏢 Clock in for <strong>Control Room Post</strong>. Tap{" "}
            <span className="font-medium text-[#c04900]">
              &lsquo;Send Location&rsquo;
            </span>{" "}
            below to submit your arrival check-in.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[#d0ceca] bg-white px-2.5 py-1 text-xs font-medium text-black">
            <MapPin className="h-3.5 w-3.5 text-[#ff6e14]" aria-hidden="true" />
            <span>Send location</span>
          </div>
        </div>

        {/* Step 2: Guard Location Pin */}
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-none border border-[#fcb488] bg-[#fff3eb] p-3.5 text-black">
          <p className="font-mono text-[11px] text-[#c04900] mb-1">
            STEP 2 · GUARD LOCATION SUBMISSION
          </p>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#fcb488]/60 bg-white p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#ff6e14] text-black">
              <MapPin className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="text-xs">
              <p className="font-medium text-black">
                Shared Location Pin (Demonstration)
              </p>
              <p className="font-mono text-[11px] text-zinc-600">
                Guard #QBS-014 · 15:03 SAST
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: System Rule Check */}
        <div className="max-w-[90%] rounded-xl rounded-tl-none border border-[#5ad824]/50 bg-[#f4fde8] p-3.5 text-black">
          <p className="font-mono text-[11px] text-zinc-600 mb-1">
            STEP 3 · ATTENDANCE EVENT RECORDED
          </p>
          <p className="font-medium text-black">
            ✅ Clock-in recorded for today at 15:03.
          </p>
          <p className="mt-1 text-xs text-zinc-800">
            📍 Matched against <strong>Control Room Post</strong> rules. Reply{" "}
            <code className="rounded bg-white px-1 py-0.5 font-mono">2</code> or{" "}
            <strong>clock out</strong> when finishing duty.
          </p>
        </div>

        {/* Step 4: Control Room Sync */}
        <div className="rounded-xl border border-black bg-black p-3.5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#fcb488]">
              STEP 4 · OPERATIONAL VISIBILITY
            </span>
            <span className="font-mono text-[11px] text-zinc-400">
              Role-Gated Access
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-200">
            The recorded attendance event surfaces for authorised control room and payroll staff alongside site timesheets and Occurrence Book (OB) verification.
          </p>
        </div>
      </div>
    </div>
  );
}

export function BentoCapabilityVisual({
  type,
}: {
  type:
    | "workforce"
    | "rostering"
    | "attendance"
    | "payroll"
    | "billing"
    | "compliance"
    | "intelligence";
}) {
  switch (type) {
    case "workforce":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              EMPLOYEE & SITE RECORD
            </span>
            <span className="rounded bg-white border border-[#e4e4e4] px-2 py-0.5 font-mono text-[10px] text-black">
              13-Digit SA ID + PSIRA
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white p-2.5 border border-[#e4e4e4]">
              <p className="text-[11px] text-zinc-500">Staff Classification</p>
              <p className="font-medium text-black mt-0.5">
                Guard (Hourly · Pay-Graded)
              </p>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                Office Staff (Fixed Salary)
              </p>
            </div>
            <div className="rounded-lg bg-white p-2.5 border border-[#e4e4e4]">
              <p className="text-[11px] text-zinc-500">Lifecycle Tracking</p>
              <p className="font-mono text-[11px] font-medium text-[#c04900] mt-0.5">
                Applicant → Hired → Active
              </p>
              <p className="text-[11px] text-zinc-600 mt-0.5">
                CSV bulk import validator
              </p>
            </div>
          </div>
        </div>
      );

    case "rostering":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              SHIFT PATTERN GENERATOR
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black">
              <Calendar className="h-3 w-3 text-[#ff6e14]" aria-hidden="true" />
              Pay-period aligned
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["3 on 3 off", "4 on 4 off", "Weekdays", "Custom pattern"].map(
              (pat, i) => (
                <span
                  key={pat}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    i === 0
                      ? "bg-[#ff6e14] text-black"
                      : "bg-white border border-[#e4e4e4] text-zinc-800"
                  }`}
                >
                  {pat}
                </span>
              )
            )}
          </div>
          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white border border-[#e4e4e4] px-3 py-2">
            <span className="text-zinc-700">
              Plain-language schedule &amp; PDF export
            </span>
            <span className="font-mono text-[11px] text-[#c04900]">
              Day · Night · Off
            </span>
          </div>
        </div>
      );

    case "attendance":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              TIMESHEET &amp; OB CAPTURE
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#c04900]">
              <Clock className="h-3 w-3" aria-hidden="true" />
              Day &amp; Night reviewed separately
            </span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center justify-between rounded bg-white border border-[#e4e4e4] px-2.5 py-1.5">
              <span className="font-medium text-black">
                Occurrence Book (OB) Numbers
              </span>
              <span className="font-mono text-[11px] text-zinc-700">
                Duty ON / Duty OFF
              </span>
            </div>
            <div className="flex items-center justify-between rounded bg-white border border-[#e4e4e4] px-2.5 py-1.5">
              <span className="font-medium text-black">
                Relievers &amp; Unrostered Guards
              </span>
              <span className="rounded bg-[#f4fde8] px-1.5 py-0.5 text-[10px] font-medium text-black">
                Included in payroll
              </span>
            </div>
          </div>
        </div>
      );

    case "payroll":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              5-STAGE PAYROLL WORKFLOW
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black">
              <FileSpreadsheet
                className="h-3 w-3 text-[#ff6e14]"
                aria-hidden="true"
              />
              SARS &amp; UIF Exports
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
            {["1. Attend", "2. Create", "3. Calc", "4. Approve", "5. Paid"].map(
              (s, idx) => (
                <div
                  key={s}
                  className={`rounded py-1.5 px-1 border ${
                    idx < 3
                      ? "border-[#fcb488] bg-[#fff3eb] text-black font-medium"
                      : "border-[#e4e4e4] bg-white text-zinc-600"
                  }`}
                >
                  {s}
                </div>
              )
            )}
          </div>
        </div>
      );

    case "billing":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              CLIENT BILLING &amp; AR
            </span>
            <span className="font-mono text-[10px] text-zinc-700">
              Invoices · Quotes · Statements
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white border border-[#e4e4e4] px-3 py-2">
            <span>Site billing rates &amp; guard allocation</span>
            <span className="rounded bg-[#f7f6f2] border border-[#e4e4e4] px-2 py-0.5 font-mono text-[10px] text-black">
              Account statements
            </span>
          </div>
        </div>
      );

    case "compliance":
      return (
        <div className="mt-4 rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-3.5 text-xs">
          <div className="flex items-center justify-between border-b border-[#e4e4e4] pb-2">
            <span className="font-mono text-[11px] text-zinc-600">
              REGULATORY &amp; INCIDENT WORKFLOWS
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#c04900]">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              SA Statutory Fields
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["PSIRA Grades", "BCEA Terms", "NBCPSS Leave", "SARS / UIF"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded bg-white border border-[#e4e4e4] px-2 py-1 text-[11px] font-medium text-black"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      );

    case "intelligence":
      return (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 text-xs text-white">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono text-[11px] text-[#fcb488]">
              ROLE-GATED AI ROADMAP
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-300">
              <Lock className="h-3 w-3 text-[#ff6e14]" aria-hidden="true" />
              Human approval required
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded bg-zinc-950 border border-zinc-800 p-2">
              <p className="font-mono text-[10px] text-[#5ad824]">STAGE 1</p>
              <p className="font-medium text-white mt-0.5">
                Structured records &amp; RBAC
              </p>
            </div>
            <div className="rounded bg-zinc-950 border border-zinc-800 p-2">
              <p className="font-mono text-[10px] text-[#fcb488]">STAGE 2</p>
              <p className="font-medium text-white mt-0.5">
                Operations-aware assistant
              </p>
            </div>
            <div className="rounded bg-zinc-950 border border-zinc-800 p-2">
              <p className="font-mono text-[10px] text-[#ff6e14]">STAGE 3–4</p>
              <p className="font-medium text-white mt-0.5">
                Controlled agent workflows
              </p>
            </div>
          </div>
        </div>
      );
  }
}
