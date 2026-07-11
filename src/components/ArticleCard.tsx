import { Story } from "@/lib/types";

export default function ArticleCard({
  story,
  number,
}: {
  story: Story;
  number: number; // 1-based position within the edition (01–10)
}) {
  return (
    <article className="group grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-rule/15 py-6 transition-colors last:border-b-0 hover:bg-accent/[0.04]">
      <span
        aria-hidden="true"
        className="pt-1 font-mono text-xs text-muted transition-colors group-hover:text-accent"
      >
        {String(number).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-serif text-xl font-bold leading-snug tracking-tight text-foreground">
          <span className="sweep">{story.headline}</span>
        </h3>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-foreground/80">
          {story.summary}
        </p>
        <div className="mt-3 flex items-center gap-3 font-mono text-xs">
          <span className="uppercase tracking-wider text-muted">
            {story.sourceName}
          </span>
          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent transition-transform hover:underline hover:underline-offset-4"
          >
            READ SOURCE&nbsp;
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              &#8599;
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
