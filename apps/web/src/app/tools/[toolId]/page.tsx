import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolById, ALL_TOOLS } from '@aifreetools/tool-configs';
import { buildToolMeta, buildToolJsonLd } from '@aifreetools/seo-utils';
import { ToolPageClient } from '@/components/tool/ToolPageClient';

interface Props {
  params: Promise<{ toolId: string }>;
}

export async function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({ toolId: tool.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) return {};

  const meta = buildToolMeta({
    toolName: tool.name,
    toolId: tool.id,
    description: tool.description,
    category: tool.category,
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.ogUrl,
      images: [{ url: meta.ogImage }],
    },
    twitter: {
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: [meta.twitterImage],
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool) notFound();

  const schemas = buildToolJsonLd({
    toolName: tool.name,
    toolId: tool.id,
    description: tool.description,
    category: tool.category,
    faqs: tool.seoConfig.faqs?.map((f) => ({ question: f.question, answer: f.answer })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ToolPageClient tool={tool} />
    </>
  );
}
