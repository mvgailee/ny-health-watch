
import { diseaseRegistry, diseaseBySlug, type DiseaseRegistryEntry } from '@/data/disease-registry';
import { diseaseContentBySlug, type DiseaseContent } from '@/data/disease-content';
import countyThreatsRaw from '@/data/pipeline/county-threats.json';
import diseaseActivityRaw from '@/data/pipeline/disease-activity.json';
import metadataRaw from '@/data/pipeline/metadata.json';

// ── Types ──────────────────────────────────────────────────────────────────

export type ThreatLevel = 'low' | 'watch' | 'moderate' | 'high';
export type Trend = 'rising' | 'stable' | 'declining';

export interface ActiveThreat {
  diseaseName: string;
  diseaseSlug: string;
  level: ThreatLevel;
  note: string;
  actionItem: string;
}

export interface CountyThreatData {
  threatLevel: ThreatLevel;
  activeThreats: ActiveThreat[];
  lastUpdated: string;
}

export interface DiseaseActivityEntry {
  level: ThreatLevel;
  trend: Trend;
  note: string;
  dataSourceLabel: string;
  annualCases2024?: number;
  wastewaterLevel?: string;
}

// ── Fully hydrated disease object (registry + content + activity) ──────────

export interface HydratedDisease extends DiseaseRegistryEntry {
  content: DiseaseContent | null;
  activity: DiseaseActivityEntry;
}

// ── Raw JSON types (inferred from files) ──────────────────────────────────
type CountyThreatsJSON = Record<string, {
  threatLevel: string;
  activeThreats: {
    diseaseName: string;
    diseaseSlug: string;
    level: string;
    note: string;
    actionItem: string;
  }[];
  lastUpdated: string;
}>;

type DiseaseActivityJSON = Record<string, {
  level: string;
  trend: string;
  note: string;
  dataSourceLabel: string;
  annualCases2024?: number;
  wastewaterLevel?: string;
}>;

// ── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_ACTIVITY: DiseaseActivityEntry = {
  level: 'low',
  trend: 'stable',
  note: 'No current activity above baseline.',
  dataSourceLabel: 'NYSDOH annual report',
};

// ── Public API ─────────────────────────────────────────────────────────────

const countyThreats = countyThreatsRaw as CountyThreatsJSON;
const diseaseActivity = diseaseActivityRaw as unknown as DiseaseActivityJSON;

export function getCountyThreats(fips: string): CountyThreatData {
  const raw = countyThreats[fips];
  if (!raw) return { threatLevel: 'low', activeThreats: [], lastUpdated: '' };
  return {
    threatLevel: raw.threatLevel as ThreatLevel,
    activeThreats: raw.activeThreats.map(t => ({
      ...t,
      level: t.level as ThreatLevel,
    })),
    lastUpdated: raw.lastUpdated,
  };
}

export function getAllCountyThreats(): Record<string, CountyThreatData> {
  return Object.fromEntries(
    Object.keys(countyThreats).map(fips => [fips, getCountyThreats(fips)])
  );
}

export function getDiseaseActivity(slug: string): DiseaseActivityEntry {
  const raw = (diseaseActivity as Record<string, typeof diseaseActivity[string]>)[slug];
  if (!raw || raw.level === undefined) return DEFAULT_ACTIVITY;
  return {
    level: raw.level as ThreatLevel,
    trend: raw.trend as Trend,
    note: raw.note,
    dataSourceLabel: raw.dataSourceLabel,
    annualCases2024: raw.annualCases2024,
    wastewaterLevel: raw.wastewaterLevel,
  };
}

export function getAllDiseases(): HydratedDisease[] {
  return diseaseRegistry.map(entry => ({
    ...entry,
    content: diseaseContentBySlug[entry.slug] ?? null,
    activity: getDiseaseActivity(entry.slug),
  }));
}

export function getDisease(slug: string): HydratedDisease | null {
  const entry = diseaseBySlug[slug];
  if (!entry) return null;
  return {
    ...entry,
    content: diseaseContentBySlug[slug] ?? null,
    activity: getDiseaseActivity(slug),
  };
}

export function getSiteMetadata() {
  return {
    lastUpdated: (metadataRaw as { lastUpdated: string; sitewideNote: string }).sitewideNote,
    lastUpdatedISO: (metadataRaw as { lastUpdated: string }).lastUpdated,
  };
}

export function levelLabel(level: ThreatLevel): string {
  return { low: 'Clear', watch: 'Watch', moderate: 'Moderate', high: 'Severe' }[level] ?? 'Clear';
}

export function levelColor(level: ThreatLevel): string {
  return {
    low:      '#1e9150',
    watch:    '#8a7e00',
    moderate: '#9e5200',
    high:     '#9e2020',
  }[level] ?? '#1e9150';
}
