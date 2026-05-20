export type SEOPageType =
  | 'tool'
  | 'state'
  | 'longtail'
  | 'article'
  | 'comparison'
  | 'glossary'
  | 'faq_page'
  | 'category';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  robots: string;
  keywords?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface SEOPage {
  id: string;
  pageType: SEOPageType;
  slug: string;
  urlPath: string;
  toolId?: string;
  toolSlug?: string;
  stateCode?: string;
  stateName?: string;
  title: string;
  metaDescription: string;
  h1: string;
  content?: string;
  wordCount?: number;
  schemaMarkup?: SchemaMarkup[];
  faqs?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  relatedTools?: string[];
  internalLinks?: InternalLink[];
  isPublished: boolean;
  qualityScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InternalLink {
  targetSlug: string;
  targetPath: string;
  anchorText: string;
  context?: string;
  position: 'body' | 'related' | 'faq' | 'sidebar';
}

// JSON-LD Schema types
export type SchemaMarkup =
  | SoftwareApplicationSchema
  | FAQPageSchema
  | BreadcrumbListSchema
  | ArticleSchema
  | OrganizationSchema
  | HowToSchema;

export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: { '@type': 'Offer'; price: string; priceCurrency: string };
  description?: string;
  url?: string;
}

export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: { '@type': 'Answer'; text: string };
  }>;
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  author: { '@type': string; name: string };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: string;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

export interface HowToSchema {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
  }>;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}
