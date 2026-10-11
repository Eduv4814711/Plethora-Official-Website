import { NextRequest, NextResponse } from "next/server";
import { processDemoEnquiry } from "@/lib/submissions";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const body = (await request.json()) as Record<string, unknown>;
    const result = await processDemoEnquiry(body, ip);

    return NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid request payload. Please submit valid JSON.",
      },
      { status: 400 }
    );
  }
}
