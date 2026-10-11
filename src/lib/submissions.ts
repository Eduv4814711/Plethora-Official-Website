import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

export interface SubscriptionPayload {
  email: string;
  consent: boolean;
  source?: string;
  honeypot?: string;
}

export interface DemoEnquiryPayload {
  name: string;
  email: string;
  company: string;
  guardCount: string;
  operationalFocus?: string;
  privacyAccepted: boolean;
  honeypot?: string;
}

export interface SubmissionResult {
  ok: boolean;
  status: number;
  code:
    | "RECORDED"
    | "DUPLICATE"
    | "VALIDATION_ERROR"
    | "RATE_LIMITED"
    | "SPAM_BLOCKED"
    | "PROVIDER_ERROR";
  message: string;
  fieldErrors?: Record<string, string>;
  providerMode?: string;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const ALLOWED_GUARD_COUNTS = [
  "1-50",
  "51-150",
  "151-250",
  "251-500",
  "500+",
] as const;

// In-memory sliding window rate limiter
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 6;

export function resetRateLimiterForTests() {
  rateLimitStore.clear();
}

export function checkRateLimit(ipKey: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(ipKey) || []).filter(
    (t) => t > windowStart
  );
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ipKey, timestamps);
    return false;
  }
  timestamps.push(now);
  rateLimitStore.set(ipKey, timestamps);
  return true;
}

export function sanitizeText(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizeEmail(value: unknown): string {
  return sanitizeText(value, 254).toLowerCase();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length < 5 || email.length > 254) return false;
  if (!EMAIL_REGEX.test(email)) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain.includes(".") || domain.endsWith(".")) return false;
  return true;
}

export function hashIdentifier(input: string): string {
  return crypto
    .createHash("sha256")
    .update(input.toLowerCase().trim())
    .digest("hex")
    .slice(0, 12);
}

function resolveStorageDir(): string {
  if (process.env.PLETHORA_STORAGE_DIR) {
    return process.env.PLETHORA_STORAGE_DIR;
  }
  const repoDataDir = path.join(process.cwd(), "data", "submissions");
  try {
    fs.mkdirSync(repoDataDir, { recursive: true });
    fs.accessSync(repoDataDir, fs.constants.W_OK);
    return repoDataDir;
  } catch {
    const tmpFallback = path.join(os.tmpdir(), "plethora-submissions");
    fs.mkdirSync(tmpFallback, { recursive: true });
    return tmpFallback;
  }
}

function readJsonLines<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch {
    return [];
  }
}

function appendJsonLine(filePath: string, record: unknown): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(filePath, JSON.stringify(record) + "\n", "utf-8");
}

async function dispatchToExternalProvider(
  kind: "subscription" | "demo_enquiry",
  record: Record<string, unknown>
): Promise<{ ok: boolean; mode: string; error?: string }> {
  const provider = (
    process.env.PLETHORA_SUBMISSION_PROVIDER || "file"
  ).toLowerCase();

  if (provider === "webhook") {
    const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL;
    if (!webhookUrl) {
      return {
        ok: false,
        mode: "webhook",
        error: "SUBMISSION_WEBHOOK_URL is not configured on the server.",
      };
    }
    const body = JSON.stringify({ kind, record });
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (process.env.SUBMISSION_WEBHOOK_SECRET) {
      headers["X-Plethora-Signature"] = crypto
        .createHmac("sha256", process.env.SUBMISSION_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");
    }
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body,
    });
    if (!res.ok) {
      return {
        ok: false,
        mode: "webhook",
        error: `Webhook responded with HTTP ${res.status}`,
      };
    }
    return { ok: true, mode: "webhook" };
  }

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.startsWith("re_placeholder")) {
      return {
        ok: false,
        mode: "resend",
        error: "RESEND_API_KEY is not configured with a live credential.",
      };
    }

    if (kind === "subscription" && process.env.RESEND_AUDIENCE_ID && !process.env.RESEND_AUDIENCE_ID.startsWith("aud_placeholder")) {
      const res = await fetch(
        `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: record.email,
            unsubscribed: false,
          }),
        }
      );
      if (!res.ok) {
        return {
          ok: false,
          mode: "resend",
          error: `Resend Audience API returned HTTP ${res.status}`,
        };
      }
      return { ok: true, mode: "resend" };
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Plethora Website <notifications@plethoraqbs.co.za>";
    const toEmail = process.env.RESEND_TO_EMAIL || "info@plethoraqbs.co.za";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject:
          kind === "demo_enquiry"
            ? `New Plethora Demo Request — ${record.company}`
            : `New Plethora Product Update Subscription`,
        text: JSON.stringify(record, null, 2),
      }),
    });

    if (!res.ok) {
      return {
        ok: false,
        mode: "resend",
        error: `Resend Email API returned HTTP ${res.status}`,
      };
    }
    return { ok: true, mode: "resend" };
  }

  return { ok: true, mode: "file" };
}

export type DemoEnquiryStatus =
  | "new"
  | "contacted"
  | "pilot_scoped"
  | "archived";

export interface DemoEnquiryRecord {
  id: string;
  name: string;
  email: string;
  emailHash: string;
  company: string;
  guardCount: string;
  operationalFocus: string;
  privacyAccepted: boolean;
  journeyType: string;
  marketingOptIn: boolean;
  status: DemoEnquiryStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SubscriptionStatus = "active" | "unsubscribed";

export interface SubscriptionRecord {
  id: string;
  email: string;
  emailHash: string;
  consent: boolean;
  consentPurpose: string;
  source: string;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt?: string;
}

function writeJsonLines<T>(filePath: string, records: T[]): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const content =
    records.length > 0
      ? records.map((r) => JSON.stringify(r)).join("\n") + "\n"
      : "";
  fs.writeFileSync(filePath, content, "utf-8");
}

export async function processEmailSubscription(
  raw: Record<string, unknown>,
  ipKey = "local"
): Promise<SubmissionResult> {
  if (!checkRateLimit(`sub:${ipKey}`)) {
    return {
      ok: false,
      status: 429,
      code: "RATE_LIMITED",
      message:
        "Too many subscription attempts from this connection. Please wait a minute and try again.",
    };
  }

  // Honeypot anti-spam check
  const honeypot = sanitizeText(raw.honeypot, 100);
  if (honeypot.length > 0) {
    return {
      ok: false,
      status: 400,
      code: "SPAM_BLOCKED",
      message: "Unable to process submission.",
    };
  }

  const email = normalizeEmail(raw.email);
  const consent = raw.consent === true;
  const source = sanitizeText(raw.source || "website", 64);

  const fieldErrors: Record<string, string> = {};
  if (!isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address (for example, name@company.co.za).";
  }
  if (!consent) {
    fieldErrors.consent =
      "Please confirm consent to receive Plethora product updates and editorial insights.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Please review the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const storageDir = resolveStorageDir();
  const subFile = path.join(storageDir, "subscriptions.jsonl");
  const existing = readJsonLines<{ emailHash: string; email: string }>(subFile);
  const emailHash = hashIdentifier(email);

  if (existing.some((item) => item.emailHash === emailHash || item.email === email)) {
    console.info(`[Plethora Subscribe] Duplicate subscription handled cleanly (ref:${emailHash})`);
    return {
      ok: true,
      status: 200,
      code: "DUPLICATE",
      message:
        "This email address is already subscribed to Plethora updates. No further action is needed.",
      providerMode: process.env.PLETHORA_SUBMISSION_PROVIDER || "file",
    };
  }

  const record: SubscriptionRecord = {
    id: crypto.randomUUID(),
    email,
    emailHash,
    consent: true,
    consentPurpose: "product_updates_and_insights",
    source,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  const dispatch = await dispatchToExternalProvider(
    "subscription",
    record as unknown as Record<string, unknown>
  );
  if (!dispatch.ok) {
    console.error(`[Plethora Subscribe] Provider dispatch failed (mode:${dispatch.mode})`);
    return {
      ok: false,
      status: 502,
      code: "PROVIDER_ERROR",
      message:
        "We could not record your subscription right now due to a service configuration issue. Please try again later or email us directly.",
      providerMode: dispatch.mode,
    };
  }

  appendJsonLine(subFile, record);
  console.info(`[Plethora Subscribe] Recorded subscription (ref:${emailHash}, mode:${dispatch.mode})`);

  return {
    ok: true,
    status: 201,
    code: "RECORDED",
    message:
      "Thank you. Your email address has been added to the Plethora updates list.",
    providerMode: dispatch.mode,
  };
}

export async function processDemoEnquiry(
  raw: Record<string, unknown>,
  ipKey = "local"
): Promise<SubmissionResult> {
  if (!checkRateLimit(`demo:${ipKey}`)) {
    return {
      ok: false,
      status: 429,
      code: "RATE_LIMITED",
      message:
        "Too many enquiry attempts from this connection. Please wait a minute and try again.",
    };
  }

  const honeypot = sanitizeText(raw.honeypot, 100);
  if (honeypot.length > 0) {
    return {
      ok: false,
      status: 400,
      code: "SPAM_BLOCKED",
      message: "Unable to process enquiry.",
    };
  }

  const name = sanitizeText(raw.name, 120);
  const email = normalizeEmail(raw.email);
  const company = sanitizeText(raw.company, 140);
  const guardCount = sanitizeText(raw.guardCount, 40);
  const operationalFocus = sanitizeText(raw.operationalFocus, 600);
  const privacyAccepted = raw.privacyAccepted === true;

  const fieldErrors: Record<string, string> = {};
  if (!name || name.length < 2) {
    fieldErrors.name = "Please enter your full name.";
  }
  if (!isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid business email address.";
  }
  if (!company || company.length < 2) {
    fieldErrors.company = "Please enter your security company name.";
  }
  if (
    !guardCount ||
    !ALLOWED_GUARD_COUNTS.includes(
      guardCount as (typeof ALLOWED_GUARD_COUNTS)[number]
    )
  ) {
    fieldErrors.guardCount = "Please select your approximate guard fleet size.";
  }
  if (!privacyAccepted) {
    fieldErrors.privacyAccepted =
      "Please confirm that we may use these details to respond to your demo enquiry.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Please complete all required fields to submit your demo request.",
      fieldErrors,
    };
  }

  const storageDir = resolveStorageDir();
  const demoFile = path.join(storageDir, "demo-enquiries.jsonl");
  const emailHash = hashIdentifier(email);

  const record: DemoEnquiryRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    emailHash,
    company,
    guardCount,
    operationalFocus,
    privacyAccepted: true,
    journeyType: "demo_evaluation_enquiry",
    marketingOptIn: false, // Explicitly separated from marketing list
    status: "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
  };

  const dispatch = await dispatchToExternalProvider(
    "demo_enquiry",
    record as unknown as Record<string, unknown>
  );
  if (!dispatch.ok) {
    console.error(`[Plethora Demo] Provider dispatch failed (mode:${dispatch.mode})`);
    return {
      ok: false,
      status: 502,
      code: "PROVIDER_ERROR",
      message:
        "We could not record your demo request right now due to a service configuration issue. Please email us directly.",
      providerMode: dispatch.mode,
    };
  }

  appendJsonLine(demoFile, record);
  console.info(
    `[Plethora Demo] Recorded demo enquiry (ref:${emailHash}, guards:${guardCount}, mode:${dispatch.mode})`
  );

  return {
    ok: true,
    status: 201,
    code: "RECORDED",
    message:
      "Thank you. Your demo enquiry has been recorded. We will respond via email to scope a walkthrough for your operation.",
    providerMode: dispatch.mode,
  };
}

export function listDemoEnquiries(): DemoEnquiryRecord[] {
  const storageDir = resolveStorageDir();
  const demoFile = path.join(storageDir, "demo-enquiries.jsonl");
  const rows = readJsonLines<Partial<DemoEnquiryRecord>>(demoFile);
  return rows
    .map((item) => ({
      id: item.id || crypto.randomUUID(),
      name: item.name || "Unknown",
      email: item.email || "",
      emailHash: item.emailHash || hashIdentifier(item.email || ""),
      company: item.company || "",
      guardCount: item.guardCount || "51-150",
      operationalFocus: item.operationalFocus || "",
      privacyAccepted: item.privacyAccepted ?? true,
      journeyType: item.journeyType || "demo_evaluation_enquiry",
      marketingOptIn: false,
      status: (item.status as DemoEnquiryStatus) || "new",
      internalNotes: item.internalNotes || "",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateDemoEnquiry(
  id: string,
  patch: { status?: DemoEnquiryStatus; internalNotes?: string }
): DemoEnquiryRecord | null {
  const storageDir = resolveStorageDir();
  const demoFile = path.join(storageDir, "demo-enquiries.jsonl");
  const all = listDemoEnquiries();
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const allowedStatuses: DemoEnquiryStatus[] = [
    "new",
    "contacted",
    "pilot_scoped",
    "archived",
  ];
  const nextStatus =
    patch.status && allowedStatuses.includes(patch.status)
      ? patch.status
      : all[idx].status;

  const nextNotes =
    patch.internalNotes !== undefined
      ? sanitizeText(patch.internalNotes, 1200)
      : all[idx].internalNotes || "";

  const updated: DemoEnquiryRecord = {
    ...all[idx],
    status: nextStatus,
    internalNotes: nextNotes,
    updatedAt: new Date().toISOString(),
  };

  all[idx] = updated;
  writeJsonLines(demoFile, all);
  return updated;
}

export function deleteDemoEnquiry(id: string): boolean {
  const storageDir = resolveStorageDir();
  const demoFile = path.join(storageDir, "demo-enquiries.jsonl");
  const all = listDemoEnquiries();
  const filtered = all.filter((item) => item.id !== id);
  if (filtered.length === all.length) return false;
  writeJsonLines(demoFile, filtered);
  return true;
}

export function listSubscriptions(): SubscriptionRecord[] {
  const storageDir = resolveStorageDir();
  const subFile = path.join(storageDir, "subscriptions.jsonl");
  const rows = readJsonLines<Partial<SubscriptionRecord>>(subFile);
  return rows
    .map((item) => ({
      id: item.id || crypto.randomUUID(),
      email: item.email || "",
      emailHash: item.emailHash || hashIdentifier(item.email || ""),
      consent: item.consent ?? true,
      consentPurpose: item.consentPurpose || "product_updates_and_insights",
      source: item.source || "website",
      status: (item.status as SubscriptionStatus) || "active",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus
): SubscriptionRecord | null {
  const storageDir = resolveStorageDir();
  const subFile = path.join(storageDir, "subscriptions.jsonl");
  const all = listSubscriptions();
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const nextStatus: SubscriptionStatus =
    status === "unsubscribed" ? "unsubscribed" : "active";

  const updated: SubscriptionRecord = {
    ...all[idx],
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  all[idx] = updated;
  writeJsonLines(subFile, all);
  return updated;
}

export function deleteSubscription(id: string): boolean {
  const storageDir = resolveStorageDir();
  const subFile = path.join(storageDir, "subscriptions.jsonl");
  const all = listSubscriptions();
  const filtered = all.filter((item) => item.id !== id);
  if (filtered.length === all.length) return false;
  writeJsonLines(subFile, filtered);
  return true;
}
