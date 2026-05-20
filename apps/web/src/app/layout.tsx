import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com'),
  title: {
    default: 'AI Free Tools — 65 Free AI-Powered Tools for Legal, HR, Finance & More',
    template: '%s | AIFreeTools',
  },
  description:
    'Free AI-powered tools for legal documents, HR forms, financial planning, business strategy, and copywriting. No signup required. Instant results.',
  keywords: ['AI tools', 'free AI', 'legal documents', 'HR tools', 'finance tools', 'business tools'],
  authors: [{ name: 'AIFreeTools' }],
  creator: 'AIFreeTools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AIFreeTools',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aifreetools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
