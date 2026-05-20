import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolById, ALL_TOOLS, US_STATES } from '@aifreetools/tool-configs';
import { buildToolMeta, buildToolJsonLd } from '@aifreetools/seo-utils';
import { ToolPageClient } from '@/components/tool/ToolPageClient';

interface Props {
  params: Promise<{ toolId: string; stateCode: string }>;
}

export async function generateStaticParams() {
  return ALL_TOOLS.flatMap((tool) =>
    US_STATES.map((state) => ({
      toolId: tool.id,
      stateCode: state.value.toLowerCase(),
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId, stateCode } = await params;
  const tool = getToolById(toolId);
  const state = US_STATES.find((s) => s.value.toLowerCase() === stateCode.toLowerCase());
  if (!tool || !state) return {};

  const meta = buildToolMeta({
    toolName: tool.name,
    toolId: tool.id,
    description: tool.description,
    category: tool.category,
    state: state.value,
    stateName: state.label,
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
  };
}

export const dynamicParams = false;

export default async function ToolStatePage({ params }: Props) {
  const { toolId, stateCode } = await params;
  const tool = getToolById(toolId);
  const state = US_STATES.find((s) => s.value.toLowerCase() === stateCode.toLowerCase());
  if (!tool || !state) notFound();

  const schemas = buildToolJsonLd({
    toolName: tool.name,
    toolId: tool.id,
    description: tool.description,
    category: tool.category,
    state: state.value,
    stateName: state.label,
    faqs: tool.seoConfig.faqs?.map((f) => ({ question: f.question, answer: f.answer })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <ToolPageClient tool={tool} state={state} />
    </>
  );
}
