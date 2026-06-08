'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { County } from '@/data/counties';
import ThreatBadge from './ThreatBadge';

interface Props {
  county: County;
  onClose: () => void;
}

const PANEL_WIDTH = 420;

export default function CountyOverlay({ county, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${county.name} County health information`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(6,13,22,0.72)',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Side panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: `${PANEL_WIDTH}px`,
          maxWidth: '92vw',
          background: '#0f1e2d',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '22px 24px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(226,238,248,0.4)', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                New York State
              </p>
              <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#e2eef8', marginBottom: '10px' }}>
                {county.name} County
              </h1>
              <ThreatBadge level={county.threatLevel} size="md" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: '#8aabc4',
                cursor: 'pointer',
                fontSize: '18px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Threats */}
        <div style={{ padding: '20px 24px', flex: 1 }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'rgba(226,238,248,0.35)',
            marginBottom: '14px',
          }}>
            Active threats
          </p>

          {county.activeThreats.length === 0 ? (
            <div style={{
              background: 'rgba(39,230,110,0.09)',
              border: '1px solid rgba(39,230,110,0.3)',
              borderRadius: '10px',
              padding: '18px 20px',
            }}>
              <p style={{ color: '#27e66e', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                No elevated threats
              </p>
              <p style={{ color: 'rgba(226,238,248,0.5)', fontSize: '13px' }}>
                No diseases are currently elevated above baseline in this county.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {county.activeThreats.map((threat, i) => (
                <div
                  key={i}
                  style={{
                    background: '#152232',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#e2eef8', fontSize: '15px' }}>
                      {threat.diseaseName}
                    </span>
                    <ThreatBadge level={threat.level} size="sm" />
                  </div>
                  <p style={{ fontSize: '13px', color: '#8aabc4', marginBottom: '10px', lineHeight: 1.5 }}>
                    {threat.note}
                  </p>
                  <div style={{
                    background: 'rgba(39,230,110,0.09)',
                    border: '1px solid rgba(39,230,110,0.28)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '10px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#27e66e' }}>
                      → {threat.actionItem}
                    </span>
                  </div>
                  <Link
                    href={`/diseases/${threat.diseaseSlug}`}
                    style={{ fontSize: '12px', color: 'rgba(226,238,248,0.42)', display: 'inline-block' }}
                  >
                    Learn more about {threat.diseaseName} →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '11px', color: 'rgba(226,238,248,0.3)', marginBottom: '12px' }}>
            Data last updated: {county.lastUpdated}
          </p>
          <Link
            href="/diseases"
            style={{
              fontSize: '13px',
              color: '#27e66e',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View all tracked diseases →
          </Link>
        </div>
      </div>
    </div>
  );
}
