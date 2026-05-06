import { NextRequest, NextResponse } from "next/server";

import { dbConnect } from "@/lib/db/connect";
import { Lead } from "@/lib/models";
import { contactInputSchema } from "@/lib/validations/contact";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── 1. Rate limit (per IP) ───────────────────────────────────────────────
  const ip = clientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { max: 5, windowSeconds: 60 * 10 }); // 5 / 10 min
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.resetSeconds) } },
    );
  }

  // ── 2. Parse + validate ──────────────────────────────────────────────────
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactInputSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: firstIssue?.message ?? "Invalid input",
        field: firstIssue?.path.join("."),
      },
      { status: 400 },
    );
  }

  // ── 3. Honeypot — silently mark as spam, return success to bot ───────────
  const isHoneypotTripped =
    typeof parsed.data.company === "string" && parsed.data.company.length > 0;

  // ── 4. Persist ───────────────────────────────────────────────────────────
  try {
    await dbConnect();
    await Lead.create({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      message: parsed.data.message,
      source: "homepage-form",
      status: isHoneypotTripped ? "spam" : "new",
      priority: "medium",
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });
  } catch (err) {
    // Don't leak DB internals to the client.
    if (process.env.NODE_ENV !== "production") {
      console.error("[contact] persist failed:", err);
    }
    return NextResponse.json(
      { ok: false, error: "Couldn't save your message. Please email me directly." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, message: "Got it. I'll reply within 48 hours." },
    { status: 201 },
  );
}
