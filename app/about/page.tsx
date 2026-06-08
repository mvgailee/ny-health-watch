export default function AboutPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2eef8', marginBottom: '28px' }}>About</h1>

      <Section title="What is NY Health Watch?">
        NY Health Watch is an independent public health information site focused on New York State.
        It tracks infectious disease activity across all 62 NYS counties, explains what is
        currently circulating, and provides clear, evidence-based guidance on what to do about it.
        The goal is to make public health data accessible and actionable for ordinary New Yorkers
        — without sensationalism, without unnecessary alarm, and without the opacity of most
        government health portals.
      </Section>

      <Section title="Who built this?">
        NY Health Watch was built by Michael Gaile, a computer science student at Cornell University.
        This is an independent project, not affiliated with NYSDOH, CDC, or any government agency.
        All data sourced from public government datasets.
      </Section>

      <Section title="Why does this exist?">
        Federal public health data infrastructure has faced significant budget cuts and access
        restrictions in recent years. At the same time, public health information is often spread
        across poorly-designed government portals, scattered PDF reports, and media coverage that
        tends toward either alarm or dismissal. NY Health Watch is an attempt to fill that gap —
        a clean, honest, regularly updated resource for New Yorkers who want to understand what is
        actually happening with infectious disease in their communities.
      </Section>

      <Section title="Contact">
        Questions, corrections, or feedback: mvgaileee@gmail.com. If you are from the NYDOH, CDC, 
        or other health department please reach out. I would love to chat about further data integration.
      </Section>

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '32px', lineHeight: 1.6 }}>
        NY Health Watch is an independent site. It does not represent NYSDOH, CDC, or any government entity.
        See the <a href="/disclaimers" style={{ color: 'rgba(61,184,138,0.7)' }}>Disclaimers</a> and{' '}
        <a href="/methodology" style={{ color: 'rgba(61,184,138,0.7)' }}>Methodology</a> pages for more.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#e2eef8', marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontSize: '14px', color: '#8aabc4', lineHeight: 1.75 }}>{children}</p>
    </div>
  );
}
