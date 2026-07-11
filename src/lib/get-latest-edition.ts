import { Edition } from "@/lib/types";
import { seedEdition } from "@/data/seed-edition";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mapEditionMeta } from "@/lib/get-editions";

/**
 * Returns the most recently published edition.
 * Falls back to local seed data until a Supabase project is connected
 * (see NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local).
 */
export async function getLatestEdition(): Promise<Edition> {
  if (!isSupabaseConfigured || !supabase) {
    return seedEdition;
  }

  // select * so the query still works before the liveness migration adds columns
  const { data: edition, error: editionError } = await supabase
    .from("editions")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (editionError || !edition) {
    return seedEdition;
  }

  const { data: stories, error: storiesError } = await supabase
    .from("stories")
    .select("id, section, headline, summary, source_name, source_url")
    .eq("edition_id", edition.id);

  if (storiesError || !stories) {
    return seedEdition;
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
