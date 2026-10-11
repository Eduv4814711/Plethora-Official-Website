import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Code2,
  Cpu,
  Globe,
  Building2,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "About Plethora — Company, Founder & Mission",
  description:
    "Learn about Plethora (Pty) Ltd, our South African origin in private security operations, our founder Aobakwe Dipitso, and our staged AI workforce management strategy.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[#e4e4e4] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              About {siteConfig.legalName}
            </p>
            <h1 className="type-display mt-2 text-black">
              Building AI workforce management software from inside South African security operations.
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-700">
              Plethora (Pty) Ltd is a South African technology company registered on {siteConfig.registrationDate} ({siteConfig.registrationNumber}). We build software that connects the day-to-day operational and administrative workflows required to run private security companies.
            </p>
          </div>
        </div>
      </section>

      {/* Origin, Operating Base & Long-Term Ambition */}
      <section className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Card 1: Why we exist */}
            <div className="bento-card p-6 sm:p-8 lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                01 · Operational Origin
              </span>
              <h2 className="font-heading mt-2 text-2xl font-medium text-black">
                Grounded in real security workflows, not generic HR templates
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-700">
                Private security operators coordinate guards across client sites, day and night shifts, relief deployments, and strict statutory frameworks. Generic workforce tools rarely account for Occurrence Book (OB) verification, PSIRA grades, NBCPSS security-officer leave rules, or pay-period-aligned shift patterns.
              </p>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-700">
                Plethora was built to bring guard deployment, rostering, attendance, payroll support, client billing, communications, compliance, and incident workflows into a shared operating environment—with permissions and human approval matched to each task.
              </p>
            </div>

            {/* Card 2: Current Operating Position */}
            <div className="bento-card p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  02 · Current Operating Position
                </span>
                <h2 className="font-heading mt-2 text-xl font-medium text-black">
                  Internal deployment &amp; commercial validation
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  Plethora is an early-stage (pre-seed) company. Our platform is deployed internally at <strong>Quick Bopha Security</strong>, where 88 guards and 103 platform users are recorded in our 11 October 2026 operating plan.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  We distinguish transparently between internal operational use and external commercial adoption: Quick Bopha Security serves as our internal development and proving environment while we run scoped pilots to onboard our first external paying security companies.
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-[#f7f6f2] border border-[#e4e4e4] p-4 text-xs text-zinc-700">
                <strong className="font-medium text-black">
                  12-month product &amp; commercial focus:
                </strong>{" "}
                Validate and launch our first production AI assistant and controlled agent workflows, and partner with South African security operators in the 50–250+ guard profile.
              </div>
            </div>

            {/* Card 3: Founder & Engineering Capability */}
            <div className="bento-card p-6 sm:p-8 lg:col-span-6">
              <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                03 · Founder &amp; Leadership
              </span>
              <h2 className="font-heading mt-2 text-xl font-medium text-black">
                {siteConfig.founder} — {siteConfig.founderRole}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                Aobakwe Dipitso founded Plethora and serves as its active director. He is a South African technology builder and cybersecurity professional studying Cyber Security, with practical exposure to private security operations through Quick Bopha Security.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-[#e4e4e4] bg-[#f7f6f2] p-3">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <Code2 className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Full-Stack &amp; Database Architecture</span>
                  </div>
                  <p className="mt-1 text-zinc-600">
                    End-to-end application engineering, relational data models, and cloud infrastructure.
                  </p>
                </div>
                <div className="rounded-lg border border-[#e4e4e4] bg-[#f7f6f2] p-3">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <ShieldCheck className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                    <span>Cybersecurity &amp; Access Control</span>
                  </div>
                  <p className="mt-1 text-zinc-600">
                    Role-based permissions, tenant isolation, audit trails, and controlled AI integration.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Long-Term Ambition */}
            <div className="bento-card-dark p-6 sm:p-8 lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#fcb488]">
                  04 · Long-Term Ambition
                </span>
                <h2 className="font-heading mt-2 text-xl font-medium text-white">
                  Built in South Africa, with continental and international ambition
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  Our five-year ambition is to help establish and lead the AI workforce platform category for private security in South Africa. By building a repeatable, deeply validated operating model locally first, we aim to expand progressively across Africa and into international security markets.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-[#ff6e14]" aria-hidden="true" />
                  <span>South Africa → Africa → International markets</span>
                </span>
                <Link
                  href="/product#ai-roadmap"
                  className="font-medium text-[#fcb488] hover:text-white"
                >
                  View staged AI roadmap →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Company Snapshot */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#e4e4e4] bg-[#f7f6f2] p-6 sm:p-10">
            <div className="flex flex-col justify-between gap-6 border-b border-[#e4e4e4] pb-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
                  Corporate Governance &amp; Identity
                </p>
                <h2 className="font-heading mt-1 text-2xl font-medium text-black">
                  Company registration &amp; profile
                </h2>
              </div>
              <BrandLogo variant="primary" height={24} />
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase text-zinc-500">
                  Registered Entity
                </dt>
                <dd className="mt-1 font-medium text-black">
                  {siteConfig.legalName}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-zinc-500">
                  CIPC Registration
                </dt>
                <dd className="mt-1 font-mono font-medium text-black">
                  {siteConfig.registrationNumber} ({siteConfig.registrationDate})
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-zinc-500">
                  B-BBEE Status
                </dt>
                <dd className="mt-1 font-medium text-black">
                  Level 1 B-BBEE EME (100% Black-owned)
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase text-zinc-500">
                  Primary Focus
                </dt>
                <dd className="mt-1 font-medium text-black">
                  AI workforce management for private security
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4e4e4] pt-6">
              <p className="text-xs text-zinc-600">
                Interested in evaluating Plethora for your security operation or discussing a pilot deployment?
              </p>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#fcb488]"
              >
                <span>Contact Plethora</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
