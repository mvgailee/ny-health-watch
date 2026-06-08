'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CountyOverlay from '@/components/CountyOverlay';
import { countyData, type County } from '@/data/counties';

const CountyMap = dynamic(() => import('@/components/CountyMap'), { ssr: false });

const highAlerts = countyData.filter(c => c.threatLevel === 'high');

export default function HomePage() {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Alert strip */}
      {highAlerts.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          borderBottom: '1px solid rgba(239,68,68,0.25)',
          padding: '9px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#ef4444', flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(239,68,68,0.25)',
          }} />
          <span style={{ fontSize: '13px', color: '#f87171' }}>
            <strong style={{ fontWeight: 600 }}>Active outbreak:</strong>{' '}
            {highAlerts[0].name} County &mdash; {highAlerts[0].activeThreats[0]?.diseaseName}.{' '}
            <button
              onClick={() => setSelectedCounty(highAlerts[0])}
              style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px', padding: 0 }}
            >
              View details
            </button>
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(248,113,113,0.6)' }}>
            Jun 6, 2026
          </span>
        </div>
      )}

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CountyMap
          onCountyClick={setSelectedCounty}
          selectedFips={selectedCounty?.fips ?? null}
        />

        {/* Updated timestamp */}
        <div style={{
          position: 'absolute', top: '16px', right: '20px',
          fontSize: '11px', color: 'rgba(226,238,248,0.3)',
          background: 'rgba(6,13,22,0.6)',
          padding: '4px 10px', borderRadius: '5px',
        }}>
          Updated Jun 6, 2026
        </div>

        {/* Hint */}
        <div style={{
          position: 'absolute', bottom: '20px', right: '20px',
          fontSize: '12px', color: 'rgba(226,238,248,0.3)',
        }}>
          Click any county for details
        </div>
      </div>

      {/* County overlay */}
      {selectedCounty && (
        <CountyOverlay
          county={selectedCounty}
          onClose={() => setSelectedCounty(null)}
        />
      )}
    </div>
  );
}
