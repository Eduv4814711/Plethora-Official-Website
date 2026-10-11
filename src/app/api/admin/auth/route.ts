import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  changeAdminPassword,
  createAdminSessionToken,
  getAdminSecurityInfo,
  isAuthenticatedAdmin,
  revokeAllAdminSessions,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/submissions";

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

    if (!checkRateLimit(`admin-auth:${ipKey}`)) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Too many sign-in attempts from this connection. Please wait a minute and try again.",
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as { password?: string };
    const password = typeof body.password === "string" ? body.password : "";

    if (!password || !verifyAdminPassword(password)) {
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
      secure: process.env.NODE_ENV === "production",
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
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as {
      action?: "change_password" | "revoke_sessions";
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

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
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return res;
    }

    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please enter both your current password and new password.",
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

    const result = changeAdminPassword(currentPassword, newPassword);
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
      secure: process.env.NODE_ENV === "production",
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

export async function DELETE() {
  const res = NextResponse.json({
    ok: true,
    message: "Signed out of Plethora Admin Console.",
  });
  res.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
