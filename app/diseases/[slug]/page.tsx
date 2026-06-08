import { getDisease, getAllDiseases, levelLabel, levelColor, type ThreatLevel } from '@/lib/data-loader';
import { diseaseRegistry } from '@/data/disease-registry';
import ThreatBadge from '@/components/ThreatBadge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return diseaseRegistry.map(d => ({ slug: d.slug }));
}

const TIER_DESCRIPTIONS = {
  A: { label: 'Real-time tracking', desc: 'Surveillance data updated from government sources daily or weekly. Threat level reflects current wastewater signal or clinical reports.' },
  B: { label: 'Annual report tracking', desc: 'Based on NYSDOH annual communicable disease report. Threat level reflects 2024 case counts compared to the 5-year baseline.' },
  C: { label: 'Zero-tolerance monitoring', desc: 'Any confirmed case in a county triggers an elevated alert. Updated manually when NYSDOH issues outbreak notifications.' },
};

const ACTION_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  vaccine:    { bg: '#1a2a1a', text: '#6ee87c', icon: '💉' },
  prevention: { bg: '#1a2236', text: '#7eb8f0', icon: '🛡' },
  treatment:  { bg: '#2a1a1a', text: '#f08080', icon: '⚕️' },
  monitor:    { bg: '#2a241a', text: '#f0c070', icon: '👁' },
};

const LEVEL_BADGE_STYLE: Record<ThreatLevel, { bg: string; text: string }> = {
  low:      { bg: '#0f2a1a', text: '#27e66e' },
  watch:    { bg: '#2a2310', text: '#ffde00' },
  moderate: { bg: '#2a1c10', text: '#ff8c00' },
  high:     { bg: '#2a1010', text: '#ff4141' },
};

export default function DiseasePage({ params }: { params: { slug: string } }) {
  const disease = getDisease(params.slug);
  if (!disease) notFound();

  const { content, activity, tier, name, categories, vaccineAvailable, seasonality } = disease;
  const tierMeta = TIER_DESCRIPTIONS[tier];
  const badgeStyle = LEVEL_BADGE_STYLE[activity.level];
  const trendArrow = { rising: '↑', stable: '→', declining: '↓' }[activity.trend];
  const trendColor = { rising: '#f87171', stable: '#8a9bb0', declining: '#4ade80' }[activity.trend];

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Back nav */}
      <Link href="/diseases" style={{ color: '#4a6080', fontSize: '0.82rem', textDecoration: 'none', display: 'block', marginBottom: '1.25rem' }}>
        ← All diseases
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#e8eaf0', margin: 0 }}>
            {name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <ThreatBadge level={activity.level} />
            <span style={{ color: trendColor, fontSize: '0.9rem', fontWeight: 700 }}>
              {trendArrow} {activity.trend}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
          {categories.map(c => (
            <span key={c} style={{ fontSize: '0.75rem', background: '#1a2236', color: '#6a8aaa', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              {c}
            </span>
          ))}
          {vaccineAvailable && (
            <span style={{ fontSize: '0.75rem', background: '#1a2a1a', color: '#6ee87c', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
              Vaccine available
            </span>
          )}
        </div>
      </div>

      {/* Current status banner */}
      <div style={{ background: badgeStyle.bg, border: `1px solid ${levelColor(activity.level)}40`, borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#6a8aaa', marginBottom: '0.35rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Current NYS Status
        </div>
        <p style={{ margin: 0, color: '#c8d4e8', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {activity.note}
        </p>
        {activity.annualCases2024 !== undefined && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#6a8aaa' }}>
            2024 statewide cases: <strong style={{ color: '#8aabcc' }}>{activity.annualCases2024.toLocaleString()}</strong>
          </div>
        )}
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#4a6080' }}>
          Source: {activity.dataSourceLabel}
        </div>
      </div>

      {content ? (
        <>
          {/* What is it */}
          <Section title="What is it?">
            <p style={{ color: '#b0bcd0', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>{content.whatIsIt}</p>
          </Section>

          {/* How it spreads */}
          <Section title="How it spreads">
            <p style={{ color: '#b0bcd0', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>{content.howItSpreads}</p>
          </Section>

          {/* Symptoms */}
          <Section title="Symptoms">
            <p style={{ color: '#b0bcd0', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>{content.symptoms}</p>
          </Section>

          {/* Who is at risk */}
          <Section title="Who is at risk?">
            <p style={{ color: '#b0bcd0', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>{content.whoIsAtRisk}</p>
          </Section>

          {/* Action items */}
          {content.actionItems.length > 0 && (
            <Section title="What you can do">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {content.actionItems.map((item, i) => {
                  const style = ACTION_COLORS[item.type] ?? ACTION_COLORS.prevention;
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                      background: style.bg, borderRadius: 8, padding: '0.65rem 0.75rem',
                    }}>
                      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{style.icon}</span>
                      <span style={{ color: style.text, fontSize: '0.87rem', lineHeight: 1.45 }}>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Vaccine info */}
          {content.vaccineInfo && (
            <Section title="Vaccine information">
              <p style={{ color: '#b0bcd0', lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>{content.vaccineInfo}</p>
            </Section>
          )}
        </>
      ) : (
        /* No detail page yet */
        <div style={{ background: '#0f1a2e', border: '1px solid #1e2f45', borderRadius: 10, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#6a8aaa', fontSize: '0.9rem', margin: 0 }}>
            Detailed disease information for {name} is being added. Current NYS status and case data are shown above.
          </p>
          <p style={{ color: '#4a6080', fontSize: '0.82rem', marginTop: '0.75rem', marginBottom: 0 }}>
            For clinical information, visit the{' '}
            <a href="https://www.health.ny.gov/diseases/communicable/" target="_blank" rel="noopener noreferrer" style={{ color: '#6a9acc' }}>
              NYSDOH communicable disease page
            </a>.
          </p>
        </div>
      )}

      {/* Data tier info */}
      <div style={{ background: '#0a111e', border: '1px solid #1a2840', borderRadius: 8, padding: '0.9rem 1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.73rem', color: '#4a6080', marginBottom: '0.3rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tier {tier} — {tierMeta.label}
        </div>
        <p style={{ color: '#4a6080', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
          {tierMeta.desc}
        </p>
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#3a5070' }}>
          Seasonality: {seasonality.replace('-', ' ')}
        </div>
      </div>

      <p style={{ color: '#3a5060', fontSize: '0.78rem' }}>
        This information is for general public health awareness and is not a substitute for professional medical advice, diagnosis, or treatment.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6a8aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
