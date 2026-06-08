import Link from 'next/link';
import metadataRaw from '@/data/pipeline/metadata.json';

const metadata = metadataRaw as { sitewideNote?: string };

const DATASETS = [
  {
    filename: 'wastewater_by_county_latest.csv',
    title: 'Wastewater — Latest by County',
    description: 'Most recent wastewater surveillance reading per county per pathogen. One row per county per pathogen (COVID-19, Influenza A, RSV).',
    fields: [
      { name: 'county_fips', desc: '5-digit FIPS code (36001 = Albany)' },
      { name: 'county_name', desc: 'County name' },
      { name: 'pathogen_slug', desc: 'Disease: covid-19 / influenza / rsv' },
      { name: 'sample_date', desc: 'End date of the sampling period' },
      { name: 'percentile', desc: 'WVAL score vs. plant historical baseline' },
      { name: 'our_level', desc: 'Derived level: low / watch / moderate / high' },
      { name: 'our_trend', desc: 'Signal direction: rising / stable / declining' },
      { name: 'plant_name', desc: 'Wastewater treatment plant' },
      { name: 'population_served', desc: 'Approximate population served' },
    ],
    tag: 'Updated weekly',
    tagColor: '#27e66e',
  },
  {
    filename: 'wastewater_history.csv',
    title: 'Wastewater — Full History',
    description: 'Complete wastewater surveillance time series for New York State. Every observation since monitoring began, growing with each pipeline run.',
    fields: [
      { name: 'county_fips', desc: '5-digit FIPS code' },
      { name: 'pathogen_slug', desc: 'Disease identifier' },
      { name: 'sample_date', desc: 'End of sampling period' },
      { name: 'percentile', desc: 'WVAL score' },
      { name: 'concentration', desc: 'Raw PCR concentration (copies/mL) where available' },
      { name: 'our_level', desc: 'Derived threat level' },
      { name: 'fetched_at', desc: 'When we retrieved this record from CDC' },
    ],
    tag: 'Growing dataset',
    tagColor: '#7eb8f0',
  },
  {
    filename: 'disease_cases_annual.csv',
    title: 'Disease Cases — Annual by County',
    description: 'Annual communicable disease case counts by county, extracted from NYSDOH annual reports. Covers 61+ diseases across all 62 NYS counties.',
    fields: [
      { name: 'data_year', desc: 'Report year (e.g. 2024)' },
      { name: 'county_fips', desc: '5-digit FIPS code' },
      { name: 'county_name', desc: 'County name' },
      { name: 'disease_slug', desc: 'Disease identifier (e.g. lyme-disease)' },
      { name: 'case_count', desc: 'Confirmed cases (null if suppressed for privacy)' },
      { name: 'is_suppressed', desc: '1 if NYSDOH withheld count (typically < 5 cases)' },
      { name: 'data_source', desc: 'Source document' },
    ],
    tag: 'Updated annually',
    tagColor: '#f4b942',
  },
];

export default function DataPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: '#e2eef8', marginBottom: 10 }}>
          Public Dataset
        </h1>
        <p style={{ fontSize: 14, color: '#8aabc4', lineHeight: 1.7, marginBottom: 12 }}>
          NY Health Watch publishes the underlying data it collects as free, openly licensed CSV files.
          These datasets are generated automatically by our pipeline and committed to GitHub on every update.
          Use them however you like — research, visualization, journalism, or building your own tools.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ color: '#4a6080' }}>
            License: <span style={{ color: '#7eb8f0' }}>Public domain</span>
          </span>
          <span style={{ color: '#4a6080' }}>
            Format: <span style={{ color: '#7eb8f0' }}>CSV, UTF-8</span>
          </span>
          <span style={{ color: '#4a6080' }}>
            Source: <span style={{ color: '#7eb8f0' }}>CDC NWSS + NYSDOH</span>
          </span>
          {metadata.sitewideNote && (
            <span style={{ color: '#4a6080' }}>
              Last updated: <span style={{ color: '#7eb8f0' }}>{metadata.sitewideNote.replace('Data updated ', '')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Dataset cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
        {DATASETS.map((ds) => (
          <div
            key={ds.filename}
            style={{
              background: '#0c1420',
              border: '1px solid #1a2840',
              borderRadius: 10,
              padding: '20px 22px',
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: '#c8d4e8', margin: 0 }}>
                    {ds.title}
                  </h2>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: ds.tagColor, background: `${ds.tagColor}18`,
                    padding: '2px 7px', borderRadius: 4,
                  }}>
                    {ds.tag}
                  </span>
                </div>
                <code style={{ fontSize: 12, color: '#4a6080', fontFamily: 'monospace' }}>
                  {ds.filename}
                </code>
              </div>
              <a
                href={`/downloads/${ds.filename}`}
                download
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#27e66e', color: '#0a1628',
                  padding: '7px 14px', borderRadius: 6,
                  fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                ↓ Download CSV
              </a>
            </div>

            <p style={{ fontSize: 13, color: '#6a8aaa', lineHeight: 1.6, marginBottom: 14 }}>
              {ds.description}
            </p>

            {/* Field table */}
            <div style={{ background: '#080f1a', borderRadius: 6, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a2840' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', color: '#4a6080', fontWeight: 600, width: '35%' }}>Field</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', color: '#4a6080', fontWeight: 600 }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ds.fields.map((field, i) => (
                    <tr key={field.name} style={{ borderBottom: i < ds.fields.length - 1 ? '1px solid #0f1e30' : 'none' }}>
                      <td style={{ padding: '5px 10px', fontFamily: 'monospace', color: '#7eb8f0' }}>{field.name}</td>
                      <td style={{ padding: '5px 10px', color: '#6a8aaa' }}>{field.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Sources */}
      <div style={{ marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e2eef8', marginBottom: 12 }}>
          Data sources
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            {
              label: 'CDC National Wastewater Surveillance System (NWSS)',
              url: 'https://data.cdc.gov/Public-Health-Surveillance/CDC-Wastewater-Viral-Activity-Level-for-SARS-CoV-2/atcp-73re',
              note: 'Wastewater viral activity levels for COVID-19, Influenza A, RSV. Updated weekly.',
            },
            {
              label: 'NYSDOH Communicable Disease Annual Reports',
              url: 'https://www.health.ny.gov/statistics/diseases/communicable/',
              note: 'County-level case counts for 61+ diseases. Updated annually (published ~February).',
            },
          ].map(src => (
            <div key={src.url} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
              <span style={{ color: '#27e66e', flexShrink: 0 }}>→</span>
              <div>
                <a href={src.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#7eb8f0', textDecoration: 'none' }}>
                  {src.label}
                </a>
                <span style={{ color: '#4a6080' }}> — {src.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#e2eef8', marginBottom: 10 }}>
          Notes
        </h2>
        <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'NYC borough data (Bronx, Brooklyn, Manhattan, Queens, Staten Island) is reported as a combined NYC total in the annual case data and is not broken down by borough in the NYSDOH source.',
            'Case counts below 5 are suppressed by NYSDOH for privacy — these appear as null in disease_cases_annual.csv with is_suppressed = 1.',
            'Wastewater data coverage varies by county. Not all NYS counties have active monitoring sites.',
            'All source data is produced by US government agencies and is in the public domain. Our processing code is MIT licensed.',
          ].map((note, i) => (
            <li key={i} style={{ fontSize: 13, color: '#6a8aaa', lineHeight: 1.65 }}>{note}</li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: 12, color: '#3a5060' }}>
        Questions about the data?{' '}
        <Link href="/methodology" style={{ color: '#4a6080' }}>See the methodology page</Link>
        {' '}for how threat levels are computed.
      </p>
    </div>
  );
}
