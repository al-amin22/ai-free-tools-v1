import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_TOOLS, TOOLS_BY_CATEGORY } from '@aifreetools/tool-configs';

export const metadata: Metadata = {
  title: 'AI Free Tools — 65 Free AI-Powered Tools for Legal, HR, Finance & More',
  description:
    'Access 65 free AI-powered tools for legal documents, HR forms, financial planning, business strategy, and copywriting. No signup. Instant results.',
};

const CATEGORY_META: Record<string, { label: string; icon: string; color: string }> = {
  legal: { label: 'Legal', icon: '⚖️', color: 'bg-purple-50 border-purple-200' },
  'real-estate': { label: 'Real Estate', icon: '🏠', color: 'bg-green-50 border-green-200' },
  hr: { label: 'HR & Employment', icon: '👥', color: 'bg-blue-50 border-blue-200' },
  finance: { label: 'Finance', icon: '💰', color: 'bg-yellow-50 border-yellow-200' },
  business: { label: 'Business', icon: '📊', color: 'bg-orange-50 border-orange-200' },
  copywriting: { label: 'Copywriting', icon: '✍️', color: 'bg-pink-50 border-pink-200' },
  bonus: { label: 'Bonus Tools', icon: '⭐', color: 'bg-indigo-50 border-indigo-200' },
};

export default function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            65 Free AI Tools for Your Business
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Professional legal documents, HR forms, financial tools, and more — powered by AI, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              href="#categories"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Categories
            </Link>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            {ALL_TOOLS.length} tools · No signup required · Instant results
          </p>
        </div>
      </section>

      <section id="categories" className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(TOOLS_BY_CATEGORY).map(([category, tools]) => {
            const meta = CATEGORY_META[category] ?? { label: category, icon: '🔧', color: 'bg-gray-50 border-gray-200' };
            return (
              <div key={category} className={`border rounded-xl p-6 ${meta.color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{meta.label}</h3>
                    <p className="text-sm text-gray-500">{tools.length} tools</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {tools.slice(0, 4).map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={`/tools/${tool.id}`}
                        className="text-sm text-blue-600 hover:underline block truncate"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  {tools.length > 4 && (
                    <li>
                      <Link href={`/tools?category=${category}`} className="text-sm text-gray-500 hover:text-blue-600">
                        +{tools.length - 4} more →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why AIFreeTools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { icon: '🚀', title: 'Instant Results', desc: 'AI-generated documents in seconds, not hours.' },
              { icon: '🆓', title: 'Always Free', desc: 'Core tools are permanently free. No credit card needed.' },
              { icon: '🇺🇸', title: 'US-Specific', desc: 'State-aware documents for all 50 US states.' },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
