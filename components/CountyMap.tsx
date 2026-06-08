'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { countyData, getThreatFill, getThreatHover, type County } from '@/data/counties';

interface Props {
  onCountyClick: (county: County) => void;
  selectedFips: string | null;
}

const ATLAS_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json';

export default function CountyMap({ onCountyClick, selectedFips }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Store latest callback in a ref so the effect doesn't need it as a dependency
  const onClickRef = useRef(onCountyClick);
  onClickRef.current = onCountyClick;

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let cancelled = false;

    const renderMap = async (width: number, height: number) => {
      try {
        const us = await fetch(ATLAS_URL).then(r => r.json());
        if (cancelled) return;

        const allCounties = topojson.feature(us, us.objects.counties) as unknown as GeoJSON.FeatureCollection;
        const nyFeatures: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: allCounties.features.filter(f => String(f.id).startsWith('36')),
        };

        const projection = d3.geoMercator().fitExtent(
          [[24, 24], [width - 24, height - 24]],
          nyFeatures
        );
        const path = d3.geoPath().projection(projection);

        const svg = d3.select(svgEl);
        svg.attr('width', width).attr('height', height);
        svg.selectAll('*').remove();

        const g = svg.append('g').attr('class', 'counties');

        g.selectAll<SVGPathElement, GeoJSON.Feature>('path')
          .data(nyFeatures.features)
          .join('path')
          .attr('d', d => path(d) ?? '')
          .attr('fill', d => {
            const fips = String(d.id).padStart(5, '0');
            const county = countyData.find(c => c.fips === fips);
            return county ? getThreatFill(county.threatLevel) : '#1a2535';
          })
          .attr('stroke', '#0a1825')
          .attr('stroke-width', '0.8')
          .attr('cursor', 'pointer')
          .on('mouseenter', function (event: MouseEvent) {
            const el = event.currentTarget as SVGPathElement;
            const d = d3.select(el).datum() as GeoJSON.Feature;
            const fips = String(d.id).padStart(5, '0');
            const county = countyData.find(c => c.fips === fips);
            d3.select(el)
              .raise()
              .attr('fill', county ? getThreatHover(county.threatLevel) : '#253547')
              .attr('stroke', 'rgba(255,255,255,0.55)')
              .attr('stroke-width', '1.2');
          })
          .on('mouseleave', function (event: MouseEvent) {
            const el = event.currentTarget as SVGPathElement;
            const d = d3.select(el).datum() as GeoJSON.Feature;
            const fips = String(d.id).padStart(5, '0');
            const county = countyData.find(c => c.fips === fips);
            d3.select(el)
              .attr('fill', county ? getThreatFill(county.threatLevel) : '#1a2535')
              .attr('stroke', '#0a1825')
              .attr('stroke-width', '0.8');
          })
          .on('click', function (_event: MouseEvent, d: GeoJSON.Feature) {
            const fips = String(d.id).padStart(5, '0');
            const county = countyData.find(c => c.fips === fips);
            if (county) onClickRef.current(county);
          })
          .append('title')
          .text(d => {
            const fips = String(d.id).padStart(5, '0');
            const county = countyData.find(c => c.fips === fips);
            return county ? county.name + ' County' : '';
          });

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setMapError('Could not load map. Check your connection and refresh.');
      }
    };

    // Use ResizeObserver so we render once the container has real dimensions
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        observer.disconnect();
        renderMap(width, height);
      }
    });

    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && !mapError && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#8aabc4', fontSize: '14px' }}>Loading map…</span>
        </div>
      )}
      {mapError && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#ef4444', fontSize: '14px' }}>{mapError}</span>
        </div>
      )}
      <svg
        ref={svgRef}
        style={{ width: '100%', height: '100%', display: loading ? 'none' : 'block' }}
      />

      {/* Legend */}
      {!loading && (
        <div style={{
          position: 'absolute', bottom: '20px', left: '20px',
          display: 'flex', gap: '14px', flexWrap: 'wrap',
          background: 'rgba(6,13,22,0.75)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {[
            { level: 'Clear',    fill: '#27e66e' },
            { level: 'Low',      fill: '#ffde00' },
            { level: 'Moderate', fill: '#ff8c00' },
            { level: 'Severe',   fill: '#ff4141' },
          ].map(({ level, fill }) => (
            <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: fill, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'rgba(226,238,248,0.6)' }}>{level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
