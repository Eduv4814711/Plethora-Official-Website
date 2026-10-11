import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  deleteDemoEnquiry,
  deleteSubscription,
  DemoEnquiryStatus,
  listDemoEnquiries,
  listSubscriptions,
  SubscriptionStatus,
  updateDemoEnquiry,
  updateSubscriptionStatus,
} from "@/lib/submissions";

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    demoEnquiries: listDemoEnquiries(),
    subscriptions: listSubscriptions(),
  });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as {
      kind?: "demo" | "subscription";
      id?: string;
      status?: string;
      internalNotes?: string;
    };

    if (!body.id || !body.kind) {
      return NextResponse.json(
        { ok: false, message: "Missing record kind or id." },
        { status: 400 }
      );
    }

    if (body.kind === "demo") {
      const updated = updateDemoEnquiry(body.id, {
        status: body.status as DemoEnquiryStatus | undefined,
        internalNotes: body.internalNotes,
      });
      if (!updated) {
        return NextResponse.json(
          { ok: false, message: "Demo enquiry not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, record: updated });
    }

    if (body.kind === "subscription") {
      const updated = updateSubscriptionStatus(
        body.id,
        body.status as SubscriptionStatus
      );
      if (!updated) {
        return NextResponse.json(
          { ok: false, message: "Subscription record not found." },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, record: updated });
    }

    return NextResponse.json(
      { ok: false, message: "Unsupported record kind." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const id = searchParams.get("id");

  if (!kind || !id) {
    return NextResponse.json(
      { ok: false, message: "Missing kind or id query parameter." },
      { status: 400 }
    );
  }

  if (kind === "demo") {
    const deleted = deleteDemoEnquiry(id);
    return NextResponse.json({ ok: deleted });
  }

  if (kind === "subscription") {
    const deleted = deleteSubscription(id);
    return NextResponse.json({ ok: deleted });
  }

  return NextResponse.json(
    { ok: false, message: "Invalid kind." },
    { status: 400 }
  );
}
