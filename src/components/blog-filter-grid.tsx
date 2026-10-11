"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import type { BlogArticleMeta } from "@/lib/blog";

interface BlogFilterGridProps {
  articles: BlogArticleMeta[];
  categories: string[];
}

export function BlogFilterGrid({ articles, categories }: BlogFilterGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered =
    selectedCategory === "All"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div>
      {/* Accessible Category Filter Pills */}
      <div
        role="region"
        aria-label="Filter articles by category"
        className="flex flex-wrap items-center gap-2 border-b border-[#e4e4e4] pb-6"
      >
        {["All", ...categories].map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[40px] rounded-full border px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                active
                  ? "border-black bg-black text-white"
                  : "border-[#e4e4e4] bg-white text-zinc-700 hover:bg-[#f7f6f2] hover:text-black"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, idx) => (
          <article
            key={article.slug}
            className={`bento-card flex flex-col justify-between overflow-hidden ${
              idx === 0 && selectedCategory === "All"
                ? "md:col-span-2 lg:col-span-2"
                : ""
            }`}
          >
            <div>
              <div className="border-b border-[#e4e4e4] bg-[#f7f6f2] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-medium text-[#c04900]">
                    {article.coverLabel}
                  </span>
                  <span className="rounded bg-white border border-[#e4e4e4] px-2.5 py-0.5 font-mono text-[11px] text-zinc-700">
                    {article.readingTimeMinutes} min read
                  </span>
                </div>
                <p className="mt-3 font-mono text-xs text-zinc-800">
                  {article.coverHighlight}
                </p>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                  <span className="font-medium text-black">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={article.publishedAt}>
                    {article.publishedAt}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{article.author}</span>
                </div>

                <h2 className="font-heading mt-3 text-xl font-medium text-black sm:text-2xl">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-[#c04900]"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-700">
                  {article.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[#f7f6f2] border border-[#e4e4e4] px-2 py-0.5 text-[11px] text-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#e4e4e4] bg-white px-6 py-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                <BookOpen
                  className="h-3.5 w-3.5 text-[#ff6e14]"
                  aria-hidden="true"
                />
                <span>{article.editorialNotice}</span>
              </span>
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-black hover:text-[#c04900]"
              >
                <span>Read article</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
