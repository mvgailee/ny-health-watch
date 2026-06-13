'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Map' },
  { href: '/diseases', label: 'All diseases' },
  { href: '/in-the-news', label: 'In the news' },
  { href: '/data', label: 'Data' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        padding: '0 24px',
        background: '#091018',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        flexShrink: 0,
        zIndex: 10,
        position: 'relative',
      }}
    >
      <style>{`
        @media (max-width: 767px) { .nav-logo-full { display: none; } .nav-logo-icon { display: flex; } }
        @media (min-width: 768px) { .nav-logo-full { display: flex; } .nav-logo-icon { display: none; } }
      `}</style>

      <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
        {/* Desktop: full text */}
        <span className="nav-logo-full" style={{ fontSize: '15px', fontWeight: 500, color: '#c8dff0', letterSpacing: '0.01em' }}>
          NY{' '}
          <span style={{ color: '#27e66e' }}>Health</span>
          {' '}Watch
        </span>
        {/* Mobile: icon only */}
        <span className="nav-logo-icon" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#0d1b2e"/>
            <rect x="13" y="6" width="6" height="20" rx="2" fill="#27e66e"/>
            <rect x="6" y="13" width="20" height="6" rx="2" fill="#27e66e"/>
          </svg>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '2px' }}>
        {links.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: '6px',
                color: active ? '#27e66e' : 'rgba(226,238,248,0.65)',
                background: active ? 'rgba(39,230,110,0.14)' : 'transparent',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
