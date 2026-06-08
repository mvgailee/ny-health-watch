
// Static county metadata — names, FIPS, geography.
// Threat levels and active disease data live in data/pipeline/county-threats.json
// and are read at runtime via lib/data-loader.ts

export interface County {
  fips: string;
  name: string;
}

export const counties: County[] = [
  { fips: '36001', name: 'Albany' },
  { fips: '36003', name: 'Allegany' },
  { fips: '36005', name: 'Bronx' },
  { fips: '36007', name: 'Broome' },
  { fips: '36009', name: 'Cattaraugus' },
  { fips: '36011', name: 'Cayuga' },
  { fips: '36013', name: 'Chautauqua' },
  { fips: '36015', name: 'Chemung' },
  { fips: '36017', name: 'Chenango' },
  { fips: '36019', name: 'Clinton' },
  { fips: '36021', name: 'Columbia' },
  { fips: '36023', name: 'Cortland' },
  { fips: '36025', name: 'Delaware' },
  { fips: '36027', name: 'Dutchess' },
  { fips: '36029', name: 'Erie' },
  { fips: '36031', name: 'Essex' },
  { fips: '36033', name: 'Franklin' },
  { fips: '36035', name: 'Fulton' },
  { fips: '36037', name: 'Genesee' },
  { fips: '36039', name: 'Greene' },
  { fips: '36041', name: 'Hamilton' },
  { fips: '36043', name: 'Herkimer' },
  { fips: '36045', name: 'Jefferson' },
  { fips: '36047', name: 'Kings' },
  { fips: '36049', name: 'Lewis' },
  { fips: '36051', name: 'Livingston' },
  { fips: '36053', name: 'Madison' },
  { fips: '36055', name: 'Monroe' },
  { fips: '36057', name: 'Montgomery' },
  { fips: '36059', name: 'Nassau' },
  { fips: '36061', name: 'New York' },
  { fips: '36063', name: 'Niagara' },
  { fips: '36065', name: 'Oneida' },
  { fips: '36067', name: 'Onondaga' },
  { fips: '36069', name: 'Ontario' },
  { fips: '36071', name: 'Orange' },
  { fips: '36073', name: 'Orleans' },
  { fips: '36075', name: 'Oswego' },
  { fips: '36077', name: 'Otsego' },
  { fips: '36079', name: 'Putnam' },
  { fips: '36081', name: 'Queens' },
  { fips: '36083', name: 'Rensselaer' },
  { fips: '36085', name: 'Richmond' },
  { fips: '36087', name: 'Rockland' },
  { fips: '36089', name: 'St. Lawrence' },
  { fips: '36091', name: 'Saratoga' },
  { fips: '36093', name: 'Schenectady' },
  { fips: '36095', name: 'Schoharie' },
  { fips: '36097', name: 'Schuyler' },
  { fips: '36099', name: 'Seneca' },
  { fips: '36101', name: 'Steuben' },
  { fips: '36103', name: 'Suffolk' },
  { fips: '36105', name: 'Sullivan' },
  { fips: '36107', name: 'Tioga' },
  { fips: '36109', name: 'Tompkins' },
  { fips: '36111', name: 'Ulster' },
  { fips: '36113', name: 'Warren' },
  { fips: '36115', name: 'Washington' },
  { fips: '36117', name: 'Wayne' },
  { fips: '36119', name: 'Westchester' },
  { fips: '36121', name: 'Wyoming' },
  { fips: '36123', name: 'Yates' },
];

export const countyByFips = Object.fromEntries(
  counties.map(c => [c.fips, c])
) as Record<string, County>;
