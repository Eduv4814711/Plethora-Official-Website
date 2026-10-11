import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service governing access to and use of the Plethora (Pty) Ltd public marketing website.",
};

export default function TermsPage() {
  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
          Legal Terms
        </p>
        <h1 className="type-display mt-2 text-black">Terms of Service</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Effective Date: 11 October 2026 · Entity: {siteConfig.legalName} (CIPC Registration {siteConfig.registrationNumber})
        </p>

        <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-zinc-800">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              1. Overview
            </h2>
            <p>
              These Terms of Service govern your access to and use of the public website operated by <strong>{siteConfig.legalName}</strong> ({siteConfig.url}). By accessing this website or submitting an enquiry, you agree to these terms. Separate written pilot or subscription agreements govern customer use of the Plethora ERP software platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              2. Product information and roadmap statements
            </h2>
            <p>
              Information on this website describes Plethora&apos;s workforce management platform, internal operating base, modules in development, and staged AI product roadmap. We clearly distinguish between capabilities available in our current operating environment, features in active development, and planned 12-month roadmap milestones.
            </p>
            <p>
              Roadmap descriptions are intended to outline our product direction and release gates; they do not constitute a binding commitment to deliver specific future functionality on a fixed date prior to a signed customer agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              3. Acceptable use of website forms
            </h2>
            <p>
              When submitting a demo request or subscribing to email updates, you agree to provide accurate contact information that you are authorised to submit and not to use automated scripts, scraping tools, or malicious payloads against our endpoints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              4. Intellectual property and brand assets
            </h2>
            <p>
              The Plethora name, official logos, interface designs, and original editorial articles published on this website are the intellectual property of {siteConfig.legalName}. You may not reproduce, modify, or misrepresent official Plethora brand marks without prior written permission.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              5. Limitation of liability &amp; governing law
            </h2>
            <p>
              This public website and its editorial articles are provided on an &ldquo;as-is&rdquo; informational basis and do not constitute legal, tax, or statutory compliance advice. These terms are governed by the laws of the Republic of South Africa.
            </p>
          </section>

          <section className="rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-5 text-sm">
            <p className="text-zinc-700">
              For questions regarding these Terms of Service or our{" "}
              <Link
                href="/privacy"
                className="font-medium text-black underline decoration-zinc-400 underline-offset-4 hover:text-[#c04900]"
              >
                Privacy Policy
              </Link>
              , please contact{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium text-[#c04900] underline"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
