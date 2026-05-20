import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug } from '@/lib/db/articles';
import { AdInArticle } from '@/components/ads/AdSense';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return {};
    return {
      title: article.meta_title ?? article.title,
      description: article.meta_description ?? article.excerpt ?? undefined,
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title: article.meta_title ?? article.title,
        description: article.meta_description ?? article.excerpt ?? undefined,
        type: 'article',
        publishedTime: article.published_at ?? undefined,
      },
    };
  } catch {
    return {};
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  let article: Awaited<ReturnType<typeof getArticleBySlug>> = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  if (!article) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    datePublished: article.published_at ?? undefined,
    publisher: {
      '@type': 'Organization',
      name: 'AIFreeTools',
      url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          {' / '}
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          {' / '}
          <span className="text-gray-700 line-clamp-1">{article.title}</span>
        </nav>

        <header className="mb-8">
          {article.category_slug && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full uppercase tracking-wide mb-4 inline-block">
              {article.category_slug.replace(/-/g, ' ')}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{formatDate(article.published_at)}</span>
            {article.word_count && (
              <span>{Math.ceil(article.word_count / 200)} min read</span>
            )}
          </div>
        </header>

        <AdInArticle />

        <article className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-6">
            ⚠️ AI-generated content is for informational purposes only and does not constitute
            legal, financial, or professional advice.
          </p>
          <Link
            href="/tools"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Our Free AI Tools →
          </Link>
        </div>
      </div>
    </>
  );
}
