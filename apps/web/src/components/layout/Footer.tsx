import Link from 'next/link';

const CATEGORY_LINKS = [
  { href: '/tools?category=legal-documents', label: 'Legal Documents' },
  { href: '/tools?category=real-estate', label: 'Real Estate' },
  { href: '/tools?category=hr-recruitment', label: 'HR & Recruitment' },
  { href: '/tools?category=finance-tax', label: 'Finance & Tax' },
  { href: '/tools?category=small-business', label: 'Small Business' },
  { href: '/tools?category=copywriting-content', label: 'Copywriting' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools', label: 'All Tools' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link href="/" className="text-white font-bold text-xl flex items-center gap-2 mb-3">
            <span>🤖</span> AI Free Tools
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            65 free AI-powered tools for US businesses and professionals. Legal documents, HR
            forms, financial calculators, and more — no signup required.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            ⚠️ AI-generated content is for informational purposes only and does not constitute
            legal, financial, or professional advice.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Tool Categories
          </h3>
          <ul className="space-y-2">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
            Company
          </h3>
          <ul className="space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-4 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <p>© {year} AI Free Tools. All rights reserved.</p>
        <p>Targeting US market — Google.com USA rankings</p>
      </div>
    </footer>
  );
}
