import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

const COMPETITORS = [
  'legalzoom.com',
  'rocket-lawyer.com',
  'docusign.com',
  'pandadoc.com',
  'lawdepot.com',
];

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Record competitor analysis snapshot — full scraping would require a separate service
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    let recorded = 0;
    for (const domain of COMPETITORS) {
      await query(
        `INSERT INTO backlink_opportunities (source_domain, opportunity_type, priority, status, notes, discovered_at)
         VALUES ($1, 'competitor', 'high', 'tracked', $2, NOW())
         ON CONFLICT (source_domain) DO UPDATE SET notes = EXCLUDED.notes`,
        [domain, `Competitor snapshot: ${month}`]
      );
      recorded++;
    }

    return Response.json({ success: true, competitors: recorded });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
