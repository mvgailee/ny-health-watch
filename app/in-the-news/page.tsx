import { newsDiseases } from '@/data/news';

const RISK_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  minimal:  { bg: 'rgba(34,201,138,0.1)',  color: '#22c98a', border: 'rgba(34,201,138,0.25)' },
  low:      { bg: 'rgba(59,158,255,0.1)',  color: '#3b9eff', border: 'rgba(59,158,255,0.25)' },
  moderate: { bg: 'rgba(245,166,35,0.1)',  color: '#f5a623', border: 'rgba(245,166,35,0.25)' },
};

export default function InTheNewsPage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2eef8', marginBottom: '8px' }}>
        In the news
      </h1>
      <p style={{ fontSize: '14px', color: '#8aabc4', lineHeight: 1.7, marginBottom: '32px', maxWidth: '620px' }}>
        These diseases are receiving significant media attention right now. Here is what is actually
        happening, and what it means — or doesn’t mean — for New York State residents.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {newsDiseases.map(nd => {
          const rs = RISK_STYLE[nd.nysRiskLevel];
          return (
            <div
              key={nd.slug}
              style={{
                background: '#111d2b',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#e2eef8', marginBottom: '4px' }}>
                    {nd.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.4)' }}>
                    Currently: {nd.region}
                  </p>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 500,
                  padding: '3px 12px', borderRadius: '999px',
                  background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`,
                  whiteSpace: 'nowrap',
                }}>
                  {nd.nysRiskLabel}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(226,238,248,0.3)', marginBottom: '6px' }}>
                    Why is it in the news?
                  </p>
                  <p style={{ fontSize: '13px', color: '#8aabc4', lineHeight: 1.65 }}>{nd.mediaFear}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(61,184,138,0.7)', marginBottom: '6px' }}>
                    The NYS reality
                  </p>
                  <p style={{ fontSize: '13px', color: '#c8dff0', lineHeight: 1.65 }}>{nd.nysReality}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px 16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(226,238,248,0.3)', marginBottom: '6px' }}>
                    What you should know
                  </p>
                  <p style={{ fontSize: '13px', color: '#8aabc4', lineHeight: 1.65 }}>{nd.whatToKnow}</p>
                </div>

                <p style={{ fontSize: '11px', color: 'rgba(226,238,248,0.25)', marginTop: '-4px' }}>
                  Sources: {nd.sources.join(', ')} — Updated {nd.lastUpdated}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '32px', lineHeight: 1.6 }}>
        This page is updated as new diseases enter the news cycle. Risk assessments reflect current
        NYSDOH and CDC guidance. This page does not constitute medical advice.
      </p>
    </div>
  );
}
