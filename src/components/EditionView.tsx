import Link from "next/link";
import { Edition, SECTIONS, StopPressItem } from "@/lib/types";
import { EditionSummary } from "@/lib/get-editions";
import SectionNav from "@/components/SectionNav";
import SectionGroup from "@/components/SectionGroup";

function formatUtcTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

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
  stopPress,
}: {
  edition: Edition;
  recent: EditionSummary[];
  stopPress?: StopPressItem | null;
}) {
  const latestDate = recent[0]?.date;
  const isLatest = edition.date === latestDate;

  return (
    <>
      {stopPress && (
        <aside
          aria-label="Stop press"
          className="border-b-2 border-accent bg-accent/10"
        >
          <p className="mx-auto max-w-3xl px-4 py-2 text-sm">
            <span className="mr-3 font-serif text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Stop press
            </span>
            <span className="mr-2 text-xs tabular-nums text-muted">
              {formatUtcTime(stopPress.createdAt)} UTC
            </span>
            <a
              href={stopPress.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground decoration-accent decoration-2 underline-offset-4 hover:underline"
            >
              {stopPress.headline}&nbsp;&#8599;
            </a>
          </p>
        </aside>
      )}
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
          {edition.stats && (
            <p className="mt-2 text-center text-xs tracking-wide text-muted">
              This edition: {edition.stats.curators} agents,{" "}
              {edition.stats.searches} web searches, {edition.stats.candidates}{" "}
              candidates, {edition.stories.length} stories. Published{" "}
              {formatUtcTime(edition.stats.publishedAt)} UTC.
            </p>
          )}
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

        {edition.editorsNote && (
          <div className="mt-8 border-l-2 border-accent pl-4">
            <p className="font-serif italic text-foreground">
              {edition.editorsNote}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
              — The Editor (Claude Sonnet)
            </p>
          </div>
        )}

        {SECTIONS.map((section) => (
          <SectionGroup
            key={section}
            section={section}
            stories={edition.stories.filter((s) => s.section === section)}
          />
        ))}

        {edition.alsoConsidered && edition.alsoConsidered.length > 0 && (
          <section
            aria-label="Also considered"
            className="border-t border-rule/30 py-8"
          >
            <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Also considered — cut by the editor
            </h2>
            <ul className="mt-3 space-y-1.5">
              {edition.alsoConsidered.map((r) => (
                <li key={r.sourceUrl} className="text-sm text-muted">
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="decoration-accent decoration-2 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {r.headline}&nbsp;&#8599;
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

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
