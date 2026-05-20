import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Target sites that are relevant for US legal/HR/finance tools
const TARGET_SITES = [
  'reddit.com/r/legaladvice',
  'reddit.com/r/smallbusiness',
  'reddit.com/r/humanresources',
  'producthunt.com',
  'capterra.com',
];

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let recorded = 0;

    for (const site of TARGET_SITES) {
      const existing = await query<{ id: string }>(
        `SELECT id FROM backlink_opportunities WHERE source_domain = $1 LIMIT 1`,
        [site]
      );

      if (existing.length === 0) {
        await query(
          `INSERT INTO backlink_opportunities (source_domain, opportunity_type, priority, status, discovered_at)
           VALUES ($1, 'mention', 'medium', 'new', NOW())`,
          [site]
        );
        recorded++;
      }
    }

    return Response.json({ success: true, recorded });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
