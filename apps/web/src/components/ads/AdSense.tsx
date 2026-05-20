'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export function AdSense({ slot, format = 'auto', responsive = true, className }: AdSenseProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId || publisherId.includes('XXXXXXXX')) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, [publisherId]);

  if (!publisherId || publisherId.includes('XXXXXXXX')) {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs py-6 ${className ?? ''}`}>
        Ad Placeholder — configure NEXT_PUBLIC_ADSENSE_ID
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

export function AdLeaderboard() {
  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      <AdSense
        slot={process.env.NEXT_PUBLIC_AD_LEADERBOARD ?? ''}
        format="horizontal"
        className="min-h-[90px]"
      />
    </div>
  );
}

export function AdRectangle({ className }: { className?: string }) {
  return (
    <AdSense
      slot={process.env.NEXT_PUBLIC_AD_RECTANGLE ?? ''}
      format="rectangle"
      className={className ?? 'min-h-[250px]'}
    />
  );
}

export function AdInArticle() {
  return (
    <div className="my-6">
      <AdSense
        slot={process.env.NEXT_PUBLIC_AD_IN_ARTICLE ?? ''}
        format="fluid"
        className="min-h-[200px]"
      />
    </div>
  );
}
