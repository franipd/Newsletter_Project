import Link from "next/link";
import { Edition, SECTIONS } from "@/lib/types";
import { EditionSummary } from "@/lib/get-editions";
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

function formatShortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function EditionView({
  edition,
  recent,
}: {
  edition: Edition;
  recent: EditionSummary[];
}) {
  const latestDate = recent[0]?.date;
  const isLatest = edition.date === latestDate;

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
          {recent.length > 1 && (
            <nav
              aria-label="Past editions"
              className="mt-5 border-t border-rule/30 pt-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted"
            >
              <span className="mr-3">Editions</span>
              {recent.map((s) => {
                const label = formatShortDate(s.date);
                if (s.date === edition.date) {
                  return (
                    <span
                      key={s.date}
                      className="mr-3 border-b-2 border-accent pb-0.5 text-foreground"
                    >
                      {label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={s.date}
                    href={s.date === latestDate ? "/" : `/edition/${s.date}`}
                    className="mr-3 decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}
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
            {isLatest
              ? "That’s today’s edition."
              : `That’s the edition for ${formatDate(edition.date)}.`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {isLatest ? (
              "You’re done — go build something."
            ) : (
              <Link
                href="/"
                className="decoration-accent decoration-2 underline-offset-4 hover:text-foreground hover:underline"
              >
                Read today&rsquo;s edition &rarr;
              </Link>
            )}
          </p>
        </footer>
      </main>
    </>
  );
}
