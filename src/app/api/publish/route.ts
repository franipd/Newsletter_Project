import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SECTIONS, Section } from "@/lib/types";
import { createAdminClient, areAgentsPaused } from "@/lib/supabase-admin";

// The full pipeline (5 curator searches + editor + validation) takes a few
// minutes. Requires Fluid Compute (default on new Vercel projects).
export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Per CLAUDE.md cost discipline: Haiku for mechanical curation, Sonnet for
// editorial judgment. No Opus in this pipeline.
const CURATOR_MODEL = "claude-haiku-4-5";
const EDITOR_MODEL = "claude-sonnet-5";

interface DraftStory {
  section: Section;
  headline: string;
  summary: string;
  source_name: string;
  source_url: string;
}

const SECTION_FOCUS: Record<Section, string> = {
  "AI/ML":
    "AI/ML news for working engineers: model releases, research results, tooling, notable industry moves",
  Security:
    "security news for working engineers: disclosed vulnerabilities, patches, breaches with technical lessons, CISA advisories, supply-chain issues",
  DevTools:
    "developer-tooling news: releases of build tools, editors, languages, frameworks, CI/CD platforms, package managers, notable open-source releases",
  "Infrastructure/Cloud":
    "infrastructure and cloud news: cloud provider announcements, pricing changes, Kubernetes/container ecosystem, databases, networking, IaC tooling",
  "Industry & Business":
    "tech industry/business news relevant to engineers: hiring trends, funding and acquisitions with product impact, pricing model changes, regulation affecting developers",
};

interface RejectedCandidate {
  headline: string;
  source_url: string;
}

interface EditorOutput {
  stories: DraftStory[];
  editors_note: string;
  also_considered: RejectedCandidate[];
}

// Structured-output schema for the editor. Counts are enforced in code —
// the schema guarantees shape and section values only.
const EDITION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["stories", "editors_note", "also_considered"],
  properties: {
    stories: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "headline", "summary", "source_name", "source_url"],
        properties: {
          section: { type: "string", enum: [...SECTIONS] },
          headline: { type: "string" },
          summary: { type: "string" },
          source_name: { type: "string" },
          source_url: { type: "string" },
        },
      },
    },
    editors_note: { type: "string" },
    also_considered: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "source_url"],
        properties: {
          headline: { type: "string" },
          source_url: { type: "string" },
        },
      },
    },
  },
} as const;

/** One curator: web-search a section, return candidate stories as text. */
async function curateSection(
  anthropic: Anthropic,
  section: Section,
  isoDate: string,
): Promise<{ text: string; searches: number }> {
  const prompt = `Gather candidate stories for the "${section}" section of The Daily Stack, a curated daily tech newsletter for software practitioners. Today's date: ${isoDate}.

Search the web and find 4 real, current (last ~48 hours preferred, last week max) ${SECTION_FOCUS[section]}.

For EACH of the 4 candidates return:
- headline: factual, no hype, sentence case, under 90 chars
- summary: 2-3 calm factual sentences (what happened, why it matters to practitioners)
- source_name: the publication name
- source_url: the REAL URL of the article you found — never fabricate URLs

Editorial voice: calm, factual, no hype. Return the 4 candidates as a plain list — your reply is raw data for an editor, not prose for a human.`;

  let messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];
  let response = await anthropic.messages.create({
    model: CURATOR_MODEL,
    max_tokens: 8000,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
    messages,
  });

  const countSearches = (r: Anthropic.Message) =>
    r.content.filter((b) => b.type === "server_tool_use").length;
  let searches = countSearches(response);

  // Server-side web search can pause after its iteration limit; resume by
  // re-sending the conversation (max 5 continuations).
  let continuations = 0;
  while (response.stop_reason === "pause_turn" && continuations < 5) {
    messages = [...messages, { role: "assistant", content: response.content }];
    response = await anthropic.messages.create({
      model: CURATOR_MODEL,
      max_tokens: 8000,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }],
      messages,
    });
    searches += countSearches(response);
    continuations++;
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return { text, searches };
}

/** The editor: pick the final 10 from 20 candidates, returns validated JSON. */
async function editEdition(
  anthropic: Anthropic,
  candidates: string,
  isoDate: string,
  editionNumber: number,
  previousErrors?: string[],
): Promise<EditorOutput> {
  const errorNote = previousErrors?.length
    ? `\n\nYour previous attempt failed validation:\n- ${previousErrors.join("\n- ")}\nFix these issues.`
    : "";

  const response = await anthropic.messages.create({
    model: EDITOR_MODEL,
    max_tokens: 16000,
    output_config: { format: { type: "json_schema", schema: EDITION_SCHEMA } },
    messages: [
      {
        role: "user",
        content: `You are the editor of The Daily Stack, a finite daily tech newsletter. Voice: calm, factual, practitioner-to-practitioner. No hype words, no exclamation marks.

Below are candidate stories gathered by section curators for Edition №${editionNumber}, dated ${isoDate}.

Select the FINAL 10 stories: exactly 2 per section, exactly these 5 sections: ${SECTIONS.join(", ")}.

Rules:
- No story may appear twice, even across sections (dedupe by topic/URL).
- Polish headlines (under 90 chars, sentence case) and summaries (2-3 sentences).
- Keep source_name and source_url EXACTLY as given — never alter or invent URLs. Drop any candidate without a real https URL.
- Prefer stories with practitioner impact.
- editors_note: 1-2 sentences, first person, on today's hardest judgment call — what you cut and why, or what made the front page. Calm and specific, no hype. Never mention AI, models, or vendor names when referring to yourself — you are simply "the editor".
- also_considered: every remaining candidate you did NOT select (headline + source_url only, deduplicated).${errorNote}

=== CANDIDATES ===
${candidates}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return JSON.parse(text) as EditorOutput;
}

/** The validator: deterministic rule checks (replaces the Haiku sub-agent). */
function validateEdition(stories: DraftStory[]): string[] {
  const errors: string[] = [];
  if (stories.length !== 10) {
    errors.push(`expected exactly 10 stories, got ${stories.length}`);
  }
  for (const section of SECTIONS) {
    const count = stories.filter((s) => s.section === section).length;
    if (count !== 2) {
      errors.push(`section "${section}" has ${count} stories, expected 2`);
    }
  }
  const urls = new Set<string>();
  for (const s of stories) {
    if (!s.headline?.trim() || !s.summary?.trim() || !s.source_name?.trim()) {
      errors.push(`story "${s.headline}" has an empty field`);
    }
    if (!/^https:\/\/.+\..+/.test(s.source_url ?? "")) {
      errors.push(`story "${s.headline}" has an invalid URL: ${s.source_url}`);
    }
    if (urls.has(s.source_url)) {
      errors.push(`duplicate URL: ${s.source_url}`);
    }
    urls.add(s.source_url);
  }
  return errors;
}

async function publishEdition(): Promise<NextResponse> {
  const db = createAdminClient();
  if (!db) {
    return NextResponse.json(
      { error: "SUPABASE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL not configured" },
      { status: 500 },
    );
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 },
    );
  }

  // Kill switch — checked before any AI call, so a paused run costs nothing.
  if (await areAgentsPaused(db)) {
    return NextResponse.json({
      status: "paused",
      reason: "agents are paused — resume in the Press Room (/press)",
    });
  }

  const isoDate = new Date().toISOString().slice(0, 10);

  // Idempotent: if today's edition exists, do nothing (safe to re-trigger).
  const { data: existing } = await db
    .from("editions")
    .select("id, edition_number")
    .eq("date", isoDate)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({
      status: "skipped",
      reason: `Edition №${existing.edition_number} already published for ${isoDate}`,
    });
  }

  const { data: latest } = await db
    .from("editions")
    .select("edition_number")
    .order("edition_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  const editionNumber = (latest?.edition_number ?? 0) + 1;

  const anthropic = new Anthropic();

  // Stage 1 — 5 curators in parallel (Haiku + web search)
  const curated = await Promise.all(
    SECTIONS.map((section) => curateSection(anthropic, section, isoDate)),
  );
  const candidates = SECTIONS.map(
    (section, i) => `--- ${section} candidates ---\n${curated[i].text}`,
  ).join("\n\n");
  const totalSearches = curated.reduce((sum, c) => sum + c.searches, 0);

  // Stage 2 + 3 — editor (Sonnet, structured output) with one validation retry
  let edited = await editEdition(anthropic, candidates, isoDate, editionNumber);
  let errors = validateEdition(edited.stories);
  if (errors.length > 0) {
    edited = await editEdition(anthropic, candidates, isoDate, editionNumber, errors);
    errors = validateEdition(edited.stories);
  }
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "validation failed after retry", details: errors },
      { status: 502 },
    );
  }
  const stories = edited.stories;

  // Stage 4 — publish to Supabase
  const editionRow = {
    date: isoDate,
    edition_number: editionNumber,
    stats: {
      curators: SECTIONS.length,
      searches: totalSearches,
      candidates: stories.length + edited.also_considered.length,
      published_at: new Date().toISOString(),
    },
    editors_note: edited.editors_note,
    also_considered: edited.also_considered,
  };
  let { data: edition, error: editionError } = await db
    .from("editions")
    .insert(editionRow)
    .select("id")
    .single();
  if (editionError?.message?.includes("column")) {
    // Liveness migration not yet applied — publish without the metadata
    // rather than failing the whole edition.
    ({ data: edition, error: editionError } = await db
      .from("editions")
      .insert({ date: isoDate, edition_number: editionNumber })
      .select("id")
      .single());
  }
  if (editionError || !edition) {
    return NextResponse.json(
      { error: `edition insert failed: ${editionError?.message}` },
      { status: 500 },
    );
  }

  const { error: storiesError } = await db.from("stories").insert(
    stories.map((s) => ({
      edition_id: edition.id,
      section: s.section,
      headline: s.headline,
      summary: s.summary,
      source_name: s.source_name,
      source_url: s.source_url,
    })),
  );
  if (storiesError) {
    // Roll back the edition row so a retry starts clean (cascade removes stories).
    await db.from("editions").delete().eq("id", edition.id);
    return NextResponse.json(
      { error: `stories insert failed: ${storiesError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "published",
    edition: editionNumber,
    date: isoDate,
    headlines: stories.map((s) => `[${s.section}] ${s.headline}`),
  });
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // unconfigured → locked
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

// Vercel Cron invokes with GET and (when CRON_SECRET is set) sends
// "Authorization: Bearer <CRON_SECRET>" automatically.
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return publishEdition();
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return publishEdition();
}
