
export type DataTier = 'A' | 'B' | 'C';

export type DataSource =
  | 'wastewater'        // Socrata API, near-daily
  | 'respiratory-pdf'   // NYSDOH weekly respiratory report
  | 'arboviral-pdf'     // NYSDOH weekly arboviral report (seasonal)
  | 'annual-report-pdf' // NYSDOH annual communicable disease report
  | 'manual';           // Operator-updated on outbreak declaration

export type DiseaseCategory =
  | 'Respiratory'
  | 'Vector-borne'
  | 'Gastrointestinal'
  | 'Sexually transmitted'
  | 'Bloodborne'
  | 'Vaccine-preventable'
  | 'Zoonotic'
  | 'Invasive bacterial'
  | 'Fungal'
  | 'Neurological'
  | 'Other';

export type Seasonality = 'year-round' | 'summer' | 'winter' | 'tick-season' | 'variable';

export interface DiseaseRegistryEntry {
  slug: string;
  name: string;
  categories: DiseaseCategory[];
  tier: DataTier;
  dataSources: DataSource[];
  annualReportKey?: string;    // matching key in annual-cases.json
  zeroTolerance: boolean;      // any confirmed case in a county = flag
  hasDetailPage: boolean;      // full educational content written
  vaccineAvailable: boolean;
  seasonality: Seasonality;
  typicallyRare: boolean;      // typically <50 cases/year statewide
}

export const diseaseRegistry: DiseaseRegistryEntry[] = [

  // ── TIER A — Real-time / government labels passed through ─────────────────

  { slug: 'covid-19', name: 'COVID-19',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'A',
    dataSources: ['wastewater', 'respiratory-pdf'],
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'influenza', name: 'Influenza',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'A',
    dataSources: ['respiratory-pdf', 'annual-report-pdf'],
    annualReportKey: 'influenza',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'winter', typicallyRare: false },

  { slug: 'rsv', name: 'RSV',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'A',
    dataSources: ['wastewater', 'respiratory-pdf', 'annual-report-pdf'],
    annualReportKey: 'rsv',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'winter', typicallyRare: false },

  { slug: 'norovirus', name: 'Norovirus',
    categories: ['Gastrointestinal'], tier: 'A',
    dataSources: ['wastewater'],
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'winter', typicallyRare: false },

  { slug: 'west-nile-virus', name: 'West Nile Virus',
    categories: ['Vector-borne'], tier: 'A',
    dataSources: ['arboviral-pdf', 'annual-report-pdf'],
    annualReportKey: 'west-nile-virus',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'eastern-equine-encephalitis', name: 'Eastern Equine Encephalitis',
    categories: ['Vector-borne', 'Neurological'], tier: 'A',
    dataSources: ['arboviral-pdf'],
    zeroTolerance: true, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: true },

  // ── TIER B — Annual report, statistical baseline comparison ───────────────

  // Vector-borne
  { slug: 'lyme-disease', name: 'Lyme Disease',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'lyme-disease',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'tick-season', typicallyRare: false },

  { slug: 'anaplasmosis', name: 'Anaplasmosis',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'anaplasmosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'tick-season', typicallyRare: false },

  { slug: 'babesiosis', name: 'Babesiosis',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'babesiosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'tick-season', typicallyRare: false },

  { slug: 'ehrlichiosis', name: 'Ehrlichiosis',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'ehrlichiosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'tick-season', typicallyRare: true },

  { slug: 'rocky-mountain-spotted-fever', name: 'Rocky Mountain Spotted Fever',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'rocky-mountain-spotted-fever',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'tick-season', typicallyRare: true },

  { slug: 'west-nile-fever', name: 'West Nile Fever',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'west-nile-fever',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: true },

  { slug: 'malaria', name: 'Malaria',
    categories: ['Vector-borne', 'Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'malaria',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'variable', typicallyRare: false },

  { slug: 'dengue-fever', name: 'Dengue Fever',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'dengue-fever',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'variable', typicallyRare: false },

  { slug: 'chikungunya', name: 'Chikungunya',
    categories: ['Vector-borne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'chikungunya',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'variable', typicallyRare: true },

  // Gastrointestinal
  { slug: 'campylobacteriosis', name: 'Campylobacteriosis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'campylobacteriosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'salmonellosis', name: 'Salmonellosis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'salmonellosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'shigellosis', name: 'Shigellosis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'shigellosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'e-coli-stec', name: 'E. Coli (STEC)',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'e-coli-stec',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'cryptosporidiosis', name: 'Cryptosporidiosis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'cryptosporidiosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'giardiasis', name: 'Giardiasis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'giardiasis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'listeriosis', name: 'Listeriosis',
    categories: ['Gastrointestinal', 'Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'listeriosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'yersiniosis', name: 'Yersiniosis',
    categories: ['Gastrointestinal', 'Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'yersiniosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'cyclosporiasis', name: 'Cyclosporiasis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'cyclosporiasis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'vibriosis', name: 'Vibriosis',
    categories: ['Gastrointestinal', 'Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'vibriosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'hemolytic-uremic-syndrome', name: 'Hemolytic Uremic Syndrome',
    categories: ['Gastrointestinal', 'Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hemolytic-uremic-syndrome',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'amebiasis', name: 'Amebiasis',
    categories: ['Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'amebiasis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  // Sexually transmitted
  { slug: 'chlamydia', name: 'Chlamydia',
    categories: ['Sexually transmitted'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'chlamydia',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'gonorrhea', name: 'Gonorrhea',
    categories: ['Sexually transmitted'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'gonorrhea',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'syphilis-early', name: 'Syphilis (Early)',
    categories: ['Sexually transmitted'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'syphilis-early',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'syphilis-late', name: 'Syphilis (Late)',
    categories: ['Sexually transmitted'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'syphilis-late',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'mpox', name: 'Mpox',
    categories: ['Sexually transmitted', 'Other'], tier: 'B',
    dataSources: ['annual-report-pdf', 'manual'],
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  // Bloodborne
  { slug: 'hepatitis-a', name: 'Hepatitis A',
    categories: ['Bloodborne', 'Gastrointestinal', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hepatitis-a',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'hepatitis-b-acute', name: 'Hepatitis B (Acute)',
    categories: ['Bloodborne', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hepatitis-b-acute',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'hepatitis-b-chronic', name: 'Hepatitis B (Chronic)',
    categories: ['Bloodborne', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hepatitis-b-chronic',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'hepatitis-c-acute', name: 'Hepatitis C (Acute)',
    categories: ['Bloodborne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hepatitis-c-acute',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'hepatitis-c-chronic', name: 'Hepatitis C (Chronic)',
    categories: ['Bloodborne'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'hepatitis-c-chronic',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  // Respiratory
  { slug: 'tuberculosis', name: 'Tuberculosis',
    categories: ['Respiratory'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'tuberculosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'legionellosis', name: 'Legionellosis',
    categories: ['Respiratory'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'legionellosis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'pertussis', name: 'Pertussis (Whooping Cough)',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'pertussis',
    zeroTolerance: false, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'mumps', name: 'Mumps',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'mumps',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'varicella', name: 'Varicella (Chickenpox)',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'varicella',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'winter', typicallyRare: false },

  // Invasive bacterial
  { slug: 'strep-a-invasive', name: 'Group A Strep (Invasive)',
    categories: ['Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'strep-a-invasive',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'strep-b-invasive', name: 'Group B Strep (Invasive)',
    categories: ['Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'strep-b-invasive',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'strep-pneumo-invasive', name: 'Pneumococcal Disease (Invasive)',
    categories: ['Invasive bacterial', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'strep-pneumo-invasive',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'winter', typicallyRare: false },

  { slug: 'meningococcal', name: 'Meningococcal Disease',
    categories: ['Invasive bacterial', 'Vaccine-preventable', 'Neurological'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'meningococcal',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'haemophilus-influenzae', name: 'Haemophilus Influenzae (Invasive)',
    categories: ['Invasive bacterial', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'haemophilus-influenzae',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'listeria', name: 'Listeria',
    categories: ['Invasive bacterial', 'Gastrointestinal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'listeriosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  // Neurological
  { slug: 'meningitis-aseptic', name: 'Meningitis (Viral/Aseptic)',
    categories: ['Neurological'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'meningitis-aseptic',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: false },

  { slug: 'meningitis-bacterial', name: 'Meningitis (Bacterial)',
    categories: ['Neurological', 'Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'meningitis-bacterial',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'acute-flaccid-myelitis', name: 'Acute Flaccid Myelitis',
    categories: ['Neurological'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'acute-flaccid-myelitis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: true },

  // Zoonotic / Other
  { slug: 'q-fever', name: 'Q Fever',
    categories: ['Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'q-fever',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'variable', typicallyRare: true },

  { slug: 'brucellosis', name: 'Brucellosis',
    categories: ['Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'brucellosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'candida-auris', name: 'Candida Auris',
    categories: ['Fungal'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'candida-auris',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: false },

  { slug: 'blastomycosis', name: 'Blastomycosis',
    categories: ['Fungal', 'Zoonotic'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'blastomycosis',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'variable', typicallyRare: true },

  { slug: 'typhoid-fever', name: 'Typhoid Fever',
    categories: ['Gastrointestinal', 'Vaccine-preventable'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'typhoid-fever',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'variable', typicallyRare: true },

  { slug: 'neonatal-herpes', name: 'Neonatal Herpes',
    categories: ['Other'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'neonatal-herpes',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'toxic-shock-syndrome', name: 'Toxic Shock Syndrome',
    categories: ['Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'toxic-shock-syndrome',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'visa-staph', name: 'Drug-Resistant Staph (VISA)',
    categories: ['Invasive bacterial'], tier: 'B',
    dataSources: ['annual-report-pdf'], annualReportKey: 'visa-staph',
    zeroTolerance: false, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  // ── TIER C — Zero-tolerance / manual update ───────────────────────────────

  { slug: 'measles', name: 'Measles',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'C',
    dataSources: ['manual', 'annual-report-pdf'], annualReportKey: 'measles',
    zeroTolerance: true, hasDetailPage: true, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'botulism', name: 'Botulism',
    categories: ['Gastrointestinal', 'Neurological'], tier: 'C',
    dataSources: ['manual', 'annual-report-pdf'], annualReportKey: 'botulism',
    zeroTolerance: true, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'diphtheria', name: 'Diphtheria',
    categories: ['Respiratory', 'Vaccine-preventable'], tier: 'C',
    dataSources: ['manual'],
    zeroTolerance: true, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'tetanus', name: 'Tetanus',
    categories: ['Other', 'Vaccine-preventable'], tier: 'C',
    dataSources: ['manual', 'annual-report-pdf'], annualReportKey: 'tetanus',
    zeroTolerance: true, hasDetailPage: false, vaccineAvailable: true,
    seasonality: 'year-round', typicallyRare: true },

  { slug: 'tularemia', name: 'Tularemia',
    categories: ['Zoonotic', 'Vector-borne'], tier: 'C',
    dataSources: ['manual', 'annual-report-pdf'], annualReportKey: 'tularemia',
    zeroTolerance: true, hasDetailPage: false, vaccineAvailable: false,
    seasonality: 'summer', typicallyRare: true },
];

export const diseaseBySlug = Object.fromEntries(
  diseaseRegistry.map(d => [d.slug, d])
) as Record<string, DiseaseRegistryEntry>;

export const CATEGORY_ORDER: DiseaseCategory[] = [
  'Respiratory',
  'Vector-borne',
  'Gastrointestinal',
  'Sexually transmitted',
  'Bloodborne',
  'Invasive bacterial',
  'Vaccine-preventable',
  'Zoonotic',
  'Fungal',
  'Neurological',
  'Other',
];
