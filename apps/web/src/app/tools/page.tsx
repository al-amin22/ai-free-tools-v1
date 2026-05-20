import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_TOOLS, TOOLS_BY_CATEGORY } from '@aifreetools/tool-configs';
import type { ToolCategory } from '@aifreetools/shared-types';
import { AdLeaderboard } from '@/components/ads/AdSense';

export const metadata: Metadata = {
  title: 'All Free AI Tools — Legal, HR, Finance, Business & More',
  description:
    'Browse all 65 free AI-powered tools for US businesses and professionals. Filter by category: legal documents, HR forms, finance calculators, copywriting, and more.',
  alternates: { canonical: '/tools' },
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  'legal-documents': {
    label: 'Legal Documents',
    icon: '⚖️',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  'real-estate': {
    label: 'Real Estate',
    icon: '🏠',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200 hover:border-green-400',
  },
  'hr-recruitment': {
    label: 'HR & Recruitment',
    icon: '👥',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  'finance-tax': {
    label: 'Finance & Tax',
    icon: '💰',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
  },
  'small-business': {
    label: 'Small Business',
    icon: '📊',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  },
  'copywriting-content': {
    label: 'Copywriting',
    icon: '✍️',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200 hover:border-pink-400',
  },
  'high-intent-legal': {
    label: 'Bonus Legal Tools',
    icon: '⭐',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ToolsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = category as ToolCategory | undefined;

  const tools = activeCategory
    ? (TOOLS_BY_CATEGORY[activeCategory] ?? [])
    : ALL_TOOLS;

  const categories = Object.keys(TOOLS_BY_CATEGORY) as ToolCategory[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Free AI Tools</h1>
        <p className="text-gray-500 text-lg">
          {ALL_TOOLS.length} tools — no signup required, instant results
        </p>
      </div>

      <AdLeaderboard />

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8 mt-6">
        <Link
          href="/tools"
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          All ({ALL_TOOLS.length})
        </Link>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = TOOLS_BY_CATEGORY[cat]?.length ?? 0;
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={`/tools?category=${cat}`}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {meta?.icon} {meta?.label ?? cat} ({count})
            </Link>
          );
        })}
      </div>

      {/* Active category header */}
      {activeCategory && CATEGORY_META[activeCategory] && (
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">{CATEGORY_META[activeCategory]!.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {CATEGORY_META[activeCategory]!.label}
            </h2>
            <p className="text-sm text-gray-500">{tools.length} tools</p>
          </div>
        </div>
      )}

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => {
          const catMeta = CATEGORY_META[tool.category];
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className={`block border rounded-xl p-5 transition-all hover:shadow-md ${catMeta?.bgColor ?? 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{catMeta?.icon ?? '🔧'}</span>
                {tool.isFeatured && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{tool.tagline}</p>
            </Link>
          );
        })}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No tools found in this category.</p>
          <Link href="/tools" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            View all tools →
          </Link>
        </div>
      )}
    </div>
  );
}
