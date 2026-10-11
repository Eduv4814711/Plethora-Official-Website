import type { Metadata } from "next";
import { Mail, MapPin, ShieldCheck, Building2 } from "lucide-react";
import {
  DemoRequestForm,
  EmailSubscriptionForm,
} from "@/components/conversion-forms";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & Demo Request — Evaluate Plethora",
  description:
    "Request a scoped operational demonstration of Plethora for your private security company or subscribe to product and editorial updates.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#e4e4e4] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Contact &amp; Platform Evaluation
            </p>
            <h1 className="type-display mt-2 text-black">
              Request a demo or connect with our team.
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-700">
              Whether you operate 50 guards across regional posts or 250+ officers across multi-site contracts, we scope every demonstration around your actual rostering, attendance, and payroll workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Main Conversion Grid */}
      <section className="bg-[#f7f6f2] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Demo Request Form */}
            <div
              id="demo-request"
              className="rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-10 lg:col-span-7 scroll-mt-20"
            >
              <div className="mb-6 border-b border-[#e4e4e4] pb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  Operational Demo Enquiry
                </span>
                <h2
                  id="demo-form-heading"
                  className="font-heading mt-1 text-2xl font-medium text-black"
                >
                  Book a workflow demonstration
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Share your company details and approximate guard count. We only collect the information required to respond to your enquiry.
                </p>
              </div>
              <DemoRequestForm />
            </div>

            {/* Right Column: Direct Contact & Separate Email Subscription */}
            <div className="space-y-6 lg:col-span-5">
              {/* Direct Contact Card */}
              <div className="rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
                  Direct Enquiries
                </span>
                <h2 className="font-heading mt-1 text-xl font-medium text-black">
                  Official company contact details
                </h2>

                <ul className="mt-5 space-y-4 text-sm text-zinc-800">
                  <li className="flex items-start gap-3">
                    <Mail
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6e14]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-black">Email</p>
                      <a
                        href={`mailto:${siteConfig.contactEmail}`}
                        className="text-[#c04900] underline decoration-[#fcb488] underline-offset-4 hover:text-black"
                      >
                        {siteConfig.contactEmail}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Building2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6e14]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-black">Company</p>
                      <p className="text-zinc-700">
                        {siteConfig.legalName} (CIPC Reg.{" "}
                        {siteConfig.registrationNumber})
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#ff6e14]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-black">Operating Market</p>
                      <p className="text-zinc-700">South Africa</p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 rounded-xl bg-[#f7f6f2] border border-[#e4e4e4] p-4 text-xs text-zinc-700">
                  <div className="flex items-center gap-2 font-medium text-black">
                    <ShieldCheck
                      className="h-4 w-4 text-[#ff6e14]"
                      aria-hidden="true"
                    />
                    <span>What happens after you submit?</span>
                  </div>
                  <p className="mt-1">
                    Our founder-led team reviews your guard profile, schedules an operational discovery call, and demonstrates live workflows matched to your site and payroll structure.
                  </p>
                </div>
              </div>

              {/* Separate Newsletter Subscription Card */}
              <div
                id="newsletter"
                className="rounded-2xl border border-[#d0ceca] bg-white p-6 sm:p-8 scroll-mt-20"
              >
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-600">
                  Product Updates &amp; Editorial List
                </span>
                <h2
                  id="subscribe-form-heading"
                  className="font-heading mt-1 text-xl font-medium text-black"
                >
                  Subscribe to email updates
                </h2>
                <p className="mt-1 mb-5 text-sm text-zinc-600">
                  Not ready for a full evaluation yet? Join our mailing list for product release milestones and security operations insights.
                </p>
                <EmailSubscriptionForm source="contact-page" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
