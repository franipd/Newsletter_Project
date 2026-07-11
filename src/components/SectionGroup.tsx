import { Story } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import { toAnchorId } from "@/components/SectionNav";

export default function SectionGroup({
  section,
  stories,
  index,
  startNumber,
}: {
  section: string;
  stories: Story[];
  index: number; // 0-based section position, rendered as the ghost numeral
  startNumber: number; // 1-based number of this section's first story
}) {
  if (stories.length === 0) return null;

  return (
    <section
      id={toAnchorId(section)}
      className="relative scroll-mt-16 py-10"
    >
      <span aria-hidden="true" className="ghost-numeral">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex items-baseline gap-3 border-b-2 border-rule pb-2">
        <span className="font-mono text-xs text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          {section}
        </h2>
      </div>
      <div className="mt-2">
        {stories.map((story, i) => (
          <ArticleCard
            key={story.id}
            story={story}
            number={startNumber + i}
          />
        ))}
      </div>
    </section>
  );
}
