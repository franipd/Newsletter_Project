import { Story } from "@/lib/types";

export default function ArticleCard({ story }: { story: Story }) {
  return (
    <article className="border-b border-neutral-200 py-5 last:border-b-0">
      <h3 className="text-lg font-semibold leading-snug text-neutral-950">
        {story.headline}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">
        {story.summary}
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-neutral-500">{story.sourceName}</span>
        <a
          href={story.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-neutral-950 underline underline-offset-2 hover:text-neutral-600"
        >
          Read source ↗
        </a>
      </div>
    </article>
  );
}
