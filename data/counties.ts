export type ThreatLevel = 'low' | 'watch' | 'moderate' | 'high' | 'unknown';

export interface ActiveThreat {
  diseaseName: string;
  diseaseSlug: string;
  level: ThreatLevel;
  note: string;
  actionItem: string;
}

export interface County {
  fips: string;
  name: string;
  threatLevel: ThreatLevel;
  activeThreats: ActiveThreat[];
  lastUpdated: string;
}

export function getThreatFill(level: ThreatLevel): string {
  switch (level) {
    case 'low':      return '#1e9150';  // green
    case 'watch':    return '#8a7e00';  // yellow-gold
    case 'moderate': return '#9e5200';  // orange
    case 'high':     return '#9e2020';  // red
    default:         return '#1e2d3e';
  }
}

export function getThreatHover(level: ThreatLevel): string {
  switch (level) {
    case 'low':      return '#27b865';
    case 'watch':    return '#ada200';
    case 'moderate': return '#c46600';
    case 'high':     return '#c42828';
    default:         return '#283d52';
  }
}

const COVID: ActiveThreat = {
  diseaseName: 'COVID-19',
  diseaseSlug: 'covid-19',
  level: 'moderate',
  note: 'Wastewater signal elevated. Hospitalizations increasing.',
  actionItem: 'Consider updated booster if not recently vaccinated',
};

const LYME: ActiveThreat = {
  diseaseName: 'Lyme Disease',
  diseaseSlug: 'lyme-disease',
  level: 'watch',
  note: 'Peak tick season. High-risk forested and suburban areas.',
  actionItem: 'Use EPA-approved repellent, do full-body tick checks',
};

const MEASLES: ActiveThreat = {
  diseaseName: 'Measles',
  diseaseSlug: 'measles',
  level: 'high',
  note: 'Active outbreak. 12 confirmed cases. Unvaccinated individuals at significant risk.',
  actionItem: 'Verify MMR vaccination status immediately',
};

const WNV: ActiveThreat = {
  diseaseName: 'West Nile Virus',
  diseaseSlug: 'west-nile-virus',
  level: 'watch',
  note: 'Mosquito season underway. First positive pools detected in the area.',
  actionItem: 'Use mosquito repellent, avoid peak mosquito hours (dusk/dawn)',
};

const D = 'Jun 6, 2026';

export const countyData: County[] = [
  { fips: '36001', name: 'Albany',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36003', name: 'Allegany',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36005', name: 'Bronx',         threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36007', name: 'Broome',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36009', name: 'Cattaraugus',   threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36011', name: 'Cayuga',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36013', name: 'Chautauqua',    threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36015', name: 'Chemung',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36017', name: 'Chenango',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36019', name: 'Clinton',       threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36021', name: 'Columbia',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36023', name: 'Cortland',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36025', name: 'Delaware',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36027', name: 'Dutchess',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36029', name: 'Erie',          threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36031', name: 'Essex',         threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36033', name: 'Franklin',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36035', name: 'Fulton',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36037', name: 'Genesee',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36039', name: 'Greene',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36041', name: 'Hamilton',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36043', name: 'Herkimer',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36045', name: 'Jefferson',     threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36047', name: 'Kings',         threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36049', name: 'Lewis',         threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36051', name: 'Livingston',    threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36053', name: 'Madison',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36055', name: 'Monroe',        threatLevel: 'moderate', activeThreats: [COVID, LYME],     lastUpdated: D },
  { fips: '36057', name: 'Montgomery',    threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36059', name: 'Nassau',        threatLevel: 'moderate', activeThreats: [COVID, WNV],      lastUpdated: D },
  { fips: '36061', name: 'New York',      threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36063', name: 'Niagara',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36065', name: 'Oneida',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36067', name: 'Onondaga',      threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36069', name: 'Ontario',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36071', name: 'Orange',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36073', name: 'Orleans',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36075', name: 'Oswego',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36077', name: 'Otsego',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36079', name: 'Putnam',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36081', name: 'Queens',        threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36083', name: 'Rensselaer',    threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36085', name: 'Richmond',      threatLevel: 'moderate', activeThreats: [COVID],           lastUpdated: D },
  { fips: '36087', name: 'Rockland',      threatLevel: 'high',     activeThreats: [MEASLES, COVID],  lastUpdated: D },
  { fips: '36089', name: 'St. Lawrence',  threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36091', name: 'Saratoga',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36093', name: 'Schenectady',   threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36095', name: 'Schoharie',     threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36097', name: 'Schuyler',      threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36099', name: 'Seneca',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36101', name: 'Steuben',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36103', name: 'Suffolk',       threatLevel: 'moderate', activeThreats: [COVID, LYME, WNV],lastUpdated: D },
  { fips: '36105', name: 'Sullivan',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36107', name: 'Tioga',         threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36109', name: 'Tompkins',      threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36111', name: 'Ulster',        threatLevel: 'watch',    activeThreats: [LYME],            lastUpdated: D },
  { fips: '36113', name: 'Warren',        threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36115', name: 'Washington',    threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36117', name: 'Wayne',         threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36119', name: 'Westchester',   threatLevel: 'moderate', activeThreats: [COVID, LYME],     lastUpdated: D },
  { fips: '36121', name: 'Wyoming',       threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
  { fips: '36123', name: 'Yates',         threatLevel: 'low',      activeThreats: [],                lastUpdated: D },
];
