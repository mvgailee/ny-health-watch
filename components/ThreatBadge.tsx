import type { ThreatLevel } from '@/data/counties';

interface Props {
  level: ThreatLevel;
  size?: 'sm' | 'md';
}

const cfg: Record<ThreatLevel, { label: string; bg: string; color: string; border: string }> = {
  low:      { label: 'Clear',    bg: 'rgba(39,230,110,0.14)',  color: '#27e66e', border: 'rgba(39,230,110,0.35)'  },
  watch:    { label: 'Low',      bg: 'rgba(255,222,0,0.13)',   color: '#ffde00', border: 'rgba(255,222,0,0.35)'   },
  moderate: { label: 'Moderate', bg: 'rgba(255,140,0,0.13)',   color: '#ff8c00', border: 'rgba(255,140,0,0.35)'   },
  high:     { label: 'Severe',   bg: 'rgba(255,65,65,0.14)',   color: '#ff4141', border: 'rgba(255,65,65,0.38)'   },
  unknown:  { label: 'Unknown',  bg: 'rgba(138,171,196,0.1)',  color: '#8aabc4', border: 'rgba(138,171,196,0.2)'  },
};

export default function ThreatBadge({ level, size = 'sm' }: Props) {
  const c = cfg[level] ?? cfg.unknown;
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: size === 'sm' ? '11px' : '13px',
        fontWeight: 500,
        padding: size === 'sm' ? '2px 9px' : '4px 12px',
        borderRadius: '999px',
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {c.label}
    </span>
  );
}
