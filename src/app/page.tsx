import { getLatestEdition } from "@/lib/get-latest-edition";
import { SECTIONS } from "@/lib/types";
import SectionNav from "@/components/SectionNav";
import SectionGroup from "@/components/SectionGroup";

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
        <header className="border-b border-neutral-200 py-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
            Edition #{edition.editionNumber}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-neutral-950 sm:text-5xl">
            The Daily Stack
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            {formatDate(edition.date)} · {edition.stories.length} stories ·
            today&rsquo;s edition
          </p>
        </header>

        {SECTIONS.map((section) => (
          <SectionGroup
            key={section}
            section={section}
            stories={edition.stories.filter((s) => s.section === section)}
          />
        ))}

        <footer className="border-t border-neutral-200 py-10 text-center text-sm text-neutral-500">
          That&rsquo;s today&rsquo;s edition. You&rsquo;re done — go build something.
        </footer>
      </main>
    </>
  );
}
