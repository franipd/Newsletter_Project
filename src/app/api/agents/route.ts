import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Agent kill switch. GET returns the current state (public — the site shows
// it anyway). POST {paused: boolean} with the CRON_SECRET flips it.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = createAdminClient();
  if (!db) {
    return NextResponse.json({ paused: false, configured: false });
  }
  const { data } = await db
    .from("agent_settings")
    .select("paused, updated_at")
    .eq("id", 1)
    .maybeSingle();
  return NextResponse.json({
    paused: data?.paused === true,
    updated_at: data?.updated_at ?? null,
  });
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  if (!db) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  let paused: unknown;
  try {
    ({ paused } = await request.json());
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (typeof paused !== "boolean") {
    return NextResponse.json(
      { error: "body must be {\"paused\": true|false}" },
      { status: 400 },
    );
  }

  const { error } = await db
    .from("agent_settings")
    .upsert({ id: 1, paused, updated_at: new Date().toISOString() });
  if (error) {
    return NextResponse.json(
      { error: `update failed: ${error.message} (run migration-3-agent-control.sql?)` },
      { status: 500 },
    );
  }

  return NextResponse.json({ paused });
}
