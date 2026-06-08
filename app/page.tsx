'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import CountyOverlay from '@/components/CountyOverlay';
import { getAllCountyThreats, getCountyThreats, getSiteMetadata } from '@/lib/data-loader';
import { type County } from '@/data/counties';

const CountyMap = dynamic(() => import('@/components/CountyMap'), { ssr: false });

export default function HomePage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  const allThreats = useMemo(() => getAllCountyThreats(), []);
  const metadata = useMemo(() => getSiteMetadata(), []);

  // Find counties with high-level alerts for the alert strip
  const severeAlerts = useMemo(() =>
    Object.entries(allThreats)
      .filter(([, t]) => t.threatLevel === 'high')
      .map(([fips, t]) => ({ fips, ...t })),
  [allThreats]);

  const selectedThreatData = selectedCounty
    ? getCountyThreats(selectedCounty.fips)
    : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Severe alert strip */}
      {severeAlerts.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          borderBottom: '1px solid rgba(239,68,68,0.25)',
          padding: '9px 24px',
          display: 'flex', alignItems: 'center', gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#ef4444', flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(239,68,68,0.25)',
          }} />
          <span style={{ fontSize: '13px', color: '#f87171' }}>
            <strong style={{ fontWeight: 600 }}>Severe alert:</strong>{' '}
            {severeAlerts[0].activeThreats[0]?.diseaseName} — see county details for more information.
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(248,113,113,0.6)' }}>
            {metadata.lastUpdated}
          </span>
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CountyMap
          onCountyClick={setSelectedCounty}
          selectedFips={selectedCounty?.fips ?? null}
        />

        <div style={{
          position: 'absolute', top: '16px', right: '20px',
          fontSize: '11px', color: 'rgba(226,238,248,0.3)',
          background: 'rgba(6,13,22,0.6)',
          padding: '4px 10px', borderRadius: '5px',
        }}>
          {metadata.lastUpdated}
        </div>

        <div style={{
          position: 'absolute', bottom: '20px', right: '20px',
          fontSize: '12px', color: 'rgba(226,238,248,0.3)',
        }}>
          Click any county for details
        </div>
      </div>

      {/* County overlay */}
      {selectedCounty && selectedThreatData && (
        <CountyOverlay
          county={selectedCounty}
          threatData={selectedThreatData}
          onClose={() => setSelectedCounty(null)}
        />
      )}
    </div>
  );
}
