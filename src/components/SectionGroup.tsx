import { Story } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import { toAnchorId } from "@/components/SectionNav";

export default function SectionGroup({
  section,
  stories,
}: {
  section: string;
  stories: Story[];
}) {
  if (stories.length === 0) return null;

  return (
    <section id={toAnchorId(section)} className="scroll-mt-16 py-8">
      <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
        <span aria-hidden className="h-4 w-1.5 bg-accent" />
        {section}
      </h2>
      <div className="mt-3">
        {stories.map((story) => (
          <ArticleCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
