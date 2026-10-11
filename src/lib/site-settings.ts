import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { siteConfig } from "./site-config.ts";

export interface DynamicSiteSettings {
  heroBadgeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCtaLabel: string;
  contactEmail: string;
  appLoginUrl: string;
  showInternalDeploymentMetrics: boolean;
  internalDeploymentSummary: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementLinkText: string;
  announcementLinkHref: string;
  acceptingDemoRequests: boolean;
  acceptingEmailSignups: boolean;
  notificationRecipientEmail: string;
  webhookForwardingUrl: string;
  updatedAt: string;
}

export const DEFAULT_SITE_SETTINGS: DynamicSiteSettings = {
  heroBadgeText: "Built in South Africa for Private Security Operations",
  heroHeadline: "AI workforce management for private security.",
  heroSubheadline:
    "Connect guard deployment, rostering, attendance, payroll support and operational workflows in one platform built for the realities of security operations.",
  primaryCtaLabel: "Request a demo",
  contactEmail: siteConfig.contactEmail,
  appLoginUrl: siteConfig.appLoginUrl,
  showInternalDeploymentMetrics: true,
  internalDeploymentSummary:
    "Plethora is deployed internally at Quick Bopha Security (88 guards and 103 platform users recorded in our 11 October 2026 operating plan), providing a practical proving ground for workflow depth before external customer rollouts.",
  announcementEnabled: false,
  announcementText:
    "Now scoping Q4 2026 operational pilots for South African private security companies (50–250 guards).",
  announcementLinkText: "Request a pilot walkthrough",
  announcementLinkHref: "/contact#demo-request",
  acceptingDemoRequests: true,
  acceptingEmailSignups: true,
  notificationRecipientEmail: siteConfig.contactEmail,
  webhookForwardingUrl: "",
  updatedAt: "2026-10-11T12:00:00.000Z",
};

function getSettingsFilePath(): string {
  const baseDir = process.env.PLETHORA_STORAGE_DIR
    ? process.env.PLETHORA_STORAGE_DIR
    : path.join(process.cwd(), "data");
  try {
    fs.mkdirSync(baseDir, { recursive: true });
    fs.accessSync(baseDir, fs.constants.W_OK);
    return path.join(baseDir, "site-settings.json");
  } catch {
    const tmpDir = path.join(os.tmpdir(), "plethora-submissions");
    fs.mkdirSync(tmpDir, { recursive: true });
    return path.join(tmpDir, "site-settings.json");
  }
}

export function getSiteSettings(): DynamicSiteSettings {
  const filePath = getSettingsFilePath();
  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_SITE_SETTINGS };
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<DynamicSiteSettings>;
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export function updateSiteSettings(
  patch: Partial<DynamicSiteSettings>
): DynamicSiteSettings {
  const current = getSiteSettings();
  const next: DynamicSiteSettings = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  const filePath = getSettingsFilePath();
  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

export function resetSiteSettingsToDefault(): DynamicSiteSettings {
  const next: DynamicSiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
    updatedAt: new Date().toISOString(),
  };
  const filePath = getSettingsFilePath();
  fs.writeFileSync(filePath, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
