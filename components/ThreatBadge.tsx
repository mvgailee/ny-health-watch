import type { ThreatLevel } from '@/lib/data-loader';

const BADGE_STYLES: Record<ThreatLevel, { bg: string; text: string; label: string }> = {
  low:      { bg: '#0f2a1a', text: '#27e66e', label: 'Clear' },
  watch:    { bg: '#2a2310', text: '#ffde00', label: 'Watch' },
  moderate: { bg: '#2a1c10', text: '#ff8c00', label: 'Moderate' },
  high:     { bg: '#2a1010', text: '#ff4141', label: 'Severe' },
};

export default function ThreatBadge({ level, size = 'sm' }: { level: ThreatLevel; size?: 'sm' | 'md' }) {
  const s = BADGE_STYLES[level] ?? BADGE_STYLES.low;
  const fs = size === 'md' ? '0.8rem' : '0.72rem';
  const px = size === 'md' ? '0.55rem' : '0.4rem';
  const py = size === 'md' ? '0.25rem' : '0.15rem';
  return (
    <span style={{
      background: s.bg, color: s.text,
      padding: `${py} ${px}`, borderRadius: 5,
      fontSize: fs, fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}
