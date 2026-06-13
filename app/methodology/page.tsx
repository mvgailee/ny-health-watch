export default function MethodologyPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#e2eef8', marginBottom: '8px' }}>Methodology</h1>
      <p style={{ fontSize: '14px', color: '#8aabc4', marginBottom: '32px', lineHeight: 1.6 }}>
        How NY Health Watch collects data, calculates threat levels, and updates the site.
      </p>

      <Section title="Data sources">
        All disease activity data is sourced from publicly available government datasets. Primary sources include
        the NYS Department of Health wastewater surveillance network (updated daily for COVID-19, RSV, and influenza),
        the NYSDOH weekly respiratory surveillance report, the NYSDOH communicable disease case reporting system,
        NYSDOH arboviral surveillance (West Nile, Eastern Equine Encephalitis), and the NYSDOH Global Health
        Update weekly report. Annual communicable disease data comes from the NYSDOH Communicable Disease Annual Report.
      </Section>

      <Section title="Threat levels">
        Each county is assigned one of four threat levels: Low, Watch, Moderate, or High. These are composite
        assessments based on the highest-priority disease currently active in the county. A county is marked
        High only when there is an active confirmed outbreak. Moderate indicates one or more diseases with
        elevated activity above seasonal baseline. Watch indicates conditions that are likely to produce
        elevated activity in the near term (e.g., peak tick season in a Lyme-endemic county). Low indicates
        no diseases currently elevated above baseline.
      </Section>

      <Section title="Data freshness">
        Data freshness varies by disease. Wastewater surveillance data (COVID-19, influenza, RSV, norovirus)
        is updated daily and reflected on this site within 48 hours. Weekly surveillance reports (Lyme, West Nile,
        respiratory viruses) are updated every Friday. Annual communicable disease data is updated once per year
        and is explicitly noted as such on each relevant disease page. Each disease page states its data source
        and update frequency clearly.
      </Section>

      <Section title="Limitations">
        This site aggregates and interprets publicly available data but is not a replacement for official
        NYSDOH communications. Data completeness varies by county and disease. Some counties, particularly
        in rural upstate New York, have lower surveillance coverage. Annual case data lags current conditions
        by design. The threat level system is a simplification intended to help the public prioritize —
        it does not capture all the nuance of official epidemiological assessments. When in doubt, consult
        NYSDOH directly at health.ny.gov.
      </Section>

      <Section title="Why does annual case data only go up to 2024?">
        The NYSDOH Communicable Disease Annual Report is typically published 12–18 months after the
        end of the reporting year. The 2024 report — covering cases reported during calendar year 2024
        — was released in early 2026. The 2025 report will not be available until early-to-mid 2027.
        This lag is structural: data must be collected from hundreds of providers across the state,
        validated, deduplicated, and reviewed before publication.
        <br /><br />
        Recent federal public health funding cuts — including reductions to CDC and NIH grants that
        flow through to state health departments — have further strained the resources available for
        data collection, analysis, and publication. New York State's epidemiology workforce has seen
        budget pressure that makes timely reporting harder to sustain.
        <br /><br />
        If you believe New York State should release communicable disease data faster and more
        completely, the most effective thing you can do is{' '}
        <a
          href="https://www.nysenate.gov/find-my-senator"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7eb8f0' }}
        >
          contact your state senator
        </a>{' '}and{' '}
        <a
          href="https://nyassembly.gov/mem/search/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7eb8f0' }}
        >
          assembly member
        </a>{' '}
        and ask them to prioritize public health data infrastructure funding.
      </Section>

      <Section title="Updates">
        The site is updated at minimum weekly. During active outbreaks, relevant county and disease pages
        may be updated more frequently. The last-updated date is displayed on each county overlay and
        disease page.
      </Section>

      <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.3)', marginTop: '32px', lineHeight: 1.6 }}>
        Questions about methodology: [your email here]
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
