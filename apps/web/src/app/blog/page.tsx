import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedArticles, countPublishedArticles } from '@/lib/db/articles';
import { AdLeaderboard } from '@/components/ads/AdSense';

export const metadata: Metadata = {
  title: 'Blog — AI Tools Guides for US Businesses',
  description:
    'Free guides and tutorials on using AI for legal documents, HR forms, financial planning, and business operations in the United States.',
  alternates: { canonical: '/blog' },
};

const PAGE_SIZE = 12;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? '1', 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let total = 0;

  try {
    [articles, total] = await Promise.all([
      getPublishedArticles(PAGE_SIZE, offset),
      countPublishedArticles(),
    ]);
  } catch {
    // DB not connected — show empty state
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools Blog</h1>
        <p className="text-gray-500 text-lg">
          Guides, tips, and templates for US businesses using AI
        </p>
      </div>

      <AdLeaderboard />

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No articles published yet.</p>
          <p className="text-gray-400 text-sm">
            Check back soon — our AI generates fresh guides daily.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group block border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="mb-3">
                  {article.category_slug && (
                    <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wide">
                      {article.category_slug.replace(/-/g, ' ')}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{article.excerpt}</p>
                )}
                <p className="text-xs text-gray-400 mt-auto">
                  {formatDate(article.published_at)}
                  {article.word_count ? ` · ${Math.ceil(article.word_count / 200)} min read` : ''}
                </p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}`}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
