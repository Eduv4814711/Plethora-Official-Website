# Plethora (Pty) Ltd — Official Public Marketing Website

Official public marketing website for **Plethora (Pty) Ltd** (CIPC Reg. `2026/747460/07`), a South African technology company building AI workforce management software for private security companies.

Aligned with:
- **`Plethora_Business_Plan_Final_v1.pdf`** (dated 11 October 2026)
- **`Brand Guidelines.svg`** and official Plethora SVG logo assets
- **Next.js App Router + TypeScript + Tailwind CSS**, prepared for deployment on **Vercel**

---

## 1. Local Development

### Prerequisites
- **Node.js** `20.x` or later (tested on Node `26.5.0`)
- **npm** `10.x` or later

### Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template if configuring local overrides:
   ```bash
   cp .env.example .env.local
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

### Available Scripts
- `npm run dev` — Start the Next.js development server.
- `npm run build` — Run a full production build.
- `npm run start` — Start the production server after building.
- `npm run typecheck` — Validate TypeScript types (`tsc --noEmit`).
- `npm test` — Run the automated test suite covering email subscription validation, duplicate handling, demo enquiry persistence, rate limiting, honeypot spam blocking, blog parsing, and draft exclusion.

---

## 2. Official Brand System (`Brand Guidelines.svg`)

### Logo Assets (`/public/brand/`)
All logo variants are extracted directly from the official SVG files without stretching, recolouring, or recreating typography:
- `/public/brand/logo-primary.svg` (`Original Plethora Logo.svg`) — Orange mark (`#ff751f`) + Black wordmark (`#000000`). Used on white (`#ffffff`) and light neutral (`#f7f6f2`) surfaces.
- `/public/brand/logo-orange-white.svg` (`Original Plethora Logo Orange and White.svg`) — Orange mark (`#ff751f`) + White wordmark (`#ffffff`). Used on black (`#000000`) surfaces such as the site footer.
- `/public/brand/logo-white.svg` (`Original Plethora Logo White.svg`) — Monochrome white mark + White wordmark. Available for monochrome dark contexts.
- `/public/brand/favicon.svg` & `src/app/icon.svg` (`Plethora Official  Favicon.svg`) — Compact square mark for browser tabs and compact UI headers.
- Untouched full-canvas original files are also preserved in `/public/brand/originals/`.

### Colour Tokens (`src/app/globals.css`)
- **Text:** `#000000` (`--color-text`)
- **Background:** `#ffffff` (`--color-bg`)
- **Primary Colour:** `#ff6e14` (`--color-primary`)
- **Secondary Colour:** `#fcb488` (`--color-secondary`)
- **Accent Colour:** `#c04900` (`--color-accent`)
- **Positive Status:** `#5ad824` (`--color-status-positive`)
- **Negative Status:** `#f63232` (`--color-status-negative`)
- **Warning Status:** `#f4a834` (`--color-status-warning`)
- **Neutral Surface / Border:** `#f7f6f2` (`--color-surface`) & `#e4e4e4` (`--color-border`)

### Typography (`src/app/layout.tsx` & `src/app/globals.css`)
- **Headings & Subheadings:** `Inter` (`400 Regular`, `500 Medium`, `600 SemiBold`, `2%` letter-spacing)
- **Main Text:** `Roboto` (`400 Regular`, `500 Medium`, `2%` letter-spacing)
- **Logo Master Font & Technical Identifiers:** `Roboto Mono` (`400 Regular`, `500 Medium`)

---

## 3. Email Signup & Demo Enquiry Backend

The website implements two strictly separated server-side journeys:
1. **`POST /api/demo`** — Collects `name`, `email`, `company`, `guardCount`, optional `operationalFocus`, and explicit `privacyAccepted`. Records `marketingOptIn: false` so requesting a demo never subscribes a visitor to marketing emails.
2. **`POST /api/subscribe`** — Collects `email` and explicit `consent: true` for product updates and editorial insights, with idempotent duplicate detection.

### Security & Validation Controls
- Client-side (`blur`/`input`) and server-side validation (`src/lib/submissions.ts`).
- Server-side text sanitisation (strips HTML tags, control characters, and bounds string lengths).
- Honeypot anti-spam field (`honeypot`) and per-IP sliding-window rate limiting (`6 requests / 60s`).
- Privacy-preserving logs (logs SHA-256 hash prefixes rather than raw email addresses).

### Provider Configuration (`.env.example`)
Set `PLETHORA_SUBMISSION_PROVIDER` in your environment:
- `PLETHORA_SUBMISSION_PROVIDER="file"` *(default)* — Persists newline-delimited JSON records to `data/submissions/subscriptions.jsonl` and `data/submissions/demo-enquiries.jsonl` (falling back to `/tmp/plethora-submissions` on read-only serverless filesystems when no remote API credentials are set).
- `PLETHORA_SUBMISSION_PROVIDER="resend"` — Sends notifications and/or registers Audience contacts via the Resend API using `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, and optional `RESEND_AUDIENCE_ID`.
- `PLETHORA_SUBMISSION_PROVIDER="webhook"` — Forwards signed JSON payloads (`X-Plethora-Signature` HMAC-SHA256) to `SUBMISSION_WEBHOOK_URL` using `SUBMISSION_WEBHOOK_SECRET`.

> **Important for Vercel Production:** Serverless functions on Vercel have ephemeral `/tmp` storage. Before launching paid marketing campaigns on Vercel, configure either `PLETHORA_SUBMISSION_PROVIDER="resend"` (with a live `RESEND_API_KEY`) or `PLETHORA_SUBMISSION_PROVIDER="webhook"` in the Vercel dashboard so submissions persist in your external email/CRM system.

---

## 4. Blog Publishing Workflow (`content/blog/*.md`)

Articles are stored as Markdown files in `content/blog/` with YAML frontmatter. No external database is required to publish new articles.

### Adding a New Article
Create a new `.md` file in `content/blog/your-article-slug.md` with the following frontmatter:

```markdown
---
title: "Your article title in sentence case"
slug: "your-article-slug"
excerpt: "A concise 1–2 sentence summary displayed on cards and previews."
author: "Aobakwe Dipitso"
authorRole: "Founder & Active Director, Plethora (Pty) Ltd"
publishedAt: "2026-10-15"
category: "Operations"
tags: ["Rostering", "Attendance", "Security Operations"]
coverLabel: "06 · Operational Guide"
coverHighlight: "Site record → Shift pattern → Approved timesheet"
seoDescription: "Search engine and Open Graph description for the article."
status: "draft"
editorialNotice: "Editorial draft — pending final review"
---

Write your article body here using standard Markdown (`## Headings`, paragraphs, `- lists`, `> blockquotes`).
```

### Draft vs. Published Behaviour
- **`status: "draft"`**: Excluded from `/blog`, excluded from homepage previews, excluded from `/sitemap.xml`, and returns HTTP `404` if accessed directly at `/blog/[slug]`.
- **`status: "published"`**: Automatically included in `/blog`, category filters, related articles, static route generation, and `/sitemap.xml`.

### Editorial CMS & Admin Console (`/admin`)
You can manage blog articles either directly via Markdown files in `content/blog/*.md` or in the browser through the built-in **Website & Communications Admin Console** at **`http://localhost:3000/admin`**:
- **Overview Dashboard**: Live counts of demo enquiries, unread messages, active email subscribers, and published/draft blog posts.
- **Demo Enquiries Inbox**: Read full demo evaluation requests, filter by status (`New`, `Contacted`, `Pilot Scoped`, `Archived`), record internal follow-up notes, launch a pre-filled email reply, delete test entries, or export CSV.
- **Email Subscribers**: Search opt-in subscribers, inspect POPIA consent timestamps and signup sources, toggle `Active`/`Unsubscribed`, or export CSV.
- **Blog & Editorial CMS**: Write new Markdown articles with live formatted preview, edit existing articles, or toggle any article between `Published` and `Draft` with one click.
- **Website Settings**: Update the top announcement banner, homepage hero headline/subheadline, internal operating base disclosure toggle, public contact email, and customer sign-in URL.

Set `PLETHORA_ADMIN_PASSWORD` and `PLETHORA_ADMIN_SECRET` in `.env.local` (default local development password: `plethora-admin-2026`).

---

## 5. Deploying to Vercel

1. **Push the repository** to a Git provider (GitHub, GitLab, or Bitbucket).
2. **Import the project into Vercel** (`New Project` → select repository).
   - **Framework Preset:** `Next.js` (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)
3. **Configure Environment Variables** in Vercel (`Project Settings → Environment Variables`):
   - `NEXT_PUBLIC_SITE_URL` — Set to your confirmed public production domain (e.g., `https://plethoraqbs.co.za`).
   - `NEXT_PUBLIC_CONTACT_EMAIL` — Set to `info@plethoraqbs.co.za` (or updated official contact address).
   - `PLETHORA_ADMIN_PASSWORD` & `PLETHORA_ADMIN_SECRET` — Strong credentials for `/admin`.
   - `PLETHORA_SUBMISSION_PROVIDER` — Set to `resend` or `webhook` once live credentials are provisioned.
   - `RESEND_API_KEY` / `SUBMISSION_WEBHOOK_URL` — Server-only credentials (never prefix with `NEXT_PUBLIC_`).
4. **Deploy & Verify**:
   - Trigger deployment and verify `/`, `/product`, `/solutions`, `/blog`, `/about`, `/contact`, `/privacy`, `/terms`, `/admin`, `/sitemap.xml`, and `/robots.txt`.
5. **Rollback Procedure**:
   - In the Vercel Dashboard, navigate to **Deployments**, locate the previous known-good production deployment, open its menu (`⋯`), and select **Instant Rollback**.
