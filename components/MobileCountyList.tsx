'use client';

import { useMemo } from 'react';
import { type County } from '@/data/counties';
import { type CountyThreatData } from '@/lib/data-loader';

interface Props {
  allThreats: Record<string, CountyThreatData>;
  allCounties: County[];
  onCountySelect: (county: County) => void;
}

const LEVEL_CONFIG = {
  high:     { label: 'High',     bg: 'rgba(158,32,32,0.15)',  border: 'rgba(158,32,32,0.4)',  dot: '#ef4444', text: '#fca5a5' },
  moderate: { label: 'Moderate', bg: 'rgba(158,82,0,0.15)',   border: 'rgba(158,82,0,0.4)',   dot: '#f97316', text: '#fdba74' },
  watch:    { label: 'Watch',    bg: 'rgba(138,126,0,0.15)',  border: 'rgba(138,126,0,0.4)',  dot: '#eab308', text: '#fde047' },
  low:      { label: 'Clear',    bg: 'rgba(30,145,80,0.08)',  border: 'rgba(30,145,80,0.2)',  dot: '#22c55e', text: '#86efac' },
} as const;

const LEVEL_ORDER = ['high', 'moderate', 'watch', 'low'] as const;

export default function MobileCountyList({ allThreats, allCounties, onCountySelect }: Props) {
  const countiesByLevel = useMemo(() => {
    const groups: Record<string, Array<{ county: County; threat: CountyThreatData }>> = {
      high: [], moderate: [], watch: [], low: [],
    };

    for (const county of allCounties) {
      const threat = allThreats[county.fips];
      if (!threat) continue;
      const level = threat.threatLevel ?? 'low';
      groups[level]?.push({ county, threat });
    }

    // Sort alphabetically within each level
    for (const level of LEVEL_ORDER) {
      groups[level].sort((a, b) => a.county.name.localeCompare(b.county.name));
    }

    return groups;
  }, [allThreats, allCounties]);

  const nonEmptyLevels = LEVEL_ORDER.filter(l => countiesByLevel[l].length > 0);

  return (
    <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize: 12, color: '#4a6080', margin: 0 }}>
          Tap any county to see active threats and disease details
        </p>
      </div>

      {nonEmptyLevels.map(level => {
        const config = LEVEL_CONFIG[level];
        const counties = countiesByLevel[level];

        return (
          <div key={level} style={{ marginBottom: 20 }}>

            {/* Level header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: config.dot, flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: config.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {config.label}
              </span>
              <span style={{ fontSize: 11, color: '#3a5060', marginLeft: 2 }}>
                ({counties.length} {counties.length === 1 ? 'county' : 'counties'})
              </span>
            </div>

            {/* County cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {counties.map(({ county, threat }) => {
                const topThreats = threat.activeThreats?.slice(0, 2) ?? [];

                return (
                  <button
                    key={county.fips}
                    onClick={() => onCountySelect(county)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: config.bg,
                      border: `1px solid ${config.border}`,
                      borderRadius: 8,
                      padding: '10px 14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#c8d4e8', marginBottom: 2 }}>
                        {county.name}
                      </div>
                      {topThreats.length > 0 ? (
                        <div style={{ fontSize: 11, color: '#6a8aaa' }}>
                          {topThreats.map(t => t.diseaseName).join(' · ')}
                          {(threat.activeThreats?.length ?? 0) > 2 && (
                            <span style={{ color: '#4a6080' }}>
                              {' '}+{(threat.activeThreats?.length ?? 0) - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: '#3a5060' }}>No active threats</div>
                      )}
                    </div>
                    <span style={{ fontSize: 16, color: '#3a5070', flexShrink: 0, marginLeft: 8 }}>›</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
