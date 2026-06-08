import type { ThreatLevel } from './counties';

export interface ActionItem {
  text: string;
  type: 'vaccine' | 'prevention' | 'treatment' | 'monitor';
}

export interface Disease {
  slug: string;
  name: string;
  categories: string[];
  currentThreatLevel: ThreatLevel;
  nysTrend: 'rising' | 'stable' | 'declining';
  dataSource: 'realtime' | 'weekly' | 'annual';
  dataSourceLabel: string;
  shortDescription: string;
  whatIsIt: string;
  howItSpreads: string;
  symptoms: string;
  whoIsAtRisk: string;
  currentNYSStatus: string;
  actionItems: ActionItem[];
  vaccineAvailable: boolean;
  vaccineInfo?: string;
  lastUpdated: string;
}

export const diseases: Disease[] = [
  {
    slug: 'covid-19',
    name: 'COVID-19',
    categories: ['Respiratory', 'Vaccine-preventable'],
    currentThreatLevel: 'moderate',
    nysTrend: 'rising',
    dataSource: 'realtime',
    dataSourceLabel: 'NYSDOH wastewater surveillance, updated daily',
    shortDescription: 'Respiratory illness caused by the SARS-CoV-2 virus, with updated vaccines available.',
    whatIsIt: 'COVID-19 is a respiratory illness caused by SARS-CoV-2. Since its emergence in 2020, the virus has evolved into multiple variants. Updated vaccines are available each season targeting current circulating strains.',
    howItSpreads: 'Spreads primarily through respiratory droplets and aerosols when an infected person breathes, talks, coughs, or sneezes. Transmission is highest in enclosed, poorly ventilated spaces.',
    symptoms: 'Fever, cough, fatigue, shortness of breath, loss of taste or smell, sore throat, and congestion. Symptoms range from mild to severe.',
    whoIsAtRisk: 'Anyone can contract COVID-19. Older adults, immunocompromised individuals, and those with underlying health conditions are at higher risk for severe illness.',
    currentNYSStatus: 'Wastewater surveillance signals are elevated and rising across several NYS regions, particularly downstate. Hospitalizations have increased modestly over the past two weeks. The dominant circulating variant is JN.1 and its descendants.',
    actionItems: [
      { text: 'Get the updated COVID-19 vaccine if not recently vaccinated', type: 'vaccine' },
      { text: 'Consider masking in crowded indoor settings if high-risk', type: 'prevention' },
      { text: 'Test before gatherings, especially with vulnerable individuals', type: 'prevention' },
      { text: 'Contact your provider promptly if symptoms develop — antiviral treatments are available', type: 'treatment' },
    ],
    vaccineAvailable: true,
    vaccineInfo: 'Updated annual vaccine is recommended for everyone 6 months and older. Available at pharmacies, NYSDOH clinics, and most primary care providers across NYS.',
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'influenza',
    name: 'Influenza',
    categories: ['Respiratory', 'Vaccine-preventable', 'Seasonal'],
    currentThreatLevel: 'low',
    nysTrend: 'declining',
    dataSource: 'weekly',
    dataSourceLabel: 'NYSDOH respiratory surveillance report, updated weekly',
    shortDescription: 'Seasonal respiratory virus; off-season now but annual vaccination is recommended.',
    whatIsIt: 'Influenza (the flu) is a contagious respiratory illness caused by influenza viruses. It circulates primarily in the fall and winter, typically peaking between December and February in New York.',
    howItSpreads: 'Spreads through respiratory droplets when infected people cough, sneeze, or talk. Less commonly, it spreads by touching contaminated surfaces then touching the mouth, nose, or eyes.',
    symptoms: 'Sudden onset of fever, chills, muscle aches, headache, cough, sore throat, and fatigue. Unlike a cold, flu symptoms come on quickly and are typically more severe.',
    whoIsAtRisk: 'Children under 5, adults 65 and older, pregnant people, and those with chronic health conditions are at highest risk for serious complications including pneumonia.',
    currentNYSStatus: 'Influenza activity is low and off-season. The 2025-26 flu season has officially ended. The composition of the 2026-27 vaccine has been announced by the FDA; updated vaccines will be available in late summer.',
    actionItems: [
      { text: 'Get the annual flu vaccine when it becomes available in late summer', type: 'vaccine' },
      { text: 'Wash hands frequently during flu season (Oct–March)', type: 'prevention' },
    ],
    vaccineAvailable: true,
    vaccineInfo: 'Annual flu vaccine is recommended for everyone 6 months and older. Updated for each season; typically available starting September at pharmacies and clinics statewide.',
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'rsv',
    name: 'RSV',
    categories: ['Respiratory', 'Seasonal'],
    currentThreatLevel: 'low',
    nysTrend: 'stable',
    dataSource: 'weekly',
    dataSourceLabel: 'NYSDOH respiratory surveillance report, updated weekly',
    shortDescription: 'Common respiratory virus; off-season. Vaccines now available for older adults and during pregnancy.',
    whatIsIt: 'Respiratory syncytial virus (RSV) is a common virus that causes respiratory illness. Most people recover in one to two weeks, but it can cause serious illness in infants, young children, and older adults.',
    howItSpreads: 'Spreads through respiratory droplets and direct contact with infected surfaces. RSV can survive on hard surfaces for several hours.',
    symptoms: 'Runny nose, decreased appetite, coughing, sneezing, fever, and wheezing. In infants, RSV can cause bronchiolitis and pneumonia.',
    whoIsAtRisk: 'Infants (especially premature), young children, adults 60 and older, and immunocompromised individuals are most at risk for severe illness.',
    currentNYSStatus: 'RSV activity is currently low and off-season. Activity typically rises in the fall and peaks in winter. Wastewater surveillance is monitoring for early seasonal signals.',
    actionItems: [
      { text: 'RSV vaccine is recommended for adults 60+ — talk to your provider', type: 'vaccine' },
      { text: 'RSV vaccine during pregnancy protects newborns — ask your OB or midwife', type: 'vaccine' },
      { text: 'Keep infants away from people with respiratory illness symptoms', type: 'prevention' },
    ],
    vaccineAvailable: true,
    vaccineInfo: 'RSV vaccines (Abrysvo, Arexvy) are recommended for adults 60+. Abrysvo is also approved for use during pregnancy (32–36 weeks) to protect newborns. A monoclonal antibody (nirsevimab/Beyfortus) is available for infants.',
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'lyme-disease',
    name: 'Lyme Disease',
    categories: ['Vector-borne', 'Seasonal'],
    currentThreatLevel: 'moderate',
    nysTrend: 'rising',
    dataSource: 'weekly',
    dataSourceLabel: 'NYSDOH communicable disease surveillance, updated weekly',
    shortDescription: 'Bacterial infection spread by black-legged ticks; peak season June–August in NYS.',
    whatIsIt: 'Lyme disease is caused by the bacterium Borrelia burgdorferi, transmitted to humans through the bite of infected black-legged (deer) ticks. New York is one of the highest-burden Lyme disease states in the US.',
    howItSpreads: 'Spread exclusively through the bite of infected black-legged ticks. The tick must typically be attached for 36–48 hours to transmit the bacteria. Lyme disease cannot spread from person to person.',
    symptoms: `Early signs include a characteristic "bull's-eye" rash (erythema migrans), fever, headache, and fatigue. If untreated, it can spread to joints, the heart, and the nervous system.`,
    whoIsAtRisk: 'Anyone who spends time outdoors in wooded or grassy areas, particularly in the Hudson Valley, Long Island, and the Southern Tier. Children and older adults who spend time outdoors are commonly affected.',
    currentNYSStatus: `Lyme disease activity is elevated and rising as expected for peak tick season. Case reports are running ahead of last year's pace in the Hudson Valley, Long Island, and Capital Region. Black-legged tick populations are at peak activity through August.`,
    actionItems: [
      { text: 'Apply EPA-registered repellents containing DEET, picaridin, or IR3535', type: 'prevention' },
      { text: 'Do a full-body tick check after any time outdoors, especially in wooded areas', type: 'prevention' },
      { text: 'Remove attached ticks promptly with fine-tipped tweezers', type: 'prevention' },
      { text: 'See a provider immediately if you develop a rash or fever after a tick bite', type: 'treatment' },
    ],
    vaccineAvailable: false,
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'west-nile-virus',
    name: 'West Nile Virus',
    categories: ['Vector-borne', 'Seasonal'],
    currentThreatLevel: 'watch',
    nysTrend: 'rising',
    dataSource: 'weekly',
    dataSourceLabel: 'NYSDOH arboviral surveillance, updated weekly',
    shortDescription: 'Mosquito-borne virus; first positive mosquito pools detected in NYS. Season runs June–October.',
    whatIsIt: 'West Nile virus (WNV) is a mosquito-borne virus that can cause neurological illness in a small percentage of those infected. It was first detected in New York City in 1999 and has since spread across North America.',
    howItSpreads: 'Spreads to humans through the bites of infected Culex mosquitoes. It does not spread from person to person. Birds are the primary reservoir for the virus.',
    symptoms: 'Most infected people (80%) have no symptoms. About 20% develop West Nile fever with headache, body aches, joint pain, and fatigue. Less than 1% develop severe neurological illness.',
    whoIsAtRisk: 'Adults over 60 and immunocompromised individuals are at highest risk for severe neurological disease. Risk increases with more time spent outdoors during mosquito season.',
    currentNYSStatus: 'The first WNV-positive mosquito pools of the season have been detected in Nassau and Suffolk counties. Surveillance is ongoing statewide. Human cases typically peak in August and September in New York.',
    actionItems: [
      { text: 'Use EPA-registered mosquito repellent when outdoors', type: 'prevention' },
      { text: 'Wear long sleeves and pants at dusk and dawn when mosquitoes are most active', type: 'prevention' },
      { text: 'Eliminate standing water around your home — it is a mosquito breeding ground', type: 'prevention' },
      { text: 'Use air conditioning or window screens to keep mosquitoes out', type: 'prevention' },
    ],
    vaccineAvailable: false,
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'measles',
    name: 'Measles',
    categories: ['Vaccine-preventable'],
    currentThreatLevel: 'high',
    nysTrend: 'rising',
    dataSource: 'weekly',
    dataSourceLabel: 'NYSDOH outbreak investigation, updated as cases are confirmed',
    shortDescription: 'Active outbreak in Rockland County. MMR vaccine is highly effective. Check your vaccination status.',
    whatIsIt: 'Measles is a highly contagious viral disease. Before widespread vaccination, it caused millions of infections and thousands of deaths annually in the US. It was declared eliminated from the US in 2000, but outbreaks continue among unvaccinated populations.',
    howItSpreads: 'One of the most contagious infectious diseases known. Spreads through the air when an infected person coughs or sneezes. The virus can remain infectious in the air and on surfaces for up to two hours after an infected person has left the area.',
    symptoms: 'High fever, cough, runny nose, and red watery eyes followed by a characteristic red blotchy rash that starts on the face and spreads downward. Complications can include pneumonia, encephalitis, and death.',
    whoIsAtRisk: 'Anyone who is not vaccinated or has not had measles previously. Infants under 12 months (too young for the vaccine) and immunocompromised individuals who cannot be vaccinated are especially vulnerable.',
    currentNYSStatus: 'An active outbreak is ongoing in Rockland County with 12 confirmed cases as of June 6, 2026. Cases are linked to an unvaccinated community. Exposure sites have been identified; NYSDOH is conducting contact tracing. All cases in unvaccinated individuals.',
    actionItems: [
      { text: 'Verify your MMR vaccination status — 2 doses provide ~97% protection', type: 'vaccine' },
      { text: 'Adults born after 1957 with no documentation of immunity should get vaccinated', type: 'vaccine' },
      { text: 'Avoid the Rockland County outbreak area if unvaccinated', type: 'prevention' },
      { text: 'If you were exposed, call your provider before going in — measles is extremely contagious', type: 'treatment' },
    ],
    vaccineAvailable: true,
    vaccineInfo: 'The MMR vaccine (measles, mumps, rubella) is highly effective. Two doses provide approximately 97% protection. Available at NYSDOH clinics, pharmacies, and healthcare providers. Adults without documented immunity should be vaccinated.',
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'norovirus',
    name: 'Norovirus',
    categories: ['Foodborne', 'Contact-spread'],
    currentThreatLevel: 'low',
    nysTrend: 'stable',
    dataSource: 'realtime',
    dataSourceLabel: 'NYSDOH wastewater surveillance, updated weekly',
    shortDescription: 'Common cause of stomach illness; wastewater tracking shows low activity. Peaks in winter.',
    whatIsIt: 'Norovirus is the leading cause of vomiting and diarrhea in the US. It spreads easily and can affect anyone. Outbreaks are common in settings like schools, nursing homes, cruise ships, and restaurants.',
    howItSpreads: 'Spreads through contaminated food or water, touching contaminated surfaces, and direct contact with infected people. Extremely contagious — just a small number of viral particles can cause infection.',
    symptoms: 'Sudden onset of nausea, vomiting, diarrhea, and stomach cramps. Symptoms typically last 1–3 days. Dehydration is the main complication.',
    whoIsAtRisk: 'Everyone is susceptible. Young children, older adults, and immunocompromised individuals may experience more severe illness and complications from dehydration.',
    currentNYSStatus: 'Wastewater surveillance signals for norovirus are low. Norovirus activity in NYS typically peaks between November and April. No current outbreaks have been reported by NYSDOH.',
    actionItems: [
      { text: 'Wash hands thoroughly with soap and water — hand sanitizer is less effective against norovirus', type: 'prevention' },
      { text: 'Clean and disinfect contaminated surfaces immediately with bleach-based products', type: 'prevention' },
      { text: 'Stay home from work or school while sick and for 48 hours after symptoms resolve', type: 'prevention' },
      { text: 'Stay hydrated — drink plenty of fluids to prevent dehydration', type: 'treatment' },
    ],
    vaccineAvailable: false,
    lastUpdated: 'Jun 6, 2026',
  },
  {
    slug: 'hepatitis-a',
    name: 'Hepatitis A',
    categories: ['Foodborne', 'Vaccine-preventable'],
    currentThreatLevel: 'low',
    nysTrend: 'stable',
    dataSource: 'annual',
    dataSourceLabel: 'NYSDOH communicable disease annual report (2025 data)',
    shortDescription: 'Vaccine-preventable liver infection spread through contaminated food and water. Currently low activity in NYS.',
    whatIsIt: 'Hepatitis A is a viral liver infection caused by the hepatitis A virus. Unlike hepatitis B and C, it does not cause chronic disease. Most people recover fully, but illness can be severe.',
    howItSpreads: 'Spreads through consuming contaminated food or water, or through close contact with an infected person. Common sources include raw shellfish, produce, and contaminated water.',
    symptoms: 'Fatigue, nausea, stomach pain, jaundice (yellowing of the skin and eyes), dark urine, and diarrhea. Symptoms can last several weeks to months. Older adults typically experience more severe illness.',
    whoIsAtRisk: 'Travelers to areas with high hepatitis A rates, people who use injectable drugs, men who have sex with men, individuals with chronic liver disease, and those experiencing homelessness are at elevated risk.',
    currentNYSStatus: 'Hepatitis A activity in NYS is at baseline levels with no current outbreaks reported. Vaccination rates remain below target levels in some high-risk communities.',
    actionItems: [
      { text: 'Get vaccinated — the hepatitis A vaccine is highly effective and long-lasting', type: 'vaccine' },
      { text: 'Wash hands before preparing food and after using the bathroom', type: 'prevention' },
      { text: 'Avoid raw shellfish, especially oysters, from unknown sources', type: 'prevention' },
    ],
    vaccineAvailable: true,
    vaccineInfo: 'The hepatitis A vaccine provides long-term protection with 2 doses. Recommended for all children at age 1, travelers to certain countries, and high-risk groups. Available at pharmacies and healthcare providers statewide.',
    lastUpdated: 'Jun 6, 2026',
  },
];
