import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'NY Health Watch',
  description: 'Infectious disease activity and health alerts for New York State.',
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
