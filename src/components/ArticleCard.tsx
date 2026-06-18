import { Story } from "@/lib/types";

export default function ArticleCard({ story }: { story: Story }) {
  return (
    <article className="group border-b border-rule/15 py-5 transition-colors last:border-b-0 hover:bg-accent/[0.03]">
      <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
        {story.headline}
      </h3>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-foreground/80">
        {story.summary}
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-muted">{story.sourceName}</span>
        <a
          href={story.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline underline-offset-2 transition-colors hover:text-accent/70"
        >
          Read source ↗
        </a>
      </div>
    </article>
  );
}
