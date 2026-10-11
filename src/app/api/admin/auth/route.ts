import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  changeAdminPassword,
  createAdminSessionToken,
  getAdminSecurityInfo,
  isAuthenticatedAdmin,
  resetAdminPasswordToDefault,
  revokeAllAdminSessions,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/submissions";

function isSecureRequest(req: NextRequest): boolean {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim().toLowerCase() === "https";
  }
  return req.nextUrl.protocol === "https:";
}

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    securityInfo: getAdminSecurityInfo(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipKey = forwardedFor ? forwardedFor.split(",")[0].trim() : "local";

    const body = (await req.json()) as { password?: string };
    const password =
      typeof body.password === "string" ? body.password.trim() : "";

    if (!password || !verifyAdminPassword(password)) {
      if (!checkRateLimit(`admin-auth:${ipKey}`)) {
        return NextResponse.json(
          {
            ok: false,
            message:
              "Too many failed sign-in attempts. Please wait a minute and try again.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid administrator password.",
        },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json({
      ok: true,
      message: "Signed in to Plethora Admin Console.",
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isSecureRequest(req),
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      action?:
        | "change_password"
        | "revoke_sessions"
        | "reset_default_password";
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    const authenticated = await isAuthenticatedAdmin();
    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword.trim()
        : "";

    // Require either an active admin session cookie or a valid currentPassword
    if (!authenticated && (!currentPassword || !verifyAdminPassword(currentPassword))) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Your admin session expired. Please refresh the page, sign in again, and retry.",
        },
        { status: 401 }
      );
    }

    const secureCookie = isSecureRequest(req);

    if (body.action === "revoke_sessions") {
      const securityInfo = revokeAllAdminSessions();
      const freshToken = createAdminSessionToken();
      const res = NextResponse.json({
        ok: true,
        message:
          "All other administrator sessions have been revoked. Your current session remains active.",
        securityInfo,
      });
      res.cookies.set(ADMIN_COOKIE_NAME, freshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: secureCookie,
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    if (body.action === "reset_default_password") {
      const securityInfo = resetAdminPasswordToDefault();
      const freshToken = createAdminSessionToken();
      const res = NextResponse.json({
        ok: true,
        message:
          "Administrator password restored to default (plethora-admin-2026).",
        securityInfo,
      });
      res.cookies.set(ADMIN_COOKIE_NAME, freshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: secureCookie,
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword.trim() : "";
    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword.trim()
        : "";

    if (!newPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please enter a new administrator password.",
        },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "New password and confirmation password do not match.",
        },
        { status: 400 }
      );
    }

    // When authenticated in the admin dashboard, currentPassword is not required
    const result = authenticated
      ? changeAdminPassword(newPassword)
      : changeAdminPassword(currentPassword, newPassword);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 400 }
      );
    }

    const freshToken = createAdminSessionToken();
    const res = NextResponse.json({
      ok: true,
      message: result.message,
      securityInfo: result.securityInfo,
    });

    res.cookies.set(ADMIN_COOKIE_NAME, freshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie,
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({
    ok: true,
    message: "Signed out of Plethora Admin Console.",
  });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(req),
    path: "/",
    maxAge: 0,
  });
  return res;
}
