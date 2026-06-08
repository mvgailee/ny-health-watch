'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getAllDiseases, levelLabel, type ThreatLevel } from '@/lib/data-loader';
import { CATEGORY_ORDER, type DiseaseCategory } from '@/data/disease-registry';
import ThreatBadge from '@/components/ThreatBadge';

const CATEGORIES: DiseaseCategory[] = [...CATEGORY_ORDER];

const TIER_LABELS: Record<string, string> = {
  A: 'Real-time',
  B: 'Annual report',
  C: 'Zero-tolerance',
};

const THREAT_ORDER: ThreatLevel[] = ['high', 'moderate', 'watch', 'low'];

function sortScore(level: ThreatLevel) {
  return THREAT_ORDER.indexOf(level);
}

export default function DiseasesPage() {
  const [categoryFilter, setCategoryFilter] = useState<DiseaseCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const allDiseases = useMemo(() => getAllDiseases(), []);

  const filtered = useMemo(() => {
    let list = allDiseases;
    if (categoryFilter !== 'All') {
      list = list.filter(d => d.categories.includes(categoryFilter));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const lvlA = sortScore(a.activity.level);
      const lvlB = sortScore(b.activity.level);
      if (lvlA !== lvlB) return lvlA - lvlB;
      return a.name.localeCompare(b.name);
    });
  }, [allDiseases, categoryFilter, search]);

  const activeCount = filtered.filter(d => d.activity.level !== 'low').length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.3rem', color: '#e8eaf0' }}>
        All Tracked Diseases
      </h1>
      <p style={{ color: '#8a9bb0', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
        {allDiseases.length} diseases tracked across New York State.
        {activeCount > 0 && (
          <span style={{ color: '#f4b942', marginLeft: '0.5rem' }}>
            {activeCount} currently elevated above baseline.
          </span>
        )}
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search diseases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#1a2235', border: '1px solid #2a3550', borderRadius: 8,
            color: '#e8eaf0', padding: '0.5rem 0.75rem', fontSize: '0.9rem', outline: 'none',
            maxWidth: 360,
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {(['All', ...CATEGORIES] as (DiseaseCategory | 'All')[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '0.25rem 0.65rem', borderRadius: 20, border: 'none',
                fontSize: '0.78rem', cursor: 'pointer',
                background: categoryFilter === cat ? '#27e66e' : '#1a2235',
                color: categoryFilter === cat ? '#0a1628' : '#8a9bb0',
                fontWeight: categoryFilter === cat ? 700 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p style={{ color: '#8a9bb0' }}>No diseases match your filter.</p>
      ) : (
        <div style={{ border: '1px solid #1e2f45', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f1a2e', borderBottom: '1px solid #1e2f45' }}>
                {['Disease', 'Category', 'NYS Status', 'Data', ''].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.9rem', textAlign: 'left', fontSize: '0.75rem', color: '#8a9bb0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((disease, idx) => (
                <tr
                  key={disease.slug}
                  style={{
                    background: idx % 2 === 0 ? '#0c1420' : '#0a111e',
                    borderBottom: '1px solid #1a2840',
                  }}
                >
                  <td style={{ padding: '0.7rem 0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {disease.tier === 'C' && (
                        <span title="Zero-tolerance: any case flagged" style={{ fontSize: '0.7rem', background: '#3d1a1a', color: '#f87171', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 600 }}>
                          !
                        </span>
                      )}
                      <span style={{ fontWeight: 600, color: '#c8d4e8', fontSize: '0.88rem' }}>
                        {disease.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.7rem 0.9rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#6a7d99' }}>
                      {disease.categories[0]}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 0.9rem' }}>
                    <ThreatBadge level={disease.activity.level} />
                  </td>
                  <td style={{ padding: '0.7rem 0.9rem' }}>
                    <span style={{
                      fontSize: '0.7rem', color: '#4a6080',
                      background: '#0f1a2e', padding: '0.15rem 0.4rem',
                      borderRadius: 4, fontFamily: 'monospace',
                    }}>
                      Tier {disease.tier} · {TIER_LABELS[disease.tier]}
                    </span>
                  </td>
                  <td style={{ padding: '0.7rem 0.9rem' }}>
                    <Link
                      href={`/diseases/${disease.slug}`}
                      style={{
                        fontSize: '0.78rem', color: '#8a9bb0',
                        textDecoration: 'none',
                        padding: '0.2rem 0.5rem',
                        border: '1px solid #2a3a52',
                        borderRadius: 5,
                      }}
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: '1.5rem', color: '#4a6080', fontSize: '0.78rem' }}>
        Disease data sourced from NYSDOH. Annual report data reflects 2024 case counts.
        Tier A diseases reflect real-time or weekly surveillance. Tier C diseases are flagged on any confirmed case.
      </p>
    </div>
  );
}
