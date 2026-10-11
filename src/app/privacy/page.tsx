import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Plethora (Pty) Ltd public marketing website, covering demo enquiries, email subscriptions, and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
          Legal &amp; Data Protection
        </p>
        <h1 className="type-display mt-2 text-black">Privacy Policy</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Effective Date: 11 October 2026 · Entity: {siteConfig.legalName} (CIPC Registration {siteConfig.registrationNumber})
        </p>

        <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-zinc-800">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              1. Scope of this policy
            </h2>
            <p>
              This Privacy Policy explains how <strong>{siteConfig.legalName}</strong> (&ldquo;Plethora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a private company registered in the Republic of South Africa under registration number {siteConfig.registrationNumber}, collects, processes, stores, and protects personal information submitted through this public marketing website ({siteConfig.url}).
            </p>
            <p>
              We design our data handling practices around data minimisation, purpose specification, and applicable South African data protection obligations under the Protection of Personal Information Act, 2013 (POPIA).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              2. Information we collect and why
            </h2>
            <p>
              We separate our public website interactions into two distinct journeys so that you remain in control of how we communicate with you:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-[#ff6e14]">
              <li>
                <strong>Demo &amp; Pilot Enquiries (`/api/demo`):</strong> When you request a product demonstration, we collect your name, business email address, company name, approximate guard count, and optional operational notes. We process this information solely to respond to your enquiry, prepare a relevant product walkthrough, and discuss a potential pilot or commercial relationship. Requesting a demo does <em>not</em> add you to our marketing mailing list.
              </li>
              <li>
                <strong>Email Subscriptions (`/api/subscribe`):</strong> When you explicitly opt in to receive product updates and editorial insights, we collect your email address, timestamp, and consent record. We use this information only to send the communications you requested.
              </li>
              <li>
                <strong>Technical &amp; Security Logs:</strong> To protect our forms from automated spam and abuse, our server processes basic request metadata (such as rate-limiting counters and cryptographic hashes of submitted identifiers). We avoid logging raw personal details in application stdout logs.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              3. Separation from operational ERP records
            </h2>
            <p>
              This public marketing website operates independently of the Plethora ERP workforce management application. No private employee records, guard personal identification numbers, or live site attendance records from the operational platform are exposed on or accessible through this marketing website. Any product interface previews shown on this website use sanitised, illustrative demonstration data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              4. Storage, service providers, and sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. Submitted demo enquiries and newsletter subscriptions are stored securely in our server-side submission records and, where configured, transmitted to our transactional email or customer communication infrastructure solely for the purpose of fulfilling your request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-medium text-black">
              5. Retention and your rights
            </h2>
            <p>
              We retain demo enquiry records for as long as reasonably necessary to respond to and manage the commercial enquiry, and we retain email subscription records until you withdraw consent or request deletion.
            </p>
            <p>
              You may request access to, correction of, or deletion of your personal information—or withdraw your marketing subscription consent at any time—by contacting us at{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium text-[#c04900] underline decoration-[#fcb488] underline-offset-4 hover:text-black"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>

          <section className="rounded-xl border border-[#e4e4e4] bg-[#f7f6f2] p-5 text-sm">
            <h2 className="font-heading text-base font-medium text-black">
              6. Contact &amp; Information Officer Enquiries
            </h2>
            <p className="mt-1.5 text-zinc-700">
              <strong>Entity:</strong> {siteConfig.legalName} (CIPC Reg. {siteConfig.registrationNumber})<br />
              <strong>Active Director:</strong> {siteConfig.founder}<br />
              <strong>Contact Email:</strong>{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium text-[#c04900] underline"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
