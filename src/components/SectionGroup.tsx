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
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {section}
      </h2>
      <div className="mt-2">
        {stories.map((story) => (
          <ArticleCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
