import type { Metadata } from "next";
import { getPublishedArticles, getAllCategories } from "@/lib/blog";
import { BlogFilterGrid } from "@/components/blog-filter-grid";
import { EmailSubscriptionForm } from "@/components/conversion-forms";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Blog & Operational Insights — Private Security Workforce Management",
  description:
    "Editorial insights on attendance accuracy, rostering-to-payroll integration, multi-site security operations, software evaluation, and staged AI governance.",
};

export default function BlogIndexPage() {
  const articles = getPublishedArticles().map(
    ({ content: _content, ...meta }) => meta
  );
  const categories = getAllCategories();

  return (
    <div>
      {/* Header */}
      <section className="border-b border-[#e4e4e4] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-3">
                <StatusBadge status="editorial-draft" />
              </div>
              <h1 className="type-display text-black">
                Editorial insights on private security operations.
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-700">
                Practical perspectives on guard rostering, attendance verification, payroll preparation, multi-site coordination, and responsible AI adoption in South African private security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listing & Category Filter */}
      <section className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogFilterGrid articles={articles} categories={categories} />
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#d0ceca] bg-[#f7f6f2] p-6 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              Stay Informed
            </p>
            <h2 className="font-heading mt-1 text-2xl font-medium text-black">
              Subscribe to Plethora editorial &amp; product updates
            </h2>
            <p className="mt-2 mb-6 text-sm text-zinc-700">
              Receive new articles on security workforce operations and milestone updates as our staged AI roadmap progresses.
            </p>
            <EmailSubscriptionForm source="blog-index" />
          </div>
        </div>
      </section>
    </div>
  );
}
