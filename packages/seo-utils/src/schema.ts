const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com';

export interface FAQItem {
  question: string;
  answer: string;
}

export function buildToolJsonLd(params: {
  toolName: string;
  toolId: string;
  description: string;
  category: string;
  state?: string;
  stateName?: string;
  faqs?: FAQItem[];
}): object[] {
  const { toolName, toolId, description, category, state, stateName, faqs } = params;
  const slug = state ? `/tools/${toolId}/${state.toLowerCase()}` : `/tools/${toolId}`;
  const url = `${BASE_URL}${slug}`;

  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: stateName ? `${stateName} ${toolName}` : toolName,
      description,
      url,
      applicationCategory: category,
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      provider: {
        '@type': 'Organization',
        name: 'AIFreeTools',
        url: BASE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${BASE_URL}/tools` },
        ...(stateName
          ? [{ '@type': 'ListItem', position: 3, name: toolName, item: `${BASE_URL}/tools/${toolId}` },
             { '@type': 'ListItem', position: 4, name: stateName, item: url }]
          : [{ '@type': 'ListItem', position: 3, name: toolName, item: url }]),
      ],
    },
  ];

  if (faqs && faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return schemas;
}

export function buildOrganizationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIFreeTools',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/aifreetools',
      'https://linkedin.com/company/aifreetools',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@aifreetools.com',
      contactType: 'customer support',
    },
  };
}

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}): object {
  const { title, description, path, datePublished, dateModified, authorName } = params;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}${path}`,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: authorName ?? 'AIFreeTools Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AIFreeTools',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
  };
}

export function serializeJsonLd(schemas: object | object[]): string {
  const arr = Array.isArray(schemas) ? schemas : [schemas];
  return arr
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n');
}
