import { getLatestEdition } from "@/lib/get-latest-edition";
import { getRecentEditionSummaries } from "@/lib/get-editions";
import EditionView from "@/components/EditionView";

// Re-fetch from Supabase at most once every 5 minutes, so new editions
// and story edits appear without a redeploy.
export const revalidate = 300;

export default async function Home() {
  const [edition, recent] = await Promise.all([
    getLatestEdition(),
    getRecentEditionSummaries(),
  ]);

  return <EditionView edition={edition} recent={recent} />;
}
