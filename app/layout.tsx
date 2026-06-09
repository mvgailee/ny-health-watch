import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NY Health Watch',
    template: '%s | NY Health Watch',
  },
  description: 'Track infectious disease activity across New York State by county. Real-time wastewater surveillance, annual case data, and threat level maps for 65 diseases.',
  keywords: [
    'New York infectious disease', 'NYS disease tracker', 'communicable disease New York',
    'Lyme disease New York', 'county health map', 'wastewater surveillance',
    'public health New York State', 'disease outbreak tracker',
  ],
  metadataBase: new URL('https://nyhealthwatch.org'),
  openGraph: {
    title: 'NY Health Watch',
    description: 'Track infectious disease activity across New York State by county.',
    url: 'https://nyhealthwatch.org',
    siteName: 'NY Health Watch',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0d1520' }}>
        <Nav />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
          {children}
        </main>
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '14px 24px',
            display: 'flex',
            gap: '20px',
            fontSize: '12px',
            color: 'rgba(226,238,248,0.35)',
            flexShrink: 0,
          }}
        >
          <a href="/methodology" style={{ color: 'rgba(226,238,248,0.35)' }}>Methodology</a>
          <a href="/disclaimers" style={{ color: 'rgba(226,238,248,0.35)' }}>Disclaimers</a>
          <span>Data sourced from NYSDOH &amp; CDC</span>
          <span style={{ marginLeft: 'auto' }}>NY Health Watch</span>
        </footer>
      </body>
    </html>
  );
}
