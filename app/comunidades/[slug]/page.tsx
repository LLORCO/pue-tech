import { Suspense } from "react";
import { CommunityDetail } from "@/components/CommunityDetail";
import { seedCommunities } from "@/lib/seed";

export function generateStaticParams() {
  return seedCommunities.map((c) => ({ slug: c.slug }));
}

async function Inner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CommunityDetail slug={slug} />;
}

export default function Page({ params }: PageProps<"/comunidades/[slug]">) {
  return (
    <Suspense>
      <Inner params={params} />
    </Suspense>
  );
}
