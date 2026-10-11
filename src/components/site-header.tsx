"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { siteConfig } from "@/lib/site-config";
import type { DynamicSiteSettings } from "@/lib/site-settings";

export function SiteHeader({
  settings,
}: {
  settings?: DynamicSiteSettings;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const loginUrl = settings?.appLoginUrl ?? siteConfig.appLoginUrl;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e4e4e4] bg-white/95 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-black focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      {settings?.announcementEnabled && settings.announcementText ? (
        <div className="border-b border-zinc-800 bg-black px-4 py-2 text-center text-xs text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff6e14]" aria-hidden="true" />
            <span>{settings.announcementText}</span>
            {settings.announcementLinkText && settings.announcementLinkHref ? (
              <Link
                href={settings.announcementLinkHref}
                className="font-medium text-[#fcb488] underline underline-offset-4 hover:text-white"
              >
                {settings.announcementLinkText} →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="Plethora — Home"
            className="inline-flex items-center rounded-sm py-1"
          >
            <BrandLogo variant="primary" height={24} />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex md:items-center md:gap-1"
          >
            {siteConfig.navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#f7f6f2] text-black font-medium"
                      : "text-zinc-700 hover:bg-[#f7f6f2] hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          {loginUrl ? (
            <a
              href={loginUrl}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-[#f7f6f2]"
            >
              Sign in
            </a>
          ) : null}

          <Link
            href="/contact#demo-request"
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff6e14] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#fcb488] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c04900]"
          >
            <span>Request a demo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            ref={toggleBtnRef}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#e4e4e4] bg-white p-2 text-black hover:bg-[#f7f6f2]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="border-t border-[#e4e4e4] bg-white px-4 pt-3 pb-6 shadow-lg md:hidden"
        >
          <ul className="space-y-1">
            {siteConfig.navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-lg px-3.5 py-3 text-base font-medium ${
                      isActive
                        ? "bg-[#f7f6f2] text-black"
                        : "text-zinc-800 hover:bg-[#f7f6f2]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-col gap-3 border-t border-[#e4e4e4] pt-4">
            {siteConfig.appLoginUrl ? (
              <a
                href={siteConfig.appLoginUrl}
                className="flex min-h-[48px] items-center justify-center rounded-lg border border-[#e4e4e4] px-4 py-2.5 text-sm font-medium text-black hover:bg-[#f7f6f2]"
              >
                Sign in
              </a>
            ) : null}
            <Link
              href="/contact#demo-request"
              onClick={() => setMobileMenuOpen(false)}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#ff6e14] px-4 py-3 text-base font-medium text-black hover:bg-[#fcb488]"
            >
              <span>Request a demo</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
