import { Edition, EditionStats, RejectedStory, StopPressItem } from "@/lib/types";
import { seedEdition } from "@/data/seed-edition";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapEditionMeta(row: any): Pick<
  Edition,
  "stats" | "editorsNote" | "alsoConsidered"
> {
  const stats: EditionStats | null = row.stats
    ? {
        curators: row.stats.curators,
        searches: row.stats.searches,
        candidates: row.stats.candidates,
        publishedAt: row.stats.published_at,
      }
    : null;
  const alsoConsidered: RejectedStory[] | null = Array.isArray(
    row.also_considered,
  )
    ? row.also_considered.map((r: any) => ({
        headline: r.headline,
        sourceUrl: r.source_url,
      }))
    : null;
  return { stats, editorsNote: row.editors_note ?? null, alsoConsidered };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface EditionSummary {
  date: string; // ISO date
  editionNumber: number;
}

/**
 * Returns summaries of the most recent editions, newest first — used for
 * the "Past editions" archive strip. Falls back to the seed edition until
 * Supabase is connected.
 */
export async function getRecentEditionSummaries(
  limit = 5,
): Promise<EditionSummary[]> {
  const seedSummary = [
    { date: seedEdition.date, editionNumber: seedEdition.editionNumber },
  ];

  if (!isSupabaseConfigured || !supabase) {
    return seedSummary;
  }

  const { data, error } = await supabase
    .from("editions")
    .select("date, edition_number")
    .order("date", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return seedSummary;
  }

  return data.map((e) => ({ date: e.date, editionNumber: e.edition_number }));
}

/**
 * Returns the full edition published on the given ISO date, or null if
 * none exists. Falls back to the seed edition until Supabase is connected.
 */
export async function getEditionByDate(date: string): Promise<Edition | null> {
  if (!isSupabaseConfigured || !supabase) {
    return date === seedEdition.date ? seedEdition : null;
  }

  // select * so the query still works before the liveness migration adds columns
  const { data: edition, error: editionError } = await supabase
    .from("editions")
    .select("*")
    .eq("date", date)
    .single();

  if (editionError || !edition) {
    return null;
  }

  const { data: stories, error: storiesError } = await supabase
    .from("stories")
    .select("id, section, headline, summary, source_name, source_url")
    .eq("edition_id", edition.id);

  if (storiesError || !stories) {
    return null;
  }

  return {
    id: edition.id,
    date: edition.date,
    editionNumber: edition.edition_number,
    stories: stories.map((s) => ({
      id: s.id,
      section: s.section,
      headline: s.headline,
      summary: s.summary,
      sourceName: s.source_name,
      sourceUrl: s.source_url,
    })),
    ...mapEditionMeta(edition),
  };
}

/**
 * Returns the currently active stop-press item (breaking-news ribbon),
 * or null when there is none — which is most of the time, by design.
 */
export async function getActiveStopPress(): Promise<StopPressItem | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  const { data, error } = await supabase
    .from("stop_press")
    .select("headline, source_url, created_at")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return {
    headline: data.headline,
    sourceUrl: data.source_url,
    createdAt: data.created_at,
  };
}
