import Link from 'next/link';
import { diseases } from '@/data/diseases';
import ThreatBadge from '@/components/ThreatBadge';

const TREND_LABEL: Record<string, string> = {
  rising: '↗ Rising',
  stable: '→ Stable',
  declining: '↘ Declining',
};

const TREND_COLOR: Record<string, string> = {
  rising: '#f5a623',
  stable: '#8aabc4',
  declining: '#22c98a',
};

const SOURCE_LABEL: Record<string, string> = {
  realtime: 'Real-time',
  weekly: 'Weekly',
  annual: 'Annual',
};

export default function DiseasesPage() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2eef8', marginBottom: '8px' }}>
        All tracked diseases
      </h1>
      <p style={{ fontSize: '14px', color: '#8aabc4', marginBottom: '32px', lineHeight: 1.6 }}>
        Infectious diseases currently monitored in New York State. Activity levels and trends are sourced
        from NYSDOH surveillance data. Click any disease for full details, current status, and recommended actions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {diseases.map(disease => (
          <Link
            key={disease.slug}
            href={`/diseases/${disease.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: '#111d2b',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'border-color 0.15s',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#e2eef8' }}>{disease.name}</span>
                  {disease.categories.map(cat => (
                    <span key={cat} style={{
                      fontSize: '11px',
                      padding: '1px 8px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(226,238,248,0.45)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>{cat}</span>
                  ))}
                </div>
                <p style={{ fontSize: '13px', color: '#8aabc4', margin: 0 }}>{disease.shortDescription}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <ThreatBadge level={disease.currentThreatLevel} size="sm" />
                <span style={{ fontSize: '12px', color: TREND_COLOR[disease.nysTrend] }}>
                  {TREND_LABEL[disease.nysTrend]}
                </span>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '72px' }}>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(61,184,138,0.08)',
                  color: 'rgba(61,184,138,0.7)',
                  border: '1px solid rgba(61,184,138,0.15)',
                }}>
                  {SOURCE_LABEL[disease.dataSource]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '28px' }}>
        Data freshness varies by disease. See individual disease pages for source details.
        This site does not provide medical advice.
      </p>
    </div>
  );
}
