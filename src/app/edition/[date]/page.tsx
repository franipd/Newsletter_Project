import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getEditionByDate,
  getRecentEditionSummaries,
} from "@/lib/get-editions";
import EditionView from "@/components/EditionView";

// Past editions are immutable once published, but revalidate anyway so
// corrections made in Supabase show up without a redeploy.
export const revalidate = 300;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  return { title: `The Daily Stack — ${date}` };
}

export default async function EditionByDate({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!ISO_DATE.test(date)) {
    notFound();
  }

  const [edition, recent] = await Promise.all([
    getEditionByDate(date),
    getRecentEditionSummaries(),
  ]);

  if (!edition) {
    notFound();
  }

  return <EditionView edition={edition} recent={recent} />;
}
