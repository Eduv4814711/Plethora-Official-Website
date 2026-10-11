import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar, User } from "lucide-react";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
  getRelatedArticles,
} from "@/lib/blog";
import { MarkdownContent } from "@/components/markdown-content";
import { StatusBadge } from "@/components/status-badge";
import { EmailSubscriptionForm } from "@/components/conversion-forms";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.seoDescription,
    authors: [{ name: article.author }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.seoDescription,
      url: `${siteConfig.url}/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.seoDescription,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.slug, 2);

  return (
    <div>
      {/* Article Header */}
      <header className="border-b border-[#e4e4e4] bg-[#f7f6f2] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-black"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to all articles</span>
            </Link>
            <StatusBadge
              status="editorial-draft"
              customLabel={article.editorialNotice}
            />
          </div>

          <div className="mt-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c04900]">
              {article.category}
            </span>
            <h1 className="type-display mt-2 text-black">{article.title}</h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-700">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-[#e4e4e4] pt-5 text-xs text-zinc-700">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#ff6e14]" aria-hidden="true" />
              <span>
                <strong className="font-medium text-black">
                  {article.author}
                </strong>{" "}
                · {article.authorRole}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar
                className="h-3.5 w-3.5 text-[#ff6e14]"
                aria-hidden="true"
              />
              <time dateTime={article.publishedAt}>{article.publishedAt}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock
                className="h-3.5 w-3.5 text-[#ff6e14]"
                aria-hidden="true"
              />
              <span>{article.readingTimeMinutes} min read</span>
            </span>
          </div>

          {/* Editorial Cover Callout Box */}
          <div className="mt-6 rounded-xl border border-[#d0ceca] bg-white p-4 font-mono text-xs text-zinc-800">
            <span className="font-medium text-[#c04900]">
              {article.coverLabel}:
            </span>{" "}
            {article.coverHighlight}
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <MarkdownContent content={article.content} />

          {/* Tags */}
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[#e4e4e4] pt-6">
            <span className="text-xs font-medium text-zinc-500">Topics:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#f7f6f2] border border-[#e4e4e4] px-3 py-1 text-xs text-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Card inside Article */}
          <div className="mt-12 rounded-2xl border border-[#fcb488] bg-[#fff3eb] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[#c04900]">
              See Plethora in Action
            </p>
            <h2 className="font-heading mt-1 text-xl font-medium text-black">
              Evaluate connected workforce operations for your security firm
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-800">
              Explore how Plethora connects guard and site records, shift rostering, attendance confirmation, and payroll preparation in one shared operating environment.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/contact#demo-request"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#ff6e14] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#fcb488]"
              >
                <span>Request a demo</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/product"
                className="inline-flex min-h-[44px] items-center rounded-lg border border-black bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-[#f7f6f2]"
              >
                Explore the platform
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles & Subscription */}
      <section className="border-t border-[#e4e4e4] bg-[#f7f6f2] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-heading text-xl font-medium text-black">
                Related operational articles
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {related.map((rel) => (
                  <article
                    key={rel.slug}
                    className="bento-card flex flex-col justify-between p-5"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#c04900]">
                        {rel.category}
                      </span>
                      <h3 className="font-heading mt-2 text-base font-medium text-black">
                        <Link
                          href={`/blog/${rel.slug}`}
                          className="hover:text-[#c04900]"
                        >
                          {rel.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-700">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#e4e4e4] flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {rel.readingTimeMinutes} min read
                      </span>
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="font-medium text-black hover:text-[#c04900]"
                      >
                        Read →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#d0ceca] bg-white p-6">
                <h2 className="font-heading text-lg font-medium text-black">
                  Subscribe to product &amp; editorial updates
                </h2>
                <p className="mt-1 mb-4 text-xs text-zinc-600">
                  Get notified when new articles and roadmap milestones are published.
                </p>
                <EmailSubscriptionForm source={`article-${article.slug}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
