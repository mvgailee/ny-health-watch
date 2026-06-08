export default function DisclaimersPage() {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2eef8', marginBottom: '8px' }}>Disclaimers</h1>
      <p style={{ fontSize: '14px', color: '#8aabc4', marginBottom: '32px' }}>Last updated: June 6, 2026</p>

      <Section title="Not medical advice">
        The content on NY Health Watch is intended for general informational purposes only. It is not a
        substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your
        physician or other qualified health provider with any questions you may have regarding a medical
        condition. Never disregard professional medical advice or delay in seeking it because of something
        you read on this site. If you think you may have a medical emergency, call your doctor or 911 immediately.
      </Section>

      <Section title="Not affiliated with government">
        NY Health Watch is an independent project and is not affiliated with, endorsed by, or operated
        by the New York State Department of Health, the Centers for Disease Control and Prevention, or any
        other government agency. Official public health guidance should be obtained directly from NYSDOH at
        health.ny.gov or the CDC at cdc.gov.
      </Section>

      <Section title="Data accuracy">
        While every effort is made to ensure the information on this site is accurate and up to date, NY Health
        Watch makes no representations or warranties of any kind, express or implied, about the completeness,
        accuracy, reliability, or suitability of the information. Data is sourced from publicly available
        government datasets that may contain errors, delays, or gaps. Disease activity can change rapidly;
        always verify current conditions directly with NYSDOH at health.ny.gov.
      </Section>

      <Section title="No liability">
        NY Health Watch and its operator accept no liability for decisions made based on information
        presented on this site. Use of this site is at your own risk. If you are experiencing a medical
        emergency, call 911 or contact your healthcare provider immediately.
      </Section>

      <Section title="External links">
        This site may link to external websites for additional information. NY Health Watch is not
        responsible for the content, accuracy, or privacy practices of external sites.
      </Section>

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '32px', lineHeight: 1.6 }}>
        For questions about these disclaimers, contact: [your email here]
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '26px', paddingBottom: '26px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#e2eef8', marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontSize: '14px', color: '#8aabc4', lineHeight: 1.75 }}>{children}</p>
    </div>
  );
}
