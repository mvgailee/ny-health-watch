
export interface ActionItem {
  text: string;
  type: 'vaccine' | 'prevention' | 'treatment' | 'monitor';
}

export interface DiseaseContent {
  slug: string;
  shortDescription: string;
  whatIsIt: string;
  howItSpreads: string;
  symptoms: string;
  whoIsAtRisk: string;
  actionItems: ActionItem[];
  vaccineInfo?: string;
}

export const diseaseContent: DiseaseContent[] = [
  {
    slug: 'covid-19',
    shortDescription: 'Respiratory illness caused by SARS-CoV-2; updated vaccines available annually.',
    whatIsIt: 'COVID-19 is a respiratory illness caused by SARS-CoV-2. Since its emergence in 2020, the virus has evolved into multiple variants. Updated vaccines are released each season targeting current circulating strains.',
    howItSpreads: 'Spreads through respiratory droplets and aerosols when an infected person breathes, talks, coughs, or sneezes. Transmission is highest in enclosed, poorly ventilated spaces.',
    symptoms: 'Fever, cough, fatigue, shortness of breath, loss of taste or smell, sore throat, and congestion. Symptoms range from mild to severe.',
    whoIsAtRisk: 'Anyone can contract COVID-19. Older adults, immunocompromised individuals, and those with underlying health conditions are at higher risk for severe illness.',
    actionItems: [
      { text: 'Get the updated COVID-19 vaccine if not recently vaccinated', type: 'vaccine' },
      { text: 'Consider masking in crowded indoor settings if you are high-risk', type: 'prevention' },
      { text: 'Test before gatherings with vulnerable individuals', type: 'prevention' },
      { text: 'Contact your provider promptly if symptoms develop — antivirals are available', type: 'treatment' },
    ],
    vaccineInfo: 'Updated annual vaccine recommended for everyone 6 months and older. Available at pharmacies, NYSDOH clinics, and most primary care providers statewide.',
  },
  {
    slug: 'influenza',
    shortDescription: 'Seasonal respiratory virus; vaccination each fall is the best protection.',
    whatIsIt: 'Influenza (the flu) is a contagious respiratory illness caused by influenza A and B viruses. It circulates primarily in fall and winter, typically peaking between December and February in New York.',
    howItSpreads: 'Spreads through respiratory droplets when infected people cough, sneeze, or talk. Less commonly spread by touching contaminated surfaces then touching your mouth, nose, or eyes.',
    symptoms: 'Sudden onset of fever, chills, muscle aches, headache, cough, sore throat, and fatigue. Unlike a cold, flu symptoms come on quickly and are typically more severe.',
    whoIsAtRisk: 'Children under 5, adults 65+, pregnant people, and those with chronic health conditions are at highest risk for serious complications including pneumonia.',
    actionItems: [
      { text: 'Get the annual flu vaccine when it becomes available in late summer', type: 'vaccine' },
      { text: 'Wash hands frequently during flu season (October–March)', type: 'prevention' },
      { text: 'Stay home when sick to avoid spreading flu to others', type: 'prevention' },
    ],
    vaccineInfo: 'Annual flu vaccine recommended for everyone 6 months and older. Updated each season; available starting September at pharmacies and clinics statewide.',
  },
  {
    slug: 'rsv',
    shortDescription: 'Common respiratory virus; vaccine now available for infants, older adults, and pregnant people.',
    whatIsIt: 'Respiratory Syncytial Virus (RSV) is a common respiratory virus that usually causes mild, cold-like symptoms. For infants and older adults, it can be serious, causing bronchiolitis and pneumonia.',
    howItSpreads: 'Spreads through respiratory droplets and by touching contaminated surfaces. RSV can survive on hard surfaces for several hours.',
    symptoms: 'Runny nose, decreased appetite, coughing, sneezing, fever, and wheezing. In infants, RSV may cause irritability, poor feeding, and labored breathing.',
    whoIsAtRisk: 'Infants under 12 months, especially premature babies, adults 60+, and immunocompromised individuals face the highest risk of severe illness.',
    actionItems: [
      { text: 'Ask your OB about the maternal RSV vaccine if pregnant', type: 'vaccine' },
      { text: 'Ask your pediatrician about RSV immunization for infants', type: 'vaccine' },
      { text: 'Wash hands frequently and avoid contact with sick individuals', type: 'prevention' },
    ],
    vaccineInfo: 'RSV vaccines are available for adults 60+ and pregnant people (to protect newborns). Nirsevimab (Beyfortus) monoclonal antibody is recommended for infants.',
  },
  {
    slug: 'norovirus',
    shortDescription: 'Highly contagious stomach bug; the most common cause of acute gastroenteritis.',
    whatIsIt: 'Norovirus is a highly contagious virus that causes vomiting and diarrhea. It is the leading cause of foodborne illness outbreaks in the United States and peaks in winter months.',
    howItSpreads: 'Spreads through contaminated food or water, direct contact with an infected person, or touching contaminated surfaces then touching your mouth. Just a small number of viral particles can cause infection.',
    symptoms: 'Nausea, vomiting, diarrhea, and stomach cramps that start suddenly. Symptoms typically last 1–3 days. Low-grade fever, headache, and body aches are common.',
    whoIsAtRisk: 'Everyone is susceptible. Young children, older adults, and immunocompromised individuals are at highest risk for serious dehydration.',
    actionItems: [
      { text: 'Wash hands with soap and water (hand sanitizer is not as effective against norovirus)', type: 'prevention' },
      { text: 'Stay home from work or school for at least 48 hours after symptoms resolve', type: 'prevention' },
      { text: 'Disinfect contaminated surfaces with a bleach-based cleaner', type: 'prevention' },
      { text: 'Stay hydrated — dehydration is the main complication', type: 'treatment' },
    ],
  },
  {
    slug: 'west-nile-virus',
    shortDescription: 'Mosquito-borne virus present in NYS each summer; most infections are mild.',
    whatIsIt: 'West Nile Virus (WNV) is a mosquito-borne virus present in New York State every summer. The vast majority of infected people experience no symptoms or mild flu-like illness. A small fraction develop serious neurological disease.',
    howItSpreads: 'Transmitted by the bite of infected Culex mosquitoes, which are most active from dusk to dawn. Not spread person-to-person. Rarely transmitted through blood transfusion, organ transplant, or from mother to baby.',
    symptoms: 'Most people (80%) have no symptoms. About 20% develop West Nile Fever: headache, body aches, fever, fatigue, and sometimes rash. Less than 1% develop serious neurological illness (meningitis or encephalitis).',
    whoIsAtRisk: 'Everyone is at risk of infection during mosquito season. Adults over 50 and immunocompromised individuals are at higher risk for severe neurological disease.',
    actionItems: [
      { text: 'Use EPA-registered insect repellent with DEET, picaridin, or oil of lemon eucalyptus', type: 'prevention' },
      { text: 'Wear long sleeves and pants during peak mosquito hours (dusk to dawn)', type: 'prevention' },
      { text: 'Eliminate standing water around your home — mosquitoes breed in as little as a bottle cap of water', type: 'prevention' },
      { text: 'Make sure window and door screens are intact', type: 'prevention' },
    ],
  },
  {
    slug: 'eastern-equine-encephalitis',
    shortDescription: 'Rare but serious mosquito-borne virus; case fatality rate is among the highest of any US mosquito-borne disease.',
    whatIsIt: 'Eastern Equine Encephalitis (EEE) is a rare but serious viral disease spread by mosquitoes. It is one of the most severe mosquito-borne diseases in the US, with a case fatality rate of roughly 30%. NYS monitors EEE activity each summer in mosquito and bird populations.',
    howItSpreads: 'Transmitted by the bite of infected mosquitoes, primarily Culiseta melanura in freshwater swamp habitats. Not spread person-to-person. Horses are also susceptible.',
    symptoms: 'Initial flu-like symptoms (fever, chills, malaise) followed rapidly by encephalitis: severe headache, high fever, stiff neck, and altered mental status. Onset is rapid; many survivors have significant neurological disability.',
    whoIsAtRisk: 'People who live near freshwater swamps, work outdoors, or recreate in wetland areas during mosquito season. Children, adults over 50, and immunocompromised individuals face the highest risk of severe disease.',
    actionItems: [
      { text: 'Use EPA-registered insect repellent whenever outdoors, especially near wetland areas', type: 'prevention' },
      { text: 'Wear long sleeves and pants at dawn and dusk when Culiseta mosquitoes are most active', type: 'prevention' },
      { text: 'Seek immediate medical care for any sudden severe headache with fever', type: 'treatment' },
      { text: 'Eliminate standing water around your home', type: 'prevention' },
    ],
  },
  {
    slug: 'lyme-disease',
    shortDescription: 'The most common tick-borne disease in NYS; treatable with antibiotics when caught early.',
    whatIsIt: 'Lyme disease is caused by the bacterium Borrelia burgdorferi and transmitted by the bite of blacklegged (deer) ticks. It is the most common vector-borne disease in New York State, with over 21,000 cases reported in 2024.',
    howItSpreads: 'Spread through the bite of infected blacklegged ticks. Ticks must typically be attached for 36–48 hours before transmission occurs. Peak transmission season is May through August when nymphal ticks are most active.',
    symptoms: 'Early: expanding circular rash (erythema migrans), fever, fatigue, headache, muscle and joint aches. Later stages (if untreated): joint pain and swelling, neurological symptoms, and rarely heart rhythm problems.',
    whoIsAtRisk: 'Anyone who spends time outdoors in wooded, brushy, or grassy areas in tick-endemic regions. Hudson Valley, Long Island, and Capital Region have the highest case rates in NYS.',
    actionItems: [
      { text: 'Do a full-body tick check after every outdoor activity in tick habitats', type: 'prevention' },
      { text: 'Use EPA-registered repellent containing DEET, picaridin, or IR3535 on skin and clothing', type: 'prevention' },
      { text: 'Remove attached ticks promptly with fine-tipped tweezers — grasp close to the skin', type: 'prevention' },
      { text: 'See a provider if you develop a rash or flu-like illness after a tick bite', type: 'treatment' },
    ],
  },
  {
    slug: 'anaplasmosis',
    shortDescription: 'Tick-borne bacterial infection; co-occurs with Lyme in high-risk areas of NYS.',
    whatIsIt: 'Anaplasmosis is caused by Anaplasma phagocytophilum and transmitted by blacklegged ticks — the same ticks that spread Lyme disease. NYS had 2,025 reported cases in 2024, with the highest burden in the Hudson Valley, Capital Region, and Long Island.',
    howItSpreads: 'Transmitted by the bite of infected blacklegged ticks. The tick must typically be attached for several hours before transmission can occur. Not spread person-to-person.',
    symptoms: 'Fever, headache, muscle aches, and malaise appearing 1–2 weeks after a tick bite. Unlike Lyme, anaplasmosis does not typically cause a characteristic rash. Can be severe in elderly or immunocompromised individuals.',
    whoIsAtRisk: 'Anyone in tick-endemic areas. Older adults and immunocompromised individuals are at higher risk for serious illness. People who spend time outdoors in wooded or grassy areas have the highest exposure risk.',
    actionItems: [
      { text: 'Use tick repellent and perform full-body tick checks after outdoor activities', type: 'prevention' },
      { text: 'Promptly remove attached ticks with fine-tipped tweezers', type: 'prevention' },
      { text: 'See a provider if you develop fever and flu-like symptoms after a tick bite', type: 'treatment' },
    ],
  },
  {
    slug: 'babesiosis',
    shortDescription: 'Tick-borne parasitic infection; can be serious for older adults and immunocompromised people.',
    whatIsIt: 'Babesiosis is caused by microscopic parasites that infect red blood cells, transmitted by blacklegged ticks. NYS had 748 cases in 2024, concentrated in Suffolk County and Long Island. In severe cases it can cause hemolytic anemia.',
    howItSpreads: 'Transmitted by the bite of infected blacklegged ticks. Can also be transmitted through blood transfusion. Peak season is June through August.',
    symptoms: 'Ranges from asymptomatic to severe. When symptomatic: fever, chills, sweats, fatigue, headache, body aches, nausea. Severe cases involve hemolytic anemia, low platelet count, and organ failure.',
    whoIsAtRisk: 'Adults over 50, people who have had their spleen removed, and immunocompromised individuals are at high risk for severe disease. Anyone in tick-endemic areas is at risk for infection.',
    actionItems: [
      { text: 'Use tick repellent and check for ticks after outdoor activities in endemic areas', type: 'prevention' },
      { text: 'Promptly remove attached ticks', type: 'prevention' },
      { text: 'Seek medical care for fever and fatigue following a tick bite, especially if you are immunocompromised', type: 'treatment' },
    ],
  },
  {
    slug: 'campylobacteriosis',
    shortDescription: 'The most common bacterial foodborne illness in NYS; usually from undercooked poultry.',
    whatIsIt: 'Campylobacteriosis is caused by Campylobacter bacteria and is the most common bacterial cause of diarrheal illness in New York State, with 7,622 cases in 2024. Most cases are individual and not part of outbreaks.',
    howItSpreads: 'Most commonly from handling or eating undercooked poultry. Also from unpasteurized milk, contaminated water, and contact with animals (especially puppies and kittens with diarrhea). Not easily spread person-to-person.',
    symptoms: 'Diarrhea (sometimes bloody), abdominal cramping, fever, and nausea, starting 2–5 days after exposure. Illness typically lasts about one week.',
    whoIsAtRisk: 'Anyone can get campylobacteriosis. Very young children, elderly adults, and immunocompromised individuals are at risk for more severe illness. Rare complications include Guillain-Barré syndrome.',
    actionItems: [
      { text: 'Cook poultry to an internal temperature of 165°F (74°C)', type: 'prevention' },
      { text: 'Wash hands thoroughly after handling raw poultry and before eating', type: 'prevention' },
      { text: 'Drink pasteurized milk and treated water only', type: 'prevention' },
      { text: 'Wash hands after contact with animals, especially puppies and kittens', type: 'prevention' },
    ],
  },
  {
    slug: 'salmonellosis',
    shortDescription: 'Common bacterial foodborne illness; peaks in summer months.',
    whatIsIt: 'Salmonellosis is caused by Salmonella bacteria and is a major cause of foodborne illness, with 3,974 cases reported in NYS in 2024. Cases peak in summer when food sits out longer and grilling is common.',
    howItSpreads: 'Primarily from undercooked eggs, poultry, and meat; contaminated produce; and contact with reptiles, amphibians, or live poultry. Can spread from person-to-person through poor hand hygiene.',
    symptoms: 'Diarrhea, fever, and stomach cramps beginning 6 hours to 6 days after exposure. Illness usually lasts 4–7 days. Severe cases may require hospitalization, especially if the infection spreads to the bloodstream.',
    whoIsAtRisk: 'Young children under 5, adults 65+, and immunocompromised individuals are at highest risk for severe illness. Anyone who eats contaminated food is at risk.',
    actionItems: [
      { text: 'Cook all poultry and eggs to proper internal temperatures', type: 'prevention' },
      { text: 'Refrigerate food promptly and avoid leaving it out at room temperature', type: 'prevention' },
      { text: 'Wash hands after contact with reptiles, amphibians, or live poultry', type: 'prevention' },
      { text: 'Avoid giving reptiles as pets to children under 5', type: 'prevention' },
    ],
  },
  {
    slug: 'legionellosis',
    shortDescription: 'Serious pneumonia from contaminated water systems; peaks in summer.',
    whatIsIt: 'Legionellosis includes two diseases caused by Legionella bacteria: Legionnaires\' disease (severe pneumonia) and Pontiac fever (milder flu-like illness). NYS reported 799 cases in 2024. Outbreaks are often linked to building water systems.',
    howItSpreads: 'People get infected by breathing in small water droplets containing Legionella bacteria. Sources include cooling towers, hot tubs, decorative fountains, and large building plumbing. Not spread person-to-person.',
    symptoms: 'Legionnaires\' disease: cough, shortness of breath, fever, muscle aches, and headache — a serious pneumonia requiring medical treatment. Pontiac fever: milder, flu-like illness without pneumonia, resolving in 2–5 days.',
    whoIsAtRisk: 'Adults over 50, smokers, heavy drinkers, those with chronic lung disease, and immunocompromised individuals are at highest risk for Legionnaires\' disease. Cases peak in summer and early fall.',
    actionItems: [
      { text: 'Building owners: maintain water systems per ASHRAE 188 and NYC/NYS regulations', type: 'prevention' },
      { text: 'If pneumonia symptoms develop especially after travel or a hotel stay, tell your doctor — it changes treatment', type: 'treatment' },
      { text: 'Legionnaires\' disease is treatable with antibiotics if diagnosed promptly', type: 'treatment' },
    ],
  },
  {
    slug: 'tuberculosis',
    shortDescription: 'Bacterial infection spread through the air; NYS has among the highest TB rates in the US.',
    whatIsIt: 'Tuberculosis (TB) is a serious bacterial infection caused by Mycobacterium tuberculosis, spread through the air when people with active TB disease cough or sneeze. NYS reported 1,089 cases in 2024 — among the highest rates nationally, concentrated in New York City.',
    howItSpreads: 'Spread through the air when a person with active TB disease in the lungs coughs, speaks, or sneezes. TB is not spread through casual contact, surfaces, or shared food. Latent TB infection does not spread to others.',
    symptoms: 'Active TB: persistent cough lasting 3+ weeks, coughing up blood or sputum, chest pain, weakness, weight loss, fever, night sweats. Latent TB has no symptoms.',
    whoIsAtRisk: 'People who have spent time with someone with active TB; immigrants from high-TB-burden countries; people experiencing homelessness; those with HIV or other conditions that weaken the immune system.',
    actionItems: [
      { text: 'Get tested for TB if you are at high risk or have been in contact with someone with active TB', type: 'monitor' },
      { text: 'If diagnosed with latent TB, complete the full course of preventive treatment to avoid future disease', type: 'treatment' },
      { text: 'If active TB is suspected, see a provider immediately — it is treatable with antibiotics', type: 'treatment' },
    ],
    vaccineInfo: 'BCG vaccine is used in some countries but is not routinely recommended in the US. It provides partial protection in infants and children in high-burden settings.',
  },
  {
    slug: 'pertussis',
    shortDescription: 'Whooping cough; a highly contagious respiratory illness resurging in NYS.',
    whatIsIt: 'Pertussis (whooping cough) is a highly contagious respiratory illness caused by Bordetella pertussis bacteria. NYS reported 2,875 cases in 2024 — above recent-year averages, reflecting a national uptick.',
    howItSpreads: 'Spreads very easily through respiratory droplets when an infected person coughs or sneezes. Unvaccinated infants are at highest risk; many are infected by adults who don\'t know they have pertussis.',
    symptoms: 'Starts like a cold (runny nose, mild cough, low fever) and progresses to severe coughing fits with a characteristic "whoop" sound when inhaling. Infants may not whoop but can have apnea (pauses in breathing). Cough can last months.',
    whoIsAtRisk: 'Infants under 12 months are at highest risk for severe disease and death. Older children, teens, and adults can get pertussis but typically have milder illness and spread it unknowingly.',
    actionItems: [
      { text: 'Ensure infants receive DTaP vaccine on schedule (2, 4, 6, 15-18 months, 4-6 years)', type: 'vaccine' },
      { text: 'Pregnant people should get Tdap during each pregnancy (27-36 weeks)', type: 'vaccine' },
      { text: 'Adults who have never received Tdap should get it, especially if around infants', type: 'vaccine' },
      { text: 'Isolate and seek treatment promptly if pertussis is suspected', type: 'treatment' },
    ],
    vaccineInfo: 'DTaP for children, Tdap booster for teens and adults. Particularly important for pregnant people and anyone in contact with infants.',
  },
  {
    slug: 'gonorrhea',
    shortDescription: 'Common bacterial STI; antibiotic-resistant strains are a growing concern.',
    whatIsIt: 'Gonorrhea is a common bacterial sexually transmitted infection caused by Neisseria gonorrhoeae. NYS reported 45,218 cases in 2024. Drug-resistant gonorrhea is an increasing public health concern — treatment now requires injectable ceftriaxone.',
    howItSpreads: 'Spreads through vaginal, anal, or oral sex with an infected person. Can infect the genitals, rectum, and throat. Can be passed from a pregnant person to a baby during childbirth.',
    symptoms: 'Many people have no symptoms. When present: burning during urination, unusual discharge, or rectal pain. Untreated gonorrhea can cause pelvic inflammatory disease (PID), infertility, and increased HIV risk.',
    whoIsAtRisk: 'Sexually active people of any age. Rates are highest among people aged 20–29. Men who have sex with men have elevated rates. Consistent condom use significantly reduces risk.',
    actionItems: [
      { text: 'Get tested regularly if you are sexually active with new or multiple partners', type: 'monitor' },
      { text: 'Use condoms correctly every time to reduce transmission risk', type: 'prevention' },
      { text: 'If diagnosed, complete the full course of antibiotics and notify recent sexual partners', type: 'treatment' },
    ],
  },
  {
    slug: 'chlamydia',
    shortDescription: 'The most common reportable STI in NYS; often causes no symptoms.',
    whatIsIt: 'Chlamydia is caused by Chlamydia trachomatis and is the most frequently reported infectious disease in New York State, with 102,175 cases in 2024. Because most infections cause no symptoms, routine screening is critical.',
    howItSpreads: 'Spreads through vaginal, anal, or oral sex. Can infect the genitals, rectum, and throat. Can be passed from pregnant person to newborn during delivery, potentially causing eye infections or pneumonia.',
    symptoms: 'Most people have no symptoms. When symptoms occur: unusual discharge, burning during urination, or pelvic pain. In women, untreated chlamydia can cause PID and damage to reproductive organs, potentially causing infertility.',
    whoIsAtRisk: 'Sexually active people, particularly those under 25. The CDC and NYSDOH recommend annual chlamydia testing for all sexually active women under 25 and older women with new or multiple partners.',
    actionItems: [
      { text: 'Get tested annually if you are a sexually active woman under 25 or have new/multiple partners', type: 'monitor' },
      { text: 'Use condoms to reduce risk of transmission', type: 'prevention' },
      { text: 'If diagnosed, complete antibiotics and notify all recent sexual partners', type: 'treatment' },
    ],
  },
  {
    slug: 'hepatitis-a',
    shortDescription: 'Liver infection spread through contaminated food and water; vaccine provides full protection.',
    whatIsIt: 'Hepatitis A is a highly contagious liver infection caused by the hepatitis A virus (HAV). NYS reported 111 cases in 2024. Unlike hepatitis B and C, hepatitis A does not cause chronic liver disease and most people recover fully.',
    howItSpreads: 'Spreads when a person unknowingly ingests microscopic amounts of feces from an infected person. This can occur through contaminated food or water, close contact, or sex. Outbreaks have been linked to homeless populations, drug use, and travel.',
    symptoms: 'Fatigue, nausea, stomach pain, loss of appetite, dark urine, and jaundice (yellowing of skin/eyes). Symptoms last a few weeks to several months. Older adults may have more severe illness.',
    whoIsAtRisk: 'Travelers to countries with high hepatitis A rates; men who have sex with men; people who use drugs; people experiencing homelessness; those with chronic liver disease or clotting disorders.',
    actionItems: [
      { text: 'Get vaccinated — two doses provide lifelong protection', type: 'vaccine' },
      { text: 'Wash hands thoroughly with soap and water after using the bathroom and before eating', type: 'prevention' },
      { text: 'When traveling internationally, drink bottled water and avoid raw foods in high-risk areas', type: 'prevention' },
    ],
    vaccineInfo: 'Two-dose hepatitis A vaccine provides lifelong protection. Recommended for all children at age 1, travelers to endemic areas, and people at elevated risk.',
  },
  {
    slug: 'measles',
    shortDescription: 'Highly contagious viral disease; almost entirely preventable by the MMR vaccine.',
    whatIsIt: 'Measles is caused by the measles virus (morbillivirus) and is one of the most contagious infectious diseases known. A single infected person can infect up to 18 others in an unvaccinated population. NYS has experienced outbreaks in communities with low vaccination rates.',
    howItSpreads: 'Airborne and spreads through respiratory droplets when an infected person coughs or sneezes. The virus can remain in the air for up to two hours after an infected person has left the room. Contagious 4 days before and 4 days after the rash appears.',
    symptoms: 'High fever, cough, runny nose, red eyes (conjunctivitis), and a characteristic rash that starts at the hairline and spreads downward. Koplik spots (small white spots inside the mouth) are a diagnostic hallmark.',
    whoIsAtRisk: 'Unvaccinated individuals of any age. Infants too young to be vaccinated and immunocompromised individuals who cannot receive the vaccine depend on community immunity for protection.',
    actionItems: [
      { text: 'Verify your MMR vaccination status — two doses are needed for full protection', type: 'vaccine' },
      { text: 'Contact your provider immediately if you may have been exposed and are unvaccinated', type: 'monitor' },
      { text: 'Keep children home from school if measles is confirmed in your community', type: 'prevention' },
    ],
    vaccineInfo: 'Two doses of the MMR vaccine are 97% effective against measles. First dose at 12-15 months; second dose at 4-6 years. Adults who are unsure of their vaccination history should get vaccinated.',
  },
];

export const diseaseContentBySlug = Object.fromEntries(
  diseaseContent.map(d => [d.slug, d])
) as Record<string, DiseaseContent>;
