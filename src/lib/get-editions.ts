import { Edition } from "@/lib/types";
import { seedEdition } from "@/data/seed-edition";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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

  const { data: edition, error: editionError } = await supabase
    .from("editions")
    .select("id, date, edition_number")
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
  };
}
