import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/submissions";

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
