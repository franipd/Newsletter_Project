import { getLatestEdition } from "@/lib/get-latest-edition";
import {
  getRecentEditionSummaries,
  getActiveStopPress,
} from "@/lib/get-editions";
import EditionView from "@/components/EditionView";

// Re-fetch from Supabase at most once every 5 minutes, so new editions,
// story edits, and the stop-press ribbon appear without a redeploy.
export const revalidate = 300;

export default async function Home() {
  const [edition, recent, stopPress] = await Promise.all([
    getLatestEdition(),
    getRecentEditionSummaries(),
    getActiveStopPress(),
  ]);

  return (
    <EditionView edition={edition} recent={recent} stopPress={stopPress} />
  );
}
