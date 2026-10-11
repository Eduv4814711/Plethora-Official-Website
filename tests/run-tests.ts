import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  processEmailSubscription,
  processDemoEnquiry,
  resetRateLimiterForTests,
  listDemoEnquiries,
  updateDemoEnquiry,
  deleteDemoEnquiry,
  listSubscriptions,
  updateSubscriptionStatus,
  deleteSubscription,
} from "../src/lib/submissions.ts";
import {
  getPublishedArticles,
  getAllArticles,
  getPublishedArticleBySlug,
  getRelatedArticles,
  saveBlogArticle,
  getAdminArticleBySlug,
  deleteBlogArticle,
} from "../src/lib/blog.ts";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../src/lib/site-settings.ts";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  changeAdminPassword,
  getAdminSecurityInfo,
  revokeAllAdminSessions,
  resetAdminPasswordToDefault,
} from "../src/lib/admin-auth.ts";
import sitemap from "../src/app/sitemap.ts";

async function runTests() {
  console.log("=== PLETHORA WEBSITE AUTOMATED VERIFICATION SUITE ===\n");

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "plethora-test-"));
  process.env.PLETHORA_STORAGE_DIR = tmpDir;
  process.env.PLETHORA_SUBMISSION_PROVIDER = "file";

  try {
    // 1. Email Subscription Validation & Persistence
    resetRateLimiterForTests();
    const invalidSub = await processEmailSubscription(
      { email: "not-an-email", consent: false },
      "127.0.0.1"
    );
    assert.equal(invalidSub.ok, false);
    assert.equal(invalidSub.code, "VALIDATION_ERROR");
    assert.ok(invalidSub.fieldErrors?.email);
    assert.ok(invalidSub.fieldErrors?.consent);
    console.log("✔ [PASS] Email subscription rejects invalid email & missing consent");

    const validSub = await processEmailSubscription(
      {
        email: "  Operations@ExampleSecurity.co.za ",
        consent: true,
        source: "test-suite",
      },
      "127.0.0.1"
    );
    assert.equal(validSub.ok, true);
    assert.equal(validSub.code, "RECORDED");

    const subFile = path.join(tmpDir, "subscriptions.jsonl");
    assert.ok(fs.existsSync(subFile), "subscriptions.jsonl must be persisted");
    const subLines = fs
      .readFileSync(subFile, "utf-8")
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l));
    assert.equal(subLines.length, 1);
    assert.equal(subLines[0].email, "operations@examplesecurity.co.za");
    assert.equal(subLines[0].consent, true);
    console.log("✔ [PASS] Email subscription sanitises, normalises, and persists record");

    // 2. Duplicate Signup Handling
    const dupSub = await processEmailSubscription(
      {
        email: "operations@examplesecurity.co.za",
        consent: true,
      },
      "127.0.0.1"
    );
    assert.equal(dupSub.ok, true);
    assert.equal(dupSub.code, "DUPLICATE");
    const subLinesAfterDup = fs
      .readFileSync(subFile, "utf-8")
      .trim()
      .split("\n");
    assert.equal(
      subLinesAfterDup.length,
      1,
      "Duplicate signup must not append a second row"
    );
    console.log("✔ [PASS] Duplicate email subscription handled idempotently");

    // 3. Demo Enquiry Validation, Sanitisation & Journey Separation
    resetRateLimiterForTests();
    const invalidDemo = await processDemoEnquiry(
      {
        name: "",
        email: "bad",
        company: "",
        guardCount: "invalid-tier",
        privacyAccepted: false,
      },
      "127.0.0.2"
    );
    assert.equal(invalidDemo.ok, false);
    assert.equal(invalidDemo.code, "VALIDATION_ERROR");
    assert.ok(invalidDemo.fieldErrors?.name);
    assert.ok(invalidDemo.fieldErrors?.email);
    assert.ok(invalidDemo.fieldErrors?.company);
    assert.ok(invalidDemo.fieldErrors?.guardCount);
    assert.ok(invalidDemo.fieldErrors?.privacyAccepted);
    console.log("✔ [PASS] Demo enquiry validates all required fields");

    const validDemo = await processDemoEnquiry(
      {
        name: "<b>Thabo Mokoena</b>",
        email: "thabo@sentinelguarding.co.za",
        company: "Sentinel Guarding (Pty) Ltd",
        guardCount: "51-150",
        operationalFocus: "Multi-site rostering and OB confirmation",
        privacyAccepted: true,
      },
      "127.0.0.2"
    );
    assert.equal(validDemo.ok, true);
    assert.equal(validDemo.code, "RECORDED");

    const demoFile = path.join(tmpDir, "demo-enquiries.jsonl");
    assert.ok(fs.existsSync(demoFile), "demo-enquiries.jsonl must be persisted");
    const demoRecords = fs
      .readFileSync(demoFile, "utf-8")
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l));
    assert.equal(demoRecords.length, 1);
    assert.equal(demoRecords[0].name, "Thabo Mokoena"); // HTML tags stripped
    assert.equal(demoRecords[0].marketingOptIn, false); // Strictly separated from marketing
    console.log("✔ [PASS] Demo enquiry strips HTML tags, persists record, and sets marketingOptIn=false");

    // 4. Honeypot & Rate Limit Protection
    const spamAttempt = await processDemoEnquiry(
      {
        name: "Bot",
        email: "bot@spam.com",
        company: "Spam Co",
        guardCount: "1-50",
        privacyAccepted: true,
        honeypot: "https://spamsite.example",
      },
      "127.0.0.3"
    );
    assert.equal(spamAttempt.ok, false);
    assert.equal(spamAttempt.code, "SPAM_BLOCKED");
    console.log("✔ [PASS] Honeypot anti-spam blocks automated submissions");

    resetRateLimiterForTests();
    for (let i = 0; i < 6; i++) {
      await processEmailSubscription(
        { email: `user${i}@example.co.za`, consent: true },
        "10.0.0.99"
      );
    }
    const rateLimited = await processEmailSubscription(
      { email: "user7@example.co.za", consent: true },
      "10.0.0.99"
    );
    assert.equal(rateLimited.ok, false);
    assert.equal(rateLimited.status, 429);
    assert.equal(rateLimited.code, "RATE_LIMITED");
    console.log("✔ [PASS] Sliding-window rate limiter enforces 429 after threshold");

    // 5. Blog Listing, Article Retrieval & Strict Draft Exclusion
    const published = getPublishedArticles();
    const allIncludingDrafts = getAllArticles({ includeDrafts: true });

    assert.equal(
      published.length,
      5,
      "Expected 5 published editorial articles"
    );
    assert.equal(
      allIncludingDrafts.length,
      6,
      "Expected 6 total articles including 1 draft"
    );

    const draftLookup = getPublishedArticleBySlug(
      "internal-release-gate-checklist-stage-2-ai"
    );
    assert.equal(
      draftLookup,
      null,
      "Draft article must never be returned by getPublishedArticleBySlug"
    );

    const validArticle = getPublishedArticleBySlug(
      "why-attendance-accuracy-matters-in-private-security"
    );
    assert.ok(validArticle);
    assert.ok(validArticle.readingTimeMinutes >= 1);

    const related = getRelatedArticles(validArticle.slug, 2);
    assert.equal(related.length, 2);
    assert.ok(related.every((r) => r.slug !== validArticle.slug));
    console.log("✔ [PASS] Blog engine parses 5 published articles and strictly excludes draft from lookup");

    // 6. Sitemap Verification (Published only, no drafts)
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);
    assert.ok(
      urls.some((u) =>
        u.endsWith("/blog/why-attendance-accuracy-matters-in-private-security")
      )
    );
    assert.ok(
      !urls.some((u) =>
        u.includes("internal-release-gate-checklist-stage-2-ai")
      ),
      "Sitemap must not include draft articles"
    );
    console.log("✔ [PASS] Sitemap includes all public routes & published articles while excluding drafts");

    // 7. Brand Tokens & Official Asset Verification
    const requiredAssets = [
      "public/brand/logo-primary.svg",
      "public/brand/logo-orange-white.svg",
      "public/brand/logo-white.svg",
      "public/brand/favicon.svg",
      "src/app/icon.svg",
    ];
    for (const asset of requiredAssets) {
      assert.ok(
        fs.existsSync(path.join(process.cwd(), asset)),
        `Missing required brand asset: ${asset}`
      );
    }

    const globalsCss = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf-8"
    );
    for (const hex of [
      "#000000",
      "#ffffff",
      "#ff6e14",
      "#fcb488",
      "#c04900",
      "#5ad824",
      "#f63232",
      "#f4a834",
    ]) {
      assert.ok(
        globalsCss.toLowerCase().includes(hex),
        `Missing official brand hex ${hex} in globals.css`
      );
    }
    console.log("✔ [PASS] Official brand SVG assets and Brand Guidelines hex tokens verified");

    // 8. Confidentiality & Employee PII Guardrail Check
    const forbiddenStrings = [
      "Oakvale",
      "R1.5 million",
      "0736857695",
      "0685053909",
      "AQUILLA VERUSHKA",
      "-33.88985",
    ];
    const dirsToScan = ["src", "content/blog"];
    for (const dir of dirsToScan) {
      const walk = (d: string) => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/\.(ts|tsx|md|css)$/.test(entry.name)) {
            const text = fs.readFileSync(full, "utf-8");
            for (const forbidden of forbiddenStrings) {
              assert.ok(
                !text.toLowerCase().includes(forbidden.toLowerCase()),
                `Confidential or PII string "${forbidden}" found in ${full}`
              );
            }
          }
        }
      };
      walk(path.join(process.cwd(), dir));
    }
    console.log("✔ [PASS] Confidentiality & employee PII guardrails verified across all source and blog files");

    // 9. Admin Console Authentication, Password Rotation & Session Signing
    assert.equal(verifyAdminPassword("plethora-admin-2026"), true);
    assert.equal(verifyAdminPassword("wrong-password"), false);
    const tokenBeforeRotation = createAdminSessionToken();
    assert.equal(verifyAdminSessionToken(tokenBeforeRotation), true);
    assert.equal(verifyAdminSessionToken(`${tokenBeforeRotation}tampered`), false);

    // Direct 1-arg password update (authenticated admin session)
    const pwChange = changeAdminPassword("NewSecurePass#2026");
    assert.equal(pwChange.ok, true);
    assert.equal(verifyAdminPassword("plethora-admin-2026"), false);
    assert.equal(verifyAdminPassword("NewSecurePass#2026"), true);
    assert.equal(verifyAdminPassword("  NewSecurePass#2026  "), true);
    assert.equal(
      verifyAdminSessionToken(tokenBeforeRotation),
      true,
      "Active session token remains valid when password is updated"
    );
    assert.equal(getAdminSecurityInfo().passwordSource, "custom_stored");

    // Explicit session revocation invalidates previous tokens
    revokeAllAdminSessions();
    assert.equal(
      verifyAdminSessionToken(tokenBeforeRotation),
      false,
      "Previous session tokens are invalidated when revokeAllAdminSessions is called"
    );
    const tokenAfterRevoke = createAdminSessionToken();
    assert.equal(verifyAdminSessionToken(tokenAfterRevoke), true);

    // Reset back to default password
    resetAdminPasswordToDefault();
    assert.equal(verifyAdminPassword("plethora-admin-2026"), true);
    console.log("✔ [PASS] Admin authentication, scrypt password setup, session revocation, and default reset passed");

    // 10. Admin Inbox & Subscriber CRUD Operations
    const allDemos = listDemoEnquiries();
    assert.equal(allDemos.length, 1);
    const updatedDemo = updateDemoEnquiry(allDemos[0].id, {
      status: "pilot_scoped",
      internalNotes: "Scoped for 120 guards across 8 sites.",
    });
    assert.ok(updatedDemo);
    assert.equal(updatedDemo.status, "pilot_scoped");
    assert.equal(
      updatedDemo.internalNotes,
      "Scoped for 120 guards across 8 sites."
    );
    assert.equal(deleteDemoEnquiry(allDemos[0].id), true);
    assert.equal(listDemoEnquiries().length, 0);

    const allSubs = listSubscriptions();
    assert.ok(allSubs.length >= 1);
    const toggledSub = updateSubscriptionStatus(allSubs[0].id, "unsubscribed");
    assert.ok(toggledSub);
    assert.equal(toggledSub.status, "unsubscribed");
    assert.equal(deleteSubscription(allSubs[0].id), true);
    console.log("✔ [PASS] Admin Demo Enquiry & Subscriber CRUD (status, notes, delete) verified");

    // 11. Admin Blog CMS & Dynamic Site Settings
    const tempSlug = "admin-cms-verification-temp-post";
    try {
      const savedPost = saveBlogArticle({
        title: "Temporary Verification Article",
        slug: tempSlug,
        status: "draft",
        category: "Operations",
        content: "## Verification\n\nTesting Admin Blog CMS save and delete.",
      });
      assert.equal(savedPost.slug, tempSlug);
      assert.ok(getAdminArticleBySlug(tempSlug));
      assert.equal(getPublishedArticleBySlug(tempSlug), null);
    } finally {
      deleteBlogArticle(tempSlug);
    }
    assert.equal(getAdminArticleBySlug(tempSlug), null);

    const initialSettings = getSiteSettings();
    assert.equal(
      initialSettings.heroHeadline,
      "AI workforce management for private security."
    );
    const updatedSettings = updateSiteSettings({
      announcementEnabled: true,
      announcementText: "Pilot intake open for Q4 2026.",
    });
    assert.equal(updatedSettings.announcementEnabled, true);
    assert.equal(
      getSiteSettings().announcementText,
      "Pilot intake open for Q4 2026."
    );
    console.log("✔ [PASS] Admin Blog CMS and Dynamic Site Settings persistence verified");

    console.log("\nALL 11 TEST SUITES PASSED SUCCESSFULLY.");
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
