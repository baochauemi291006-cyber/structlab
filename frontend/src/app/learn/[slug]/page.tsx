import { LearnPageClient } from "@/components/LearnPageClient";

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LearnPageClient slug={slug} />;
}
