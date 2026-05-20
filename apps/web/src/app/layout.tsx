import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="alternate" hrefLang="en-us" href={process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com'} />
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}
        {adsenseId && !adsenseId.includes('XXXXXXXX') && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
