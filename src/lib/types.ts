export type Section =
  | "AI/ML"
  | "Security"
  | "DevTools"
  | "Infrastructure/Cloud"
  | "Industry & Business";

export const SECTIONS: Section[] = [
  "AI/ML",
  "Security",
  "DevTools",
  "Infrastructure/Cloud",
  "Industry & Business",
];

export interface Story {
  id: string;
  section: Section;
  headline: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
}

export interface Edition {
  id: string;
  date: string; // ISO date, e.g. "2026-06-18"
  editionNumber: number;
  stories: Story[]; // exactly 10
}
