"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { siteConfig } from "@/lib/site-config";
import type { DynamicSiteSettings } from "@/lib/site-settings";

export function SiteFooter({
  settings,
}: {
  settings?: DynamicSiteSettings;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const contactEmail = settings?.contactEmail || siteConfig.contactEmail;

  return (
    <footer className="bg-black text-white border-t border-zinc-800">
      {/* Final CTA Strip */}
      <div className="border-b border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-widest text-[#fcb488]">
                Workforce Operations · Private Security
              </p>
              <h2 className="font-heading mt-2 text-2xl font-medium text-white sm:text-3xl">
                Build a clearer operating picture for your guard workforce.
              </h2>
              <p className="mt-2 text-sm text-zinc-300 sm:text-base">
                Evaluate how Plethora connects sites, rostering, attendance, and payroll preparation—or follow our staged AI product roadmap.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact#demo-request"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-[#fcb488]"
              >
                <span>Request a demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact#newsletter"
                className="inline-flex min-h-[48px] items-center rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800"
              >
                Join product updates
              </Link>
              <Link
                href="/blog"
                className="inline-flex min-h-[48px] items-center rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white"
              >
                Explore the blog →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content — Matches Brand Guidelines.svg black footer specification */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="Plethora — Home"
              className="inline-block rounded-sm py-1"
            >
              {/* Official Reversed Orange-and-White Logo on Black Background per Brand Guidelines.svg */}
              <BrandLogo variant="orange-white" height={26} />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-300">
              AI workforce management software for South African private security companies. Connecting guard deployment, rostering, attendance, payroll support, client billing, and operational workflows in a shared operating environment.
            </p>
            <div className="mt-6 space-y-1 text-xs text-zinc-400">
              <p>{siteConfig.legalName} · CIPC Reg. {siteConfig.registrationNumber}</p>
              <p>{siteConfig.bbbeeStatus}</p>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-heading text-xs font-medium uppercase tracking-wider text-zinc-400">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-300 transition-colors hover:text-[#fcb488]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-heading text-xs font-medium uppercase tracking-wider text-zinc-400">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-300 transition-colors hover:text-[#fcb488]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-heading text-xs font-medium uppercase tracking-wider text-zinc-400">
              Company & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-300 transition-colors hover:text-[#fcb488]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {siteConfig.footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-300 transition-colors hover:text-[#fcb488]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-800 pt-8 text-xs text-zinc-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName} · Registration{" "}
            {siteConfig.registrationNumber}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Built in South Africa</span>
            <span aria-hidden="true">·</span>
            <a
              href={`mailto:${contactEmail}`}
              className="text-zinc-200 underline decoration-zinc-600 underline-offset-4 hover:text-[#fcb488]"
            >
              {contactEmail}
            </a>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/admin" className="text-zinc-400 hover:text-[#fcb488]">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
