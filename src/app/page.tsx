import { getLatestEdition } from "@/lib/get-latest-edition";
import { SECTIONS } from "@/lib/types";
import SectionNav from "@/components/SectionNav";
import SectionGroup from "@/components/SectionGroup";

// Re-fetch from Supabase at most once every 5 minutes, so new editions
// and story edits appear without a redeploy.
export const revalidate = 300;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const edition = await getLatestEdition();

  return (
    <>
      <SectionNav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        <header className="border-b-4 border-rule pb-6 pt-10">
          <div className="flex items-baseline justify-between border-b border-rule/30 pb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span>Edition №&nbsp;{edition.editionNumber}</span>
            <span className="tabular-nums">{formatDate(edition.date)}</span>
          </div>
          <h1 className="mt-6 text-center font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            The Daily Stack
          </h1>
          <p className="mt-3 text-center text-sm italic text-muted">
            {edition.stories.length} stories, five sections, no scrolling
            past the end.
          </p>
        </header>

        {SECTIONS.map((section) => (
          <SectionGroup
            key={section}
            section={section}
            stories={edition.stories.filter((s) => s.section === section)}
          />
        ))}

        <footer className="border-t-2 border-rule py-10 text-center">
          <p className="font-serif text-lg italic text-foreground">
            That&rsquo;s today&rsquo;s edition.
          </p>
          <p className="mt-1 text-sm text-muted">
            You&rsquo;re done — go build something.
          </p>
        </footer>
      </main>
    </>
  );
}
