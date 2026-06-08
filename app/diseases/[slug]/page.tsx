import { notFound } from 'next/navigation';
import Link from 'next/link';
import { diseases } from '@/data/diseases';
import ThreatBadge from '@/components/ThreatBadge';

export async function generateStaticParams() {
  return diseases.map(d => ({ slug: d.slug }));
}

interface Props {
  params: { slug: string };
}

const ACTION_ICONS: Record<string, string> = {
  vaccine:    'Vaccine',
  prevention: 'Prevent',
  treatment:  'Treat',
  monitor:    'Monitor',
};

const ACTION_COLORS: Record<string, string> = {
  vaccine:    '#3b9eff',
  prevention: '#22c98a',
  treatment:  '#f5a623',
  monitor:    '#8aabc4',
};

const TREND_LABEL: Record<string, string> = {
  rising:    '↗ Rising',
  stable:    '→ Stable',
  declining: '↘ Declining',
};

const TREND_COLOR: Record<string, string> = {
  rising:    '#f5a623',
  stable:    '#8aabc4',
  declining: '#22c98a',
};

export default function DiseasePage({ params }: Props) {
  const disease = diseases.find(d => d.slug === params.slug);
  if (!disease) notFound();

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>

      <Link href="/diseases" style={{ fontSize: '13px', color: '#8aabc4', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
        ← All diseases
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: '#e2eef8' }}>{disease.name}</h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '6px' }}>
            <ThreatBadge level={disease.currentThreatLevel} size="md" />
            <span style={{ fontSize: '13px', color: TREND_COLOR[disease.nysTrend], padding: '4px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {TREND_LABEL[disease.nysTrend]}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {disease.categories.map(cat => (
            <span key={cat} style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', color: 'rgba(226,238,248,0.5)', border: '1px solid rgba(255,255,255,0.09)' }}>{cat}</span>
          ))}
        </div>
        <p style={{ fontSize: '15px', color: '#8aabc4', lineHeight: 1.6 }}>{disease.shortDescription}</p>
      </div>

      {/* Current NYS Status */}
      <div style={{ background: '#111d2b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px 22px', marginBottom: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(226,238,248,0.35)', marginBottom: '10px' }}>
          Current NYS status
        </p>
        <p style={{ fontSize: '14px', color: '#c8dff0', lineHeight: 1.7 }}>{disease.currentNYSStatus}</p>
        <p style={{ fontSize: '11px', color: 'rgba(226,238,248,0.3)', marginTop: '12px' }}>
          Source: {disease.dataSourceLabel}
        </p>
      </div>

      {/* Action items */}
      <div style={{ background: 'rgba(39,230,110,0.08)', border: '1px solid rgba(39,230,110,0.28)', borderRadius: '12px', padding: '20px 22px', marginBottom: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(39,230,110,0.8)', marginBottom: '12px' }}>
          Recommended actions
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {disease.actionItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0, fontSize: '11px', fontWeight: 600,
                padding: '2px 7px', borderRadius: '4px',
                background: `${ACTION_COLORS[item.type]}22`,
                color: ACTION_COLORS[item.type],
                border: `1px solid ${ACTION_COLORS[item.type]}44`,
                marginTop: '2px',
              }}>
                {ACTION_ICONS[item.type]}
              </span>
              <span style={{ fontSize: '14px', color: '#c8dff0', lineHeight: 1.55 }}>{item.text}</span>
            </div>
          ))}
        </div>
        {disease.vaccineAvailable && disease.vaccineInfo && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(39,230,110,0.2)' }}>
            <p style={{ fontSize: '12px', color: '#27e66e', fontWeight: 500, marginBottom: '4px' }}>Vaccine available</p>
            <p style={{ fontSize: '13px', color: '#8aabc4', lineHeight: 1.6 }}>{disease.vaccineInfo}</p>
          </div>
        )}
      </div>

      {/* Info sections */}
      {([
        { label: 'What is it?',         text: disease.whatIsIt },
        { label: 'How does it spread?', text: disease.howItSpreads },
        { label: 'Symptoms',            text: disease.symptoms },
        { label: 'Who is at risk?',     text: disease.whoIsAtRisk },
      ] as const).map(({ label, text }) => (
        <div key={label} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e2eef8', marginBottom: '8px' }}>{label}</h2>
          <p style={{ fontSize: '14px', color: '#8aabc4', lineHeight: 1.7 }}>{text}</p>
        </div>
      ))}

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '12px', lineHeight: 1.6 }}>
        This page is for informational purposes only and does not constitute medical advice.
        Consult a healthcare provider before making any health decisions.
        Last updated: {disease.lastUpdated}.
      </p>
    </div>
  );
}
