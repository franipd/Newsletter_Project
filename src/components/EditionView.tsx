import Link from "next/link";
import { Edition, SECTIONS, StopPressItem } from "@/lib/types";
import { EditionSummary } from "@/lib/get-editions";
import SectionNav from "@/components/SectionNav";
import SectionGroup from "@/components/SectionGroup";
import AgentWire from "@/components/AgentWire";
import Marquee from "@/components/Marquee";
import ReadingProgress from "@/components/ReadingProgress";

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

function formatUtcTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
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

  // Running story numbers (01–10) across sections
  const grouped = SECTIONS.map((section, index) => ({
    section,
    index,
    stories: edition.stories.filter((s) => s.section === section),
  }));
  const groups = grouped.map((g, i) => ({
    ...g,
    startNumber:
      grouped.slice(0, i).reduce((n, x) => n + x.stories.length, 0) + 1,
  }));

  return (
    <>
      <ReadingProgress />

      {stopPress && (
        <aside
          aria-label="Stop press"
          className="anim-slide-down border-b-2 border-accent bg-accent/10"
        >
          <p className="mx-auto max-w-3xl px-4 py-2 text-sm">
            <span className="wire-dot mr-2 align-middle" aria-hidden="true" />
            <span className="mr-3 font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
              Stop press
            </span>
            <span className="mr-2 font-mono text-xs tabular-nums text-muted">
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

      {/* Ink masthead band */}
      <header className="anim-fade-up bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-12">
          <div className="flex items-baseline justify-between border-b border-background/20 pb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-background/60">
            <span>Edition №&nbsp;{edition.editionNumber}</span>
            <span className="tabular-nums">{formatDate(edition.date)}</span>
          </div>
          <h1 className="mt-8 text-center font-serif text-[clamp(3.5rem,10vw,7rem)] font-extrabold leading-[0.95] tracking-tight">
            The Daily
            <br />
            Stack
          </h1>
          <p className="mt-5 text-center font-serif text-base italic text-background/70">
            10 stories, five sections, no scrolling past the end.
          </p>
          {edition.stats && (
            <AgentWire
              text={`WIRE // ${edition.stats.curators} AGENTS · ${edition.stats.searches} WEB SEARCHES · ${edition.stats.candidates} CANDIDATES · ${edition.stories.length} PUBLISHED · ${formatUtcTime(edition.stats.publishedAt)} UTC`}
              className="mt-6 text-center font-mono text-[11px] tracking-[0.15em] text-background/60"
            />
          )}
        </div>
      </header>

      <Marquee
        text={`Edition №${edition.editionNumber} wire +++ ${edition.stories
          .map((s) => s.headline)
          .join(" +++ ")} +++`}
      />

      <SectionNav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4">
        {recent.length > 1 && (
          <nav
            aria-label="Past editions"
            className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted"
          >
            <span className="mr-4">Editions</span>
            {recent.map((s) => {
              const label = formatShortDate(s.date);
              if (s.date === edition.date) {
                return (
                  <span
                    key={s.date}
                    className="mr-4 border-b-2 border-accent pb-0.5 text-foreground"
                  >
                    {label}
                  </span>
                );
              }
              return (
                <Link
                  key={s.date}
                  href={s.date === latestDate ? "/" : `/edition/${s.date}`}
                  className="mr-4 transition-colors hover:text-foreground"
                >
                  <span className="sweep">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {edition.editorsNote && (
          <div className="anim-fade-up anim-delay-1 mt-10 border-l-2 border-accent pl-5">
            <p className="font-serif text-lg italic leading-relaxed text-foreground">
              {edition.editorsNote}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              — The Editor
            </p>
          </div>
        )}

        <div className="anim-fade-up anim-delay-2">
          {groups.map(({ section, stories, index, startNumber }) => (
            <SectionGroup
              key={section}
              section={section}
              stories={stories}
              index={index}
              startNumber={startNumber}
            />
          ))}
        </div>

        {edition.alsoConsidered && edition.alsoConsidered.length > 0 && (
          <section
            aria-label="Also considered"
            className="border-t border-rule/30 py-8"
          >
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-muted">
              Also considered — cut by the editor
            </h2>
            <ul className="mt-4 space-y-2">
              {edition.alsoConsidered.map((r) => (
                <li key={r.sourceUrl} className="text-sm text-muted">
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    <span className="sweep">{r.headline}</span>&nbsp;&#8599;
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="border-t-2 border-rule py-12 text-center">
          <p className="font-serif text-2xl font-bold italic text-foreground">
            {isLatest
              ? "That’s today’s edition."
              : `That’s the edition for ${formatDate(edition.date)}.`}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            {isLatest ? (
              "Now go make tomorrow’s headlines."
            ) : (
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                <span className="sweep">Read today&rsquo;s edition</span>{" "}
                &rarr;
              </Link>
            )}
          </p>
          <p className="mt-6">
            <Link
              href="/press"
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 transition-colors hover:text-foreground"
            >
              Press room
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}
