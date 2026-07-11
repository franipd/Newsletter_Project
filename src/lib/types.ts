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

export interface EditionStats {
  curators: number;
  searches: number;
  candidates: number;
  publishedAt: string; // ISO timestamp
}

export interface RejectedStory {
  headline: string;
  sourceUrl: string;
}

export interface StopPressItem {
  headline: string;
  sourceUrl: string;
  createdAt: string; // ISO timestamp
}

export interface Edition {
  id: string;
  date: string; // ISO date, e.g. "2026-06-18"
  editionNumber: number;
  stories: Story[]; // exactly 10
  // Liveness metadata — present only on agent-published editions
  stats?: EditionStats | null;
  editorsNote?: string | null;
  alsoConsidered?: RejectedStory[] | null;
}
