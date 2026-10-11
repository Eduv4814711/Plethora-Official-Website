import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  DynamicSiteSettings,
  getSiteSettings,
  updateSiteSettings,
} from "@/lib/site-settings";
import { sanitizeText } from "@/lib/submissions";

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    settings: getSiteSettings(),
  });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as Partial<DynamicSiteSettings>;

    const patch: Partial<DynamicSiteSettings> = {};
    if (body.heroBadgeText !== undefined) {
      patch.heroBadgeText = sanitizeText(body.heroBadgeText, 120);
    }
    if (body.heroHeadline !== undefined) {
      patch.heroHeadline = sanitizeText(body.heroHeadline, 140);
    }
    if (body.heroSubheadline !== undefined) {
      patch.heroSubheadline = sanitizeText(body.heroSubheadline, 360);
    }
    if (body.contactEmail !== undefined) {
      patch.contactEmail = sanitizeText(body.contactEmail, 160);
    }
    if (body.appLoginUrl !== undefined) {
      patch.appLoginUrl = sanitizeText(body.appLoginUrl, 240);
    }
    if (typeof body.showInternalDeploymentMetrics === "boolean") {
      patch.showInternalDeploymentMetrics = body.showInternalDeploymentMetrics;
    }
    if (body.internalDeploymentSummary !== undefined) {
      patch.internalDeploymentSummary = sanitizeText(
        body.internalDeploymentSummary,
        500
      );
    }
    if (typeof body.announcementEnabled === "boolean") {
      patch.announcementEnabled = body.announcementEnabled;
    }
    if (body.announcementText !== undefined) {
      patch.announcementText = sanitizeText(body.announcementText, 240);
    }
    if (body.announcementLinkText !== undefined) {
      patch.announcementLinkText = sanitizeText(body.announcementLinkText, 80);
    }
    if (body.announcementLinkHref !== undefined) {
      patch.announcementLinkHref = sanitizeText(body.announcementLinkHref, 200);
    }

    const updated = updateSiteSettings(patch);
    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      settings: updated,
      message: "Website settings saved and published.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid settings payload." },
      { status: 400 }
    );
  }
}
