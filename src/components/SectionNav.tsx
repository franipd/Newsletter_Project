import { SECTIONS } from "@/lib/types";

function toAnchorId(section: string): string {
  return section.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function SectionNav() {
  return (
    <nav
      aria-label="Sections"
      className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-4 py-3 text-sm font-medium">
        {SECTIONS.map((section) => (
          <li key={section}>
            <a
              href={`#${toAnchorId(section)}`}
              className="text-neutral-600 transition-colors hover:text-neutral-950"
            >
              {section}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { toAnchorId };
