export interface NewsDisease {
  slug: string;
  name: string;
  region: string;
  nysRiskLevel: 'minimal' | 'low' | 'moderate';
  nysRiskLabel: string;
  mediaFear: string;
  nysReality: string;
  whatToKnow: string;
  sources: string[];
  lastUpdated: string;
}

export const newsDiseases: NewsDisease[] = [
  {
    slug: 'ebola',
    name: 'Ebola',
    region: 'Democratic Republic of Congo',
    nysRiskLevel: 'minimal',
    nysRiskLabel: 'No NYS risk',
    mediaFear: `Ebola outbreaks generate intense media coverage due to the virus's high fatality rate and dramatic symptoms.`,
    nysReality: 'There have been zero cases of Ebola in New York State outside of one treated patient in 2014, who fully recovered. Ebola does not spread easily — it requires direct contact with the bodily fluids of a symptomatic person. The risk to NYS residents who have not traveled to an active outbreak zone is effectively zero.',
    whatToKnow: 'Ebola outbreaks are tragic and serious public health events in the affected regions. For NYS residents, the practical risk is negligible. NYSDOH monitors arriving travelers from affected regions. If you have recently traveled to an active outbreak area and develop symptoms, contact your healthcare provider before visiting a clinic.',
    sources: ['NYSDOH Global Health Update', 'CDC Viral Special Pathogens Branch'],
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'hantavirus',
    name: 'Hantavirus',
    region: 'Southwestern United States',
    nysRiskLevel: 'minimal',
    nysRiskLabel: 'Extremely rare in NYS',
    mediaFear: 'Hantavirus Pulmonary Syndrome (HPS) has a high fatality rate (~35%) and occasionally appears in national headlines when cases are reported in the US.',
    nysReality: 'Hantavirus Pulmonary Syndrome is extremely rare in New York State. The disease is associated with the deer mouse, which is primarily found in the rural Southwest and West. A closely related virus, Seoul virus, can be found in rats across the US but rarely causes serious illness. The few NYS cases documented historically were in individuals with extensive rural exposures.',
    whatToKnow: 'The primary risk factor is direct contact with infected rodent droppings, urine, or saliva. If you are cleaning out a long-closed cabin or structure with evidence of rodent activity, wear gloves and a respirator and wet the area with disinfectant before disturbing it. Do not sweep dry rodent droppings.',
    sources: ['CDC Hantavirus', 'NYSDOH Communicable Disease Reports'],
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'h5n1-bird-flu',
    name: 'H5N1 Bird Flu',
    region: 'United States (dairy farms), globally',
    nysRiskLevel: 'low',
    nysRiskLabel: 'Being monitored — low current human risk',
    mediaFear: 'H5N1 has received significant media attention due to its spread in US dairy cattle herds and a small number of human cases among farmworkers, raising concerns about pandemic potential.',
    nysReality: 'As of June 2026, there is no evidence of sustained human-to-human transmission of H5N1. Human cases in the US have occurred almost exclusively among individuals with direct contact with infected poultry or dairy cattle. The general public in NYS faces very low risk. NYSDOH is monitoring dairy farm workers and poultry workers as a precaution.',
    whatToKnow: 'If you work with poultry or dairy cattle, follow NYSDOH guidance for farmworker protection including using appropriate PPE. Avoid contact with sick or dead wild birds. Properly cooked poultry and pasteurized dairy products are safe. NYSDOH and CDC are actively monitoring this situation and would communicate immediately if risk level changes.',
    sources: ['NYSDOH Global Health Update', 'CDC H5 Bird Flu Situation Summary'],
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'dengue',
    name: 'Dengue',
    region: 'Caribbean, Latin America, Southeast Asia',
    nysRiskLevel: 'minimal',
    nysRiskLabel: 'Travel-associated only in NYS',
    mediaFear: 'Record dengue cases globally in 2024-2025 and occasional US cases have prompted media concern about dengue spreading to the continental US.',
    nysReality: 'Dengue does not circulate locally in New York State. All NYS cases are travel-associated — meaning acquired abroad and diagnosed after returning. While Aedes aegypti mosquitoes (the primary dengue vector) have expanded their range in the US South, they are not established in NYS. Local transmission in New York remains unlikely under current climate conditions.',
    whatToKnow: 'If you are traveling to a region with active dengue transmission (Caribbean, Latin America, South/Southeast Asia, parts of Africa), use mosquito repellent, wear protective clothing, and stay in accommodations with air conditioning or screens. There is an FDA-approved dengue vaccine available for travelers — ask your travel medicine provider. If you develop fever after returning from travel, tell your provider where you traveled.',
    sources: ['NYSDOH Travel Health', 'CDC Dengue'],
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'mpox',
    name: 'Mpox',
    region: 'Central/Eastern Africa (clade I), globally (clade II)',
    nysRiskLevel: 'low',
    nysRiskLabel: 'Low transmission currently in NYS',
    mediaFear: 'The 2022 mpox outbreak affected NYS significantly, and new clade I cases in Africa have raised concerns about a resurgence.',
    nysReality: 'After the 2022 outbreak, mpox transmission in NYS dropped substantially due to vaccination and behavior change. Current transmission in NYS is low. The more severe clade I strain circulating in Africa has not caused widespread transmission in the US. NYSDOH maintains surveillance and vaccination programs.',
    whatToKnow: 'Mpox spreads through close physical contact, including sexual contact, and direct contact with infectious lesions or respiratory secretions. The JYNNEOS vaccine is available and effective. If you are at elevated risk (men who have sex with men, people with multiple sexual partners), vaccination is recommended. If you develop an unexplained rash, especially near genitals or the face, contact your healthcare provider.',
    sources: ['NYSDOH Mpox Dashboard', 'CDC Mpox'],
    lastUpdated: 'Jun 6, 2026',
  },
];
