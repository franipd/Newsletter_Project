import type { Metadata } from "next";
import Link from "next/link";
import PressControls from "@/components/PressControls";

export const metadata: Metadata = {
  title: "The Daily Stack — Press Room",
};

export default function PressRoom() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4">
      <header className="anim-fade-up border-b-4 border-rule pb-6 pt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          The Daily Stack
        </p>
        <h1 className="mt-4 font-serif text-5xl font-extrabold tracking-tight text-foreground">
          Press Room
        </h1>
        <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-muted">
          The control desk for the agents that print this paper. Stopping the
          presses pauses the 06:00 UTC daily edition and the 2-hourly
          stop-press desk — the site stays up, serving the last edition.
        </p>
      </header>

      <PressControls />

      <p className="mt-10 pb-16">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-foreground"
        >
          &larr; Back to today&rsquo;s edition
        </Link>
      </p>
    </main>
  );
}
