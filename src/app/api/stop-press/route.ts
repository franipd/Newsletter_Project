import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

// Checked every ~2 hours by a GitHub Actions cron. A Haiku agent looks for
// genuinely major breaking tech news; if found, one row goes into stop_press
// and the site shows a ribbon until it expires. Deliberately high bar —
// most runs should find nothing.
export const maxDuration = 120;
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";
const RIBBON_TTL_HOURS = 6;

async function checkStopPress(): Promise<NextResponse> {
  const db = createAdminClient();
  if (!db || !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  // One ribbon at a time — if one is active, don't even run the agent.
  const nowIso = new Date().toISOString();
  const { data: active } = await db
    .from("stop_press")
    .select("id, headline")
    .gt("expires_at", nowIso)
    .limit(1)
    .maybeSingle();
  if (active) {
    return NextResponse.json({
      status: "skipped",
      reason: `ribbon already active: ${active.headline}`,
    });
  }

  const anthropic = new Anthropic();
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }],
    messages: [
      {
        role: "user",
        content: `You are the stop-press desk of The Daily Stack, a calm daily tech newspaper. Current UTC time: ${nowIso}.

Search the web for MAJOR breaking tech news from the last ~4 hours. The bar is deliberately very high — qualify ONLY if it is one of:
- a major cloud/platform outage happening now (AWS, GCP, Azure, GitHub, Cloudflare scale)
- an actively exploited critical zero-day just disclosed
- a frontier model release or major-vendor security incident announced in the last few hours

Routine releases, funding news, rumors, or anything already a day old do NOT qualify.

If nothing qualifies, reply with exactly:
NONE

If one story qualifies, reply with exactly two lines:
HEADLINE: <factual headline, under 90 chars, no hype>
SOURCE_URL: <the real https URL you found>`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const headline = text.match(/^HEADLINE:\s*(.+)$/m)?.[1]?.trim();
  const sourceUrl = text.match(/^SOURCE_URL:\s*(https:\/\/\S+)$/m)?.[1]?.trim();

  if (!headline || !sourceUrl) {
    return NextResponse.json({ status: "quiet", checked_at: nowIso });
  }

  // Don't repeat a story we've already run recently (even if expired).
  const { data: recent } = await db
    .from("stop_press")
    .select("id")
    .eq("source_url", sourceUrl)
    .limit(1)
    .maybeSingle();
  if (recent) {
    return NextResponse.json({ status: "skipped", reason: "already ran this story" });
  }

  const expiresAt = new Date(
    Date.now() + RIBBON_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString();
  const { error } = await db
    .from("stop_press")
    .insert({ headline, source_url: sourceUrl, expires_at: expiresAt });
  if (error) {
    return NextResponse.json(
      { error: `insert failed: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "published", headline, expires_at: expiresAt });
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return checkStopPress();
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return checkStopPress();
}
