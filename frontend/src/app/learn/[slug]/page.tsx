import { LearnPageClient } from "@/components/LearnPageClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["array", "stack", "queue"].map((slug) => ({ slug }));
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LearnPageClient slug={slug} />;
}
