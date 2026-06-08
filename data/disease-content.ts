// disease-content.ts
// Static educational content for all tracked diseases.
// Dynamic data (levels, trends, case counts) comes from data/pipeline/ via lib/data-loader.ts.
// Sources: CDC disease pages and NYSDOH Communicable Disease Fact Sheets (health.ny.gov/diseases/communicable/)

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

  // ── TIER A ────────────────────────────────────────────────────────────────

  {
    slug: 'covid-19',
    shortDescription: 'Respiratory illness caused by SARS-CoV-2; updated vaccines available annually.',
    whatIsIt: 'COVID-19 is a respiratory illness caused by SARS-CoV-2. Since its emergence in 2020, the virus has evolved into multiple variants. Updated vaccines are released each season targeting current circulating strains.',
    howItSpreads: 'Spreads through respiratory droplets and aerosols when an infected person breathes, talks, coughs, or sneezes. Transmission is highest in enclosed, poorly ventilated spaces.',
    symptoms: 'Fever, cough, fatigue, shortness of breath, loss of taste or smell, sore throat, and congestion. Symptoms range from mild to severe; some people develop Long COVID with prolonged symptoms.',
    whoIsAtRisk: 'Anyone can contract COVID-19. Older adults, immunocompromised individuals, and those with underlying health conditions face the highest risk of severe illness and hospitalization.',
    actionItems: [
      { text: 'Get the updated COVID-19 vaccine if not recently vaccinated', type: 'vaccine' },
      { text: 'Consider masking in crowded indoor settings if you are high-risk', type: 'prevention' },
      { text: 'Test before gatherings with vulnerable individuals', type: 'prevention' },
      { text: 'Contact your provider promptly if symptoms develop — antivirals are available and most effective early', type: 'treatment' },
    ],
    vaccineInfo: 'Updated annual vaccine recommended for everyone 6 months and older. Available at pharmacies, NYSDOH clinics, and most primary care providers statewide.',
  },

  {
    slug: 'influenza',
    shortDescription: 'Seasonal respiratory virus; annual vaccination each fall is the best protection.',
    whatIsIt: 'Influenza (the flu) is a contagious respiratory illness caused by influenza A and B viruses. It circulates primarily in fall and winter, typically peaking between December and February in New York.',
    howItSpreads: 'Spreads through respiratory droplets when infected people cough, sneeze, or talk. Less commonly spread by touching contaminated surfaces then touching the mouth, nose, or eyes. Contagious from 1 day before symptoms until about 5–7 days after.',
    symptoms: 'Sudden onset of fever, chills, muscle aches, headache, cough, sore throat, and fatigue. Unlike a cold, flu symptoms come on quickly and are typically more severe. Vomiting and diarrhea can occur, especially in children.',
    whoIsAtRisk: 'Children under 5, adults 65+, pregnant people, and those with chronic health conditions are at highest risk for serious complications including pneumonia and hospitalization.',
    actionItems: [
      { text: 'Get the annual flu vaccine when it becomes available in late summer — it takes about 2 weeks to take effect', type: 'vaccine' },
      { text: 'Wash hands frequently and avoid touching your face during flu season', type: 'prevention' },
      { text: 'Stay home when sick to avoid spreading flu to others', type: 'prevention' },
      { text: 'Ask your provider about antiviral medications (oseltamivir/Tamiflu) — most effective within 48 hours of symptoms', type: 'treatment' },
    ],
    vaccineInfo: 'Annual flu vaccine recommended for everyone 6 months and older. Updated each season; available starting September at pharmacies and clinics statewide. High-dose and adjuvanted formulations available for adults 65+.',
  },

  {
    slug: 'rsv',
    shortDescription: 'Common respiratory virus; vaccines and immunizations now available for infants, older adults, and pregnant people.',
    whatIsIt: 'Respiratory Syncytial Virus (RSV) is a common respiratory virus that usually causes mild, cold-like symptoms in healthy adults. For infants and older adults, it can cause serious illness including bronchiolitis and pneumonia. RSV is the leading cause of infant hospitalization in the United States.',
    howItSpreads: 'Spreads through respiratory droplets when an infected person coughs or sneezes, and by touching contaminated surfaces then touching the face. RSV can survive on hard surfaces for several hours.',
    symptoms: 'Runny nose, decreased appetite, coughing, sneezing, fever, and wheezing. In infants, RSV may cause irritability, poor feeding, and labored breathing with visible chest retractions.',
    whoIsAtRisk: 'Infants under 12 months (especially premature babies), adults 60+, and immunocompromised individuals face the highest risk of severe illness requiring hospitalization.',
    actionItems: [
      { text: 'Pregnant people should ask their OB about the maternal RSV vaccine (Abrysvo) between weeks 32–36 — it protects newborns', type: 'vaccine' },
      { text: 'Ask your pediatrician about nirsevimab (Beyfortus) immunization for infants and toddlers', type: 'vaccine' },
      { text: 'Adults 60+ should ask their provider about RSV vaccination (Abrysvo or Arexvy)', type: 'vaccine' },
      { text: 'Wash hands frequently and avoid contact with sick individuals during RSV season (fall through spring)', type: 'prevention' },
    ],
    vaccineInfo: 'RSV vaccines are available for adults 60+ (Abrysvo, Arexvy) and pregnant people to protect newborns (Abrysvo). Nirsevimab (Beyfortus) monoclonal antibody is recommended for infants and toddlers up to 24 months.',
  },

  {
    slug: 'norovirus',
    shortDescription: 'Highly contagious stomach bug; the most common cause of acute gastroenteritis in the US.',
    whatIsIt: 'Norovirus is a highly contagious virus that causes vomiting and diarrhea. It is the leading cause of foodborne illness outbreaks in the United States, responsible for about 21 million illnesses annually. It peaks in winter months but can occur year-round.',
    howItSpreads: 'Spreads through contaminated food or water, direct contact with an infected person, or touching contaminated surfaces then touching the mouth. Just 18 viral particles can cause infection. Infected people are most contagious while sick and for the first day or two after recovering.',
    symptoms: 'Nausea, vomiting, diarrhea, and stomach cramping that start suddenly, typically 12–48 hours after exposure. Symptoms usually last 1–3 days. Low-grade fever, headache, and body aches are common.',
    whoIsAtRisk: 'Everyone is susceptible. Young children, older adults, and immunocompromised individuals are at highest risk for serious dehydration, which is the primary complication.',
    actionItems: [
      { text: 'Wash hands with soap and water — hand sanitizer is NOT effective against norovirus', type: 'prevention' },
      { text: 'Stay home from work or school for at least 48 hours after symptoms fully resolve', type: 'prevention' },
      { text: 'Disinfect contaminated surfaces with a bleach-based cleaner (1 tablespoon bleach per gallon of water)', type: 'prevention' },
      { text: 'Stay hydrated with water, broth, or oral rehydration solutions — dehydration is the main complication', type: 'treatment' },
    ],
  },

  {
    slug: 'west-nile-virus',
    shortDescription: 'Mosquito-borne virus present in NYS every summer; most infections are mild or asymptomatic.',
    whatIsIt: 'West Nile Virus (WNV) is transmitted by infected Culex mosquitoes and is present in New York State every summer. NYS reported 69 cases in 2024. The vast majority of infected people have no symptoms or mild illness; a small fraction develop serious neurological disease.',
    howItSpreads: 'Transmitted by the bite of infected Culex mosquitoes, which are most active from dusk to dawn. Not spread person-to-person. Rarely transmitted through blood transfusion, organ transplant, or from pregnant person to baby.',
    symptoms: 'Most people (about 80%) have no symptoms. About 1 in 5 develop West Nile Fever: headache, body aches, fever, fatigue, and sometimes rash. Less than 1% develop serious neurological illness — meningitis, encephalitis, or acute flaccid paralysis.',
    whoIsAtRisk: 'Everyone is at risk during mosquito season. Adults over 50 and immunocompromised individuals are at significantly higher risk for developing severe neurological disease.',
    actionItems: [
      { text: 'Use EPA-registered insect repellent containing DEET, picaridin, IR3535, or oil of lemon eucalyptus', type: 'prevention' },
      { text: 'Wear long sleeves and pants during peak mosquito hours (dusk to dawn)', type: 'prevention' },
      { text: 'Eliminate standing water around your home — mosquitoes can breed in as little as a bottle cap of water', type: 'prevention' },
      { text: 'Make sure window and door screens are in good repair', type: 'prevention' },
    ],
  },

  {
    slug: 'eastern-equine-encephalitis',
    shortDescription: 'Rare but serious mosquito-borne virus; one of the highest fatality rates of any US mosquito-borne disease.',
    whatIsIt: 'Eastern Equine Encephalitis (EEE) is a rare but serious viral disease spread by infected mosquitoes. It has one of the highest mortality rates of any mosquito-borne disease in the US — approximately 30% of cases are fatal, and many survivors have significant permanent neurological disability. NYSDOH monitors EEE activity in mosquito and bird populations across the state each summer.',
    howItSpreads: 'Transmitted by the bite of infected mosquitoes, primarily Culiseta melanura in freshwater swamp habitats. Not spread person-to-person. Horses are also highly susceptible and often serve as sentinel animals for human risk.',
    symptoms: 'Onset is rapid. Initial flu-like symptoms (fever, chills, malaise) are followed quickly by severe headache, high fever, stiff neck, and altered mental status. Progression to coma can occur within days.',
    whoIsAtRisk: 'People who live near freshwater swamps or wetlands, work or recreate outdoors in these habitats, and anyone who is immunocompromised or over 50 faces elevated risk of severe disease.',
    actionItems: [
      { text: 'Use EPA-registered insect repellent whenever outdoors, especially near wetland or swamp areas', type: 'prevention' },
      { text: 'Wear long sleeves and pants during dusk and dawn when Culiseta mosquitoes are most active', type: 'prevention' },
      { text: 'Seek immediate emergency care for any sudden severe headache combined with high fever', type: 'treatment' },
      { text: 'Eliminate standing water around your property', type: 'prevention' },
    ],
  },

  // ── TICK-BORNE ────────────────────────────────────────────────────────────

  {
    slug: 'lyme-disease',
    shortDescription: 'The most common tick-borne disease in NYS; highly treatable with antibiotics when caught early.',
    whatIsIt: 'Lyme disease is caused by the bacterium Borrelia burgdorferi and transmitted by the bite of blacklegged (deer) ticks. It is the most common vector-borne disease in New York State, with over 21,000 cases reported in 2024. Case counts are highest in the Hudson Valley, Long Island, and Capital Region.',
    howItSpreads: 'Spread through the bite of infected blacklegged ticks. The tick must typically be attached for 36–48 hours before the bacteria can be transmitted. Peak transmission season is May through August when nymphal ticks — about the size of a poppy seed — are most active.',
    symptoms: 'Early Lyme (3–30 days after bite): expanding circular rash (erythema migrans), fever, fatigue, headache, and muscle and joint aches. If untreated, later stages can cause joint pain and swelling, neurological symptoms (facial palsy, meningitis), and rarely heart rhythm problems.',
    whoIsAtRisk: 'Anyone who spends time outdoors in wooded, brushy, or grassy areas in tick-endemic regions of NYS. Hudson Valley, Long Island, and Capital Region residents have the highest exposure risk.',
    actionItems: [
      { text: 'Do a full-body tick check after every outdoor activity in tick habitat, including on children and pets', type: 'prevention' },
      { text: 'Use EPA-registered repellent containing DEET, picaridin, or IR3535 on skin; permethrin on clothing', type: 'prevention' },
      { text: 'Remove attached ticks promptly with fine-tipped tweezers — grasp close to the skin and pull upward steadily', type: 'prevention' },
      { text: 'See a provider if you develop a rash or flu-like illness after a tick bite — early treatment with doxycycline is highly effective', type: 'treatment' },
    ],
  },

  {
    slug: 'anaplasmosis',
    shortDescription: 'Tick-borne bacterial infection spread by blacklegged ticks; co-occurs with Lyme in high-risk areas.',
    whatIsIt: 'Anaplasmosis is caused by Anaplasma phagocytophilum and transmitted by blacklegged deer ticks — the same ticks that spread Lyme disease. NYS had 2,025 cases in 2024, concentrated in the Hudson Valley, Capital Region, and Long Island. It can be serious if not treated promptly.',
    howItSpreads: 'Transmitted by the bite of infected blacklegged ticks. The tick must be attached for several hours before bacteria can be transmitted. Active from April through October; peak risk in late spring and early summer.',
    symptoms: 'Fever, severe headache, muscle aches, and malaise appearing 1–2 weeks after a tick bite. Unlike Lyme disease, a rash is NOT typical with anaplasmosis. Abnormal lab findings include low white blood cell count, low platelet count, and elevated liver enzymes.',
    whoIsAtRisk: 'Anyone in tick-endemic areas. Older adults, immunocompromised individuals, and people with certain underlying conditions are at higher risk for severe illness. Anaplasmosis can be life-threatening without prompt treatment.',
    actionItems: [
      { text: 'Use tick repellent and perform full-body tick checks after outdoor activities in wooded areas', type: 'prevention' },
      { text: 'Remove attached ticks promptly with fine-tipped tweezers', type: 'prevention' },
      { text: 'Seek medical care promptly for fever and flu-like symptoms after a tick bite — tell your provider about the exposure', type: 'treatment' },
      { text: 'Treatment with doxycycline is highly effective; do not wait for lab confirmation before starting treatment', type: 'treatment' },
    ],
  },

  {
    slug: 'babesiosis',
    shortDescription: 'Tick-borne parasitic infection; can cause life-threatening hemolytic anemia in vulnerable individuals.',
    whatIsIt: 'Babesiosis is caused by Babesia microti, a microscopic parasite that infects red blood cells, transmitted by blacklegged ticks. NYS had 748 cases in 2024, concentrated in Suffolk County and the eastern end of Long Island. Severe cases involve hemolytic anemia requiring hospitalization.',
    howItSpreads: 'Transmitted primarily by the bite of infected blacklegged ticks. Can also be transmitted through blood transfusion — babesiosis is the most common transfusion-transmitted parasitic infection in the US. Peak season is June through August.',
    symptoms: 'Ranges from asymptomatic to severe. When symptomatic: fever, chills, sweats, fatigue, headache, and body aches similar to malaria. Severe disease involves hemolytic anemia (breakdown of red blood cells), low platelet count, and can progress to organ failure.',
    whoIsAtRisk: 'Adults over 50, people without a spleen, and immunocompromised individuals are at high risk for severe and potentially life-threatening disease. People on Long Island face the highest regional risk.',
    actionItems: [
      { text: 'Use tick repellent and check thoroughly for ticks after outdoor activities, especially on Long Island', type: 'prevention' },
      { text: 'Remove attached ticks promptly', type: 'prevention' },
      { text: 'Seek medical care urgently for fever and flu-like symptoms after tick exposure if you are immunocompromised or asplenic', type: 'treatment' },
      { text: 'If you have had babesiosis, inform healthcare providers and blood banks before any blood donation', type: 'monitor' },
    ],
  },

  {
    slug: 'ehrlichiosis',
    shortDescription: 'Tick-borne bacterial infection spread by the lone star tick; treated with doxycycline.',
    whatIsIt: 'Ehrlichiosis (human monocytic ehrlichiosis) is caused by Ehrlichia chaffeensis and spread by the lone star tick. In NYS, cases are reported primarily on Long Island and in the Hudson Valley. NYS had 133 cases in 2024. It is closely related to anaplasmosis and treated the same way.',
    howItSpreads: 'Transmitted by the bite of infected lone star ticks. Active from April through October. Not spread person-to-person.',
    symptoms: 'Fever, headache, muscle aches, weakness, and fatigue beginning 1–2 weeks after the bite of an infected tick. A rash is uncommon. Lab findings often include low white blood cell count, low platelets, and elevated liver enzymes.',
    whoIsAtRisk: 'Anyone spending time outdoors in tick-endemic areas. Older adults and immunocompromised individuals are at higher risk for serious illness. Ehrlichiosis can occasionally be fatal if untreated.',
    actionItems: [
      { text: 'Use tick repellent (DEET, picaridin) and check for ticks after outdoor activities', type: 'prevention' },
      { text: 'Remove attached ticks promptly with fine-tipped tweezers', type: 'prevention' },
      { text: 'See a provider promptly for fever after a tick bite — treatment with doxycycline is effective but should start early', type: 'treatment' },
    ],
  },

  {
    slug: 'rocky-mountain-spotted-fever',
    shortDescription: 'Potentially fatal tick-borne infection; requires immediate treatment — do not wait for rash to appear.',
    whatIsIt: 'Rocky Mountain Spotted Fever (RMSF) is caused by Rickettsia rickettsii, transmitted primarily by the American dog tick in the eastern US. Despite its name, it occurs across the United States. NYS had 12 cases in 2024. It is one of the most severe tick-borne diseases in the US and can be fatal within days if not treated immediately.',
    howItSpreads: 'Transmitted by the bite of infected ticks, primarily the American dog tick (Dermacentor variabilis) in NYS. The tick must be attached for several hours before transmission can occur. Not spread person-to-person.',
    symptoms: 'Sudden high fever, headache, and muscle pain beginning 2–14 days after a tick bite. A characteristic spotted rash usually appears 2–5 days after fever, starting on wrists and ankles and spreading to the trunk. The rash may be absent or appear late — do not wait for it before seeking treatment.',
    whoIsAtRisk: 'Anyone spending time in tick habitat. Children under 10 are at higher risk for severe disease. The case fatality rate can reach 20–25% without treatment.',
    actionItems: [
      { text: 'Use tick repellent and check for ticks after every outdoor activity', type: 'prevention' },
      { text: 'Remove attached ticks promptly', type: 'prevention' },
      { text: 'Seek emergency care immediately for sudden high fever and headache after a tick bite — do not wait for rash', type: 'treatment' },
      { text: 'Doxycycline is the only recommended treatment — it must be started immediately based on clinical suspicion', type: 'treatment' },
    ],
  },

  {
    slug: 'west-nile-fever',
    shortDescription: 'Milder form of West Nile Virus infection; self-limiting illness in otherwise healthy adults.',
    whatIsIt: 'West Nile Fever is the mild symptomatic form of West Nile Virus infection. About 1 in 5 people infected with WNV develop this febrile illness. NYS had 32 cases in 2024. It is distinct from the more severe neuroinvasive form (meningitis, encephalitis) which occurs in fewer than 1% of infections.',
    howItSpreads: 'Transmitted by the bite of infected Culex mosquitoes, most active at dusk and dawn during summer and fall. Not spread person-to-person.',
    symptoms: 'Fever, headache, body aches, fatigue, and sometimes a skin rash or swollen lymph nodes. Symptoms usually last 3–6 days and resolve on their own without treatment.',
    whoIsAtRisk: 'Anyone can develop West Nile Fever after mosquito exposure. Adults over 50 and immunocompromised individuals are at higher risk that their infection will progress to the more serious neuroinvasive disease.',
    actionItems: [
      { text: 'Use EPA-registered insect repellent when outdoors during mosquito season', type: 'prevention' },
      { text: 'Wear long sleeves and pants at dusk and dawn', type: 'prevention' },
      { text: 'Eliminate standing water around your home to reduce mosquito breeding', type: 'prevention' },
      { text: 'Seek medical care if symptoms are severe or include neurological changes such as confusion or weakness', type: 'treatment' },
    ],
  },

  {
    slug: 'malaria',
    shortDescription: 'Serious parasitic disease; almost all NYS cases are travel-associated — prevention before travel is essential.',
    whatIsIt: 'Malaria is caused by Plasmodium parasites transmitted by infected Anopheles mosquitoes. NYS had 320 cases in 2024, nearly all in travelers returning from sub-Saharan Africa, South Asia, and other endemic regions. There is no local mosquito transmission of malaria in New York State.',
    howItSpreads: 'Transmitted through the bite of infected female Anopheles mosquitoes, which typically bite between dusk and dawn. Cannot be spread through casual contact. Rarely transmitted through blood transfusion or from mother to newborn.',
    symptoms: 'Cyclical fever, chills, and sweating appearing 10 days to 4 weeks after exposure. Other symptoms include headache, muscle aches, nausea, and fatigue. Severe malaria can cause organ failure, seizures, and death, particularly with Plasmodium falciparum.',
    whoIsAtRisk: 'Travelers to sub-Saharan Africa, Papua New Guinea, and parts of South and Southeast Asia face the highest risk. People without prior immunity — including US residents — are especially vulnerable to severe disease.',
    actionItems: [
      { text: 'See a travel medicine specialist before any trip to malaria-endemic areas to get the appropriate prophylactic medication', type: 'prevention' },
      { text: 'Use insect repellent (DEET) and permethrin-treated clothing; sleep under bed nets', type: 'prevention' },
      { text: 'Seek care immediately if fever develops during or after travel to an endemic area — tell your provider where you traveled', type: 'treatment' },
    ],
    vaccineInfo: 'The RTS,S/AS01E (Mosquirix) and R21/Matrix-M vaccines are approved for young children in endemic countries. The RTS,S vaccine is also available for some travelers; consult a travel medicine specialist.',
  },

  {
    slug: 'dengue-fever',
    shortDescription: 'Mosquito-borne viral infection; all NYS cases are travel-associated — now the world\'s fastest-spreading vector-borne disease.',
    whatIsIt: 'Dengue fever is caused by four dengue virus serotypes and transmitted by Aedes aegypti and Aedes albopictus mosquitoes. NYS had 352 cases in 2024, all travel-associated. Global dengue incidence has increased dramatically, making it the world\'s fastest-spreading mosquito-borne disease. There is no local transmission in New York State.',
    howItSpreads: 'Transmitted through the bite of infected Aedes mosquitoes, which typically bite during daytime hours. Not spread person-to-person. A person infected with one dengue serotype can be infected again by a different serotype — repeat infection increases the risk of severe disease.',
    symptoms: 'High fever (40°C/104°F), severe headache, pain behind the eyes, severe joint and muscle pain (historically called "breakbone fever"), rash, and mild bleeding. Severe dengue (dengue hemorrhagic fever) can cause plasma leaking, severe bleeding, and shock.',
    whoIsAtRisk: 'Travelers to tropical and subtropical regions, especially Central and South America, the Caribbean, Southeast Asia, and South Asia. Prior dengue infection with a different serotype increases risk of severe disease.',
    actionItems: [
      { text: 'Use insect repellent with DEET or picaridin when traveling to dengue-endemic areas; Aedes mosquitoes bite during the day', type: 'prevention' },
      { text: 'Wear long-sleeved shirts and pants when possible', type: 'prevention' },
      { text: 'Seek medical care promptly for high fever during or after travel to endemic areas', type: 'treatment' },
      { text: 'Avoid aspirin and ibuprofen if dengue is suspected — these can worsen bleeding risk', type: 'treatment' },
    ],
    vaccineInfo: 'Dengvaxia vaccine is FDA-approved for children aged 9–16 who have had a confirmed prior dengue infection and live in endemic areas. It is not recommended for travelers who have never had dengue.',
  },

  {
    slug: 'chikungunya',
    shortDescription: 'Mosquito-borne viral infection causing intense joint pain; all NYS cases are travel-associated.',
    whatIsIt: 'Chikungunya is caused by an alphavirus transmitted by Aedes aegypti and Aedes albopictus mosquitoes. The name means "to walk bent over" in the Makonde language, reflecting the debilitating joint pain it causes. NYS had 13 cases in 2024, all travel-associated. Cases have been reported from the Caribbean, Central and South America, Africa, Asia, and Europe.',
    howItSpreads: 'Transmitted through the bite of infected Aedes mosquitoes, which bite primarily during the day. Not spread person-to-person.',
    symptoms: 'Abrupt onset of high fever and severe, often incapacitating joint pain affecting multiple joints simultaneously. Headache, muscle pain, joint swelling, rash, and fatigue are common. Joint pain can persist for weeks, months, or occasionally years after the acute infection.',
    whoIsAtRisk: 'Travelers to the Caribbean, Central and South America, Africa, and Asia. Older adults and people with underlying joint conditions may experience more prolonged joint pain.',
    actionItems: [
      { text: 'Use DEET-based repellent and wear protective clothing when traveling to endemic areas — Aedes mosquitoes bite during the day', type: 'prevention' },
      { text: 'Stay in air-conditioned or well-screened accommodations when possible', type: 'prevention' },
      { text: 'For joint pain relief, use acetaminophen — avoid NSAIDs initially until dengue can be ruled out', type: 'treatment' },
    ],
  },

  // ── GASTROINTESTINAL ──────────────────────────────────────────────────────

  {
    slug: 'campylobacteriosis',
    shortDescription: 'The most common bacterial cause of foodborne illness in NYS; usually from undercooked poultry.',
    whatIsIt: 'Campylobacteriosis is caused by Campylobacter bacteria (most commonly C. jejuni) and is the most frequently reported bacterial foodborne illness in New York State, with 7,622 cases in 2024. Most cases are isolated and not part of outbreaks. A rare complication is Guillain-Barré syndrome, a form of temporary paralysis.',
    howItSpreads: 'Primarily from handling or eating undercooked poultry. Also from unpasteurized milk or juice, contaminated water, and contact with infected animals — especially puppies and kittens with diarrhea. Does not spread easily from person-to-person.',
    symptoms: 'Diarrhea (sometimes bloody), abdominal cramping, fever, and nausea beginning 2–5 days after exposure. Most illness lasts about one week and resolves without treatment in healthy individuals.',
    whoIsAtRisk: 'Anyone who handles or eats undercooked poultry. Very young children, elderly adults, and immunocompromised individuals are at risk for more severe illness.',
    actionItems: [
      { text: 'Cook all poultry to an internal temperature of 165°F (74°C); use a meat thermometer', type: 'prevention' },
      { text: 'Wash hands, cutting boards, and utensils thoroughly after contact with raw poultry', type: 'prevention' },
      { text: 'Drink only pasteurized milk and treated water', type: 'prevention' },
      { text: 'Wash hands after contact with animals, especially puppies and kittens with diarrhea', type: 'prevention' },
    ],
  },

  {
    slug: 'salmonellosis',
    shortDescription: 'A major cause of foodborne illness; peaks in summer and linked to eggs, poultry, and reptile contact.',
    whatIsIt: 'Salmonellosis is caused by non-typhoidal Salmonella bacteria and is one of the most common causes of foodborne illness in the US. NYS had 3,974 cases in 2024. Cases increase in summer when food sits out at warmer temperatures and outdoor grilling is common.',
    howItSpreads: 'Primarily from eating undercooked eggs, poultry, and meat; contaminated produce; and contact with reptiles (turtles, lizards, snakes), amphibians, or live poultry — which can carry Salmonella without appearing sick.',
    symptoms: 'Diarrhea, fever, and stomach cramps beginning 6 hours to 6 days after exposure. Illness usually lasts 4–7 days and resolves without treatment. Severe cases — more common in young children and older adults — may require hospitalization if the infection spreads to the bloodstream.',
    whoIsAtRisk: 'Young children under 5, adults 65+, and immunocompromised individuals face the highest risk of severe illness. Children under 5 should not have turtles, lizards, or other reptiles as pets.',
    actionItems: [
      { text: 'Cook poultry to 165°F, ground beef to 160°F, and eggs until yolks are firm', type: 'prevention' },
      { text: 'Refrigerate food promptly; do not leave food at room temperature for more than 2 hours (1 hour if above 90°F)', type: 'prevention' },
      { text: 'Wash hands with soap and water after contact with reptiles, amphibians, or live poultry', type: 'prevention' },
      { text: 'Do not give reptiles or amphibians as pets to children under 5 or households with immunocompromised members', type: 'prevention' },
    ],
  },

  {
    slug: 'shigellosis',
    shortDescription: 'Highly contagious bacterial diarrheal illness; spreads easily from person-to-person.',
    whatIsIt: 'Shigellosis is caused by Shigella bacteria and is notable for how easily it spreads — just 10 to 200 bacteria are enough to cause infection. NYS had 2,938 cases in 2024. Drug-resistant Shigella strains are an increasing public health concern, limiting treatment options.',
    howItSpreads: 'Spreads through the fecal-oral route — when someone ingests tiny amounts of feces from an infected person. This can happen through direct contact, contaminated food or water, or touching contaminated surfaces. Common in childcare settings, group homes, and among travelers.',
    symptoms: 'Diarrhea (often containing blood or mucus), fever, and stomach cramps beginning 1–2 days after exposure. Illness usually lasts 5–7 days. Severe dehydration can occur, especially in young children.',
    whoIsAtRisk: 'Young children aged 2–4, caregivers of young children, international travelers, and men who have sex with men. People in congregate settings (daycares, nursing homes) face elevated exposure risk.',
    actionItems: [
      { text: 'Wash hands thoroughly with soap and water after using the toilet, changing diapers, and before preparing food', type: 'prevention' },
      { text: 'Do not prepare food for others while sick with diarrhea', type: 'prevention' },
      { text: 'Avoid swallowing water when swimming in pools, lakes, or ponds', type: 'prevention' },
      { text: 'Seek medical care for bloody diarrhea, high fever, or signs of dehydration — antibiotic treatment may be needed', type: 'treatment' },
    ],
  },

  {
    slug: 'e-coli-stec',
    shortDescription: 'Shiga toxin-producing E. coli; can cause life-threatening kidney failure in young children.',
    whatIsIt: 'Shiga toxin-producing E. coli (STEC), including the well-known O157:H7 strain, produces a powerful toxin that can damage the intestinal lining and kidneys. NYS had 1,775 cases in 2024. The most serious complication — hemolytic uremic syndrome (HUS) — causes acute kidney failure and is the leading cause of kidney failure in children.',
    howItSpreads: 'Primarily through contaminated food: undercooked ground beef, raw milk, unpasteurized apple juice/cider, and contaminated raw produce (especially sprouts). Also spreads through contact with infected animals at farms, petting zoos, and fairs, and through contaminated water.',
    symptoms: 'Severe stomach cramps, diarrhea (often bloody), and vomiting beginning 3–4 days after exposure. Fever is usually mild or absent. Most people recover in 5–7 days. Watch for signs of HUS: decreased urination, pale skin, and extreme fatigue starting about a week after diarrhea begins.',
    whoIsAtRisk: 'Young children under 5, elderly adults, and immunocompromised individuals are at highest risk for developing HUS. Children who develop HUS require hospitalization and sometimes dialysis.',
    actionItems: [
      { text: 'Cook ground beef to 160°F internal temperature; never eat pink ground beef', type: 'prevention' },
      { text: 'Avoid unpasteurized milk, juice, and cider', type: 'prevention' },
      { text: 'Wash hands after contact with animals at fairs, farms, or petting zoos', type: 'prevention' },
      { text: 'Seek care immediately if diarrhea is bloody, or if a child develops decreased urination or appears pale and tired after a diarrheal illness', type: 'treatment' },
    ],
  },

  {
    slug: 'cryptosporidiosis',
    shortDescription: 'Diarrheal illness caused by a chlorine-resistant parasite; commonly linked to swimming pools and water parks.',
    whatIsIt: 'Cryptosporidiosis is caused by Cryptosporidium parasites and is a leading cause of waterborne disease outbreaks in the US. NYS had 924 cases in 2024. Cryptosporidium is notable for its resistance to standard chlorine levels used in pools and water parks, making it a common cause of recreational water outbreaks.',
    howItSpreads: 'Spreads through swallowing contaminated recreational water (pools, splash pads, water parks), drinking water, or food. Also spreads through contact with infected animals or people. Cases peak in summer when recreational water use is highest.',
    symptoms: 'Watery diarrhea, stomach cramps or pain, nausea, vomiting, dehydration, weight loss, and low-grade fever. In healthy individuals, illness typically lasts 1–2 weeks. In immunocompromised individuals, it can be chronic, severe, and life-threatening.',
    whoIsAtRisk: 'Young children in daycare, travelers, people who work with animals, and immunocompromised individuals (especially those with HIV/AIDS) who can develop severe, prolonged illness.',
    actionItems: [
      { text: 'Do not swallow water when swimming; shower before entering a pool', type: 'prevention' },
      { text: 'Keep children with diarrhea out of pools, splash pads, and water parks for at least 2 weeks after diarrhea resolves', type: 'prevention' },
      { text: 'Wash hands after contact with animals, especially farm animals and their environments', type: 'prevention' },
      { text: 'People with HIV/AIDS should consult their provider about water treatment options and extra precautions', type: 'monitor' },
    ],
  },

  {
    slug: 'giardiasis',
    shortDescription: 'Intestinal parasitic infection; a common cause of diarrheal illness linked to backcountry water and daycare settings.',
    whatIsIt: 'Giardiasis is caused by Giardia intestinalis (also called G. lamblia or G. duodenalis), a microscopic parasite that lives in the intestines. NYS had 2,493 cases in 2024. It is one of the most common causes of waterborne disease in the US and a frequent culprit in backcountry water sources.',
    howItSpreads: 'Spreads through swallowing contaminated water (lakes, streams, pools), eating contaminated food, or direct fecal-oral contact with an infected person or animal. Common in childcare centers and among hikers who drink unfiltered backcountry water.',
    symptoms: 'Diarrhea (often greasy and foul-smelling), gas, stomach cramps, nausea, dehydration, and weight loss beginning 1–3 weeks after exposure. Some people carry Giardia with no symptoms but can still spread it to others.',
    whoIsAtRisk: 'Hikers and campers who drink unfiltered water, children in daycare settings, international travelers, and people who have close contact with infected individuals or animals.',
    actionItems: [
      { text: 'Always treat backcountry water before drinking — use a filter, boil for 1 minute, or use chemical treatment (iodine or chlorine dioxide)', type: 'prevention' },
      { text: 'Wash hands thoroughly after using the toilet and before preparing food', type: 'prevention' },
      { text: 'Keep children with diarrhea out of pools and water play areas', type: 'prevention' },
      { text: 'See a provider if diarrhea lasts more than a week — effective antibiotic treatment (metronidazole, tinidazole) is available', type: 'treatment' },
    ],
  },

  {
    slug: 'listeriosis',
    shortDescription: 'Serious foodborne illness particularly dangerous during pregnancy and for older adults.',
    whatIsIt: 'Listeriosis is caused by Listeria monocytogenes bacteria found in soil, water, and some foods. NYS had 127 cases in 2024. While rare, listeriosis is serious: it causes the greatest number of foodborne illness deaths of any single pathogen in the US. It is particularly dangerous for pregnant people, newborns, elderly adults, and immunocompromised individuals.',
    howItSpreads: 'Spreads through eating contaminated foods, especially ready-to-eat products such as deli meats, hot dogs eaten without reheating, soft cheeses made from unpasteurized milk, smoked seafood, and refrigerated pâtés. Listeria can grow at refrigerator temperatures, making it unique among foodborne pathogens.',
    symptoms: 'Healthy adults may have mild, flu-like illness. In vulnerable populations: fever, muscle aches, headache, and stiff neck. In pregnancy, listeriosis can cause miscarriage, premature delivery, stillbirth, or serious infection in the newborn, sometimes with few symptoms in the mother.',
    whoIsAtRisk: 'Pregnant people (13 times more likely to get listeriosis than others), adults 65+, immunocompromised individuals, and newborns. The risk during pregnancy is high even with mild maternal illness.',
    actionItems: [
      { text: 'Pregnant people should avoid deli meats and hot dogs unless reheated to 165°F, soft cheeses made from unpasteurized milk, smoked seafood, and refrigerated pâté', type: 'prevention' },
      { text: 'Refrigerate perishable foods promptly; keep refrigerator at 40°F or below', type: 'prevention' },
      { text: 'Clean refrigerators and food storage surfaces regularly', type: 'prevention' },
      { text: 'Seek care immediately if you are pregnant and have fever and flu-like symptoms — treatment with antibiotics can prevent fetal complications', type: 'treatment' },
    ],
  },

  {
    slug: 'yersiniosis',
    shortDescription: 'Bacterial foodborne illness linked to undercooked pork; can mimic appendicitis.',
    whatIsIt: 'Yersiniosis is caused by Yersinia enterocolitica bacteria and is a significant but underrecognized foodborne illness. NYS had 1,495 cases in 2024. Yersiniosis is notable for causing right-sided abdominal pain that can closely mimic appendicitis — a condition called pseudoappendicitis — leading to unnecessary surgeries if not identified.',
    howItSpreads: 'Primarily through undercooked pork (especially pork chitterlings/intestines), raw or undercooked meat, unpasteurized milk, and contaminated water. Can spread from person-to-person through the fecal-oral route. Handling raw chitterlings is a significant risk, especially for infants whose caregivers prepare this food.',
    symptoms: 'Fever, diarrhea, and abdominal pain (often on the right side) appearing 4–7 days after exposure and lasting 1–3 weeks. Older children and adults may develop pseudoappendicitis with severe right lower abdominal pain without diarrhea.',
    whoIsAtRisk: 'Young children are most commonly affected. Infants can be infected through contact with caregivers who handle raw chitterlings. Iron-overload conditions (hemochromatosis) significantly increase the risk of severe systemic infection.',
    actionItems: [
      { text: 'Wash hands thoroughly after handling raw pork, especially chitterlings (pork intestines)', type: 'prevention' },
      { text: 'Keep infants away from the kitchen when preparing chitterlings; clean all surfaces thoroughly after preparation', type: 'prevention' },
      { text: 'Cook all pork products to an internal temperature of 160°F', type: 'prevention' },
      { text: 'See a provider for severe right-sided abdominal pain to rule out appendicitis vs. yersiniosis', type: 'monitor' },
    ],
  },

  {
    slug: 'cyclosporiasis',
    shortDescription: 'Parasitic diarrheal illness often linked to imported fresh produce; peaks in summer.',
    whatIsIt: 'Cyclosporiasis is caused by the Cyclospora cayetanensis parasite. NYS had 691 cases in 2024. Cases frequently occur in clusters linked to contaminated imported fresh produce — raspberries, cilantro, basil, snow peas, and other herbs and vegetables from endemic regions in Central and South America have been implicated in past outbreaks. Dutchess County had an unusually high cluster in 2024.',
    howItSpreads: 'Spreads by swallowing food or water contaminated with Cyclospora oocysts. Not spread directly from person-to-person. Unlike most parasites, Cyclospora oocysts need days to weeks outside the body to become infectious, so fresh fecal contamination is not immediately infectious.',
    symptoms: 'Watery diarrhea (often explosive), loss of appetite, weight loss, bloating, stomach cramps, nausea, vomiting, fatigue, and low-grade fever beginning about a week after exposure. Without treatment, illness can last from a few days to months and may relapse.',
    whoIsAtRisk: 'People who eat imported fresh produce. Travelers to developing countries. Immunocompromised individuals may develop more severe and prolonged illness.',
    actionItems: [
      { text: 'Wash all fresh produce thoroughly under running water before eating, even if prewashed', type: 'prevention' },
      { text: 'See a provider for prolonged watery diarrhea, especially in summer months — trimethoprim-sulfamethoxazole is effective', type: 'treatment' },
      { text: 'Stay hydrated during illness; oral rehydration solutions help', type: 'treatment' },
    ],
  },

  {
    slug: 'vibriosis',
    shortDescription: 'Bacterial infection from raw shellfish or warm saltwater wounds; can be severe in people with liver disease.',
    whatIsIt: 'Vibriosis is caused by non-cholera Vibrio bacteria, most commonly Vibrio parahaemolyticus and Vibrio vulnificus. NYS had 408 cases in 2024. While V. parahaemolyticus usually causes a self-limiting gastroenteritis, V. vulnificus can cause severe wound infections and bloodstream infections that are fatal in over 20% of cases, particularly in people with liver disease.',
    howItSpreads: 'V. parahaemolyticus: from eating raw or undercooked shellfish (especially oysters) harvested from warm coastal waters during summer. V. vulnificus: from eating raw shellfish OR from wound contact with warm brackish or saltwater during summer months.',
    symptoms: 'Gastroenteritis form: watery diarrhea, stomach cramps, nausea, vomiting, and fever within 24 hours of eating contaminated shellfish. Wound infection form: rapidly progressing skin infection, ulceration, and in severe cases, necrotizing fasciitis.',
    whoIsAtRisk: 'Anyone eating raw shellfish, but especially people with liver disease (cirrhosis, hepatitis), diabetes, or who are immunocompromised — these individuals face dramatically higher risk of severe V. vulnificus infection.',
    actionItems: [
      { text: 'People with liver disease, diabetes, or immune conditions should avoid raw shellfish entirely', type: 'prevention' },
      { text: 'Cook shellfish thoroughly — boil oysters for at least 3 minutes or fry until edges curl', type: 'prevention' },
      { text: 'Clean wounds immediately and thoroughly if injured in saltwater or brackish water during warm months', type: 'prevention' },
      { text: 'Seek urgent care for rapidly worsening wound infections after saltwater exposure, or severe illness after eating raw shellfish', type: 'treatment' },
    ],
  },

  {
    slug: 'hemolytic-uremic-syndrome',
    shortDescription: 'Serious complication of STEC E. coli infection; the most common cause of sudden kidney failure in children.',
    whatIsIt: 'Hemolytic Uremic Syndrome (HUS) is a life-threatening complication that occurs in about 5–10% of people infected with Shiga toxin-producing E. coli (STEC). NYS had 8 cases in 2024. HUS involves hemolytic anemia (destruction of red blood cells), thrombocytopenia (low platelets), and acute kidney failure. It is the most common cause of sudden kidney failure in children in the United States.',
    howItSpreads: 'HUS itself is not contagious — it is a complication of STEC infection. STEC spreads through undercooked ground beef, unpasteurized dairy, contaminated produce, animal contact, and person-to-person fecal-oral transmission.',
    symptoms: 'Follows a diarrheal illness (often bloody). Warning signs typically appear about a week after diarrhea begins: decreased or no urination, extreme fatigue, pale skin and pale inner eyelids, easy bruising, and swelling. Seizures can occur.',
    whoIsAtRisk: 'Young children under 5 are at highest risk for developing HUS after STEC infection. Elderly adults and immunocompromised individuals are also at elevated risk.',
    actionItems: [
      { text: 'Prevent STEC infection: cook ground beef thoroughly, wash hands after animal contact, avoid unpasteurized products', type: 'prevention' },
      { text: 'Seek emergency care immediately if a child develops decreased urination, paleness, or unusual bruising after a bloody diarrheal illness', type: 'treatment' },
      { text: 'Do NOT give anti-diarrheal medications or antibiotics to children with suspected STEC diarrhea without consulting a provider — these may increase HUS risk', type: 'treatment' },
    ],
  },

  {
    slug: 'amebiasis',
    shortDescription: 'Intestinal parasitic infection; mostly travel-associated in NYS, but also transmitted through contaminated food and water.',
    whatIsIt: 'Amebiasis is caused by Entamoeba histolytica, an intestinal parasite. NYS had 213 cases in 2024. While most infections cause no symptoms, E. histolytica can invade the intestinal wall and liver, causing serious complications. Most US cases occur in travelers returning from developing countries and immigrants from endemic regions.',
    howItSpreads: 'Spreads through swallowing food or water contaminated with E. histolytica cysts, and through the fecal-oral route during close personal contact. Common in areas with poor sanitation.',
    symptoms: 'Most infections (about 90%) cause no symptoms. Symptomatic cases involve stomach pain, cramping, and loose stools. Invasive disease causes severe bloody diarrhea (amebic dysentery), fever, and in some cases liver abscess — right-sided abdominal pain and fever weeks to months after initial infection.',
    whoIsAtRisk: 'Travelers to tropical and subtropical developing countries, recent immigrants, men who have sex with men, and people in institutions with poor sanitation.',
    actionItems: [
      { text: 'When traveling to developing countries, drink bottled or boiled water and avoid ice, raw fruits, and vegetables unless you peel them yourself', type: 'prevention' },
      { text: 'Wash hands thoroughly with soap and water after using the toilet and before eating', type: 'prevention' },
      { text: 'See a provider for persistent diarrhea or abdominal pain after international travel — testing and treatment with metronidazole or tinidazole is effective', type: 'treatment' },
    ],
  },

  // ── SEXUALLY TRANSMITTED ──────────────────────────────────────────────────

  {
    slug: 'chlamydia',
    shortDescription: 'The most commonly reported infectious disease in NYS; often has no symptoms, making regular testing essential.',
    whatIsIt: 'Chlamydia is caused by Chlamydia trachomatis and is the most frequently reported infectious disease in New York State, with 102,175 cases in 2024. Because the majority of infections cause no symptoms, routine screening is critical — undetected chlamydia can cause serious long-term reproductive harm.',
    howItSpreads: 'Spreads through vaginal, anal, or oral sex. Can infect the genitals, rectum, and throat. Can be passed from a pregnant person to a newborn during delivery, potentially causing eye infections or pneumonia in the infant.',
    symptoms: 'Most people have no symptoms. When symptoms occur: unusual genital discharge, burning during urination, rectal pain or discharge, or painful swollen testicles. In women, untreated chlamydia can cause pelvic inflammatory disease (PID) and damage to the fallopian tubes, potentially causing infertility or ectopic pregnancy.',
    whoIsAtRisk: 'Sexually active people of all ages. Annual screening is recommended for all sexually active women under 25, and for older women and men with new or multiple partners. Men who have sex with men should be tested at all exposed sites.',
    actionItems: [
      { text: 'Get tested annually if you are sexually active and under 25, or if you have new or multiple partners', type: 'monitor' },
      { text: 'Use condoms correctly every time to reduce transmission risk', type: 'prevention' },
      { text: 'If diagnosed, complete the full course of antibiotics and notify all recent sexual partners so they can be tested and treated', type: 'treatment' },
      { text: 'Get retested 3 months after treatment — reinfection is common if partners are not treated', type: 'monitor' },
    ],
  },

  {
    slug: 'gonorrhea',
    shortDescription: 'Common bacterial STI with rising rates and increasing antibiotic resistance; now requires injectable treatment.',
    whatIsIt: 'Gonorrhea is caused by Neisseria gonorrhoeae and is the second most common reportable STI in NYS, with 45,218 cases in 2024. Rates have been rising over the past decade. Drug-resistant gonorrhea is an urgent public health concern — treatment now requires injectable ceftriaxone because oral alternatives have largely failed.',
    howItSpreads: 'Spreads through vaginal, anal, or oral sex. Can infect the genitals, rectum, and throat. Can be passed from a pregnant person to a baby\'s eyes during delivery, causing blindness if untreated (prevented by routine newborn eye drops).',
    symptoms: 'Many people have no symptoms. When present: burning during urination, unusual discharge from the penis or vagina, rectal pain or discharge, or sore throat (from throat infection). Untreated gonorrhea in women can cause PID, infertility, and ectopic pregnancy. Disseminated infection can cause arthritis and skin lesions.',
    whoIsAtRisk: 'Sexually active people of all ages and genders. Rates are highest among people aged 15–29. Men who have sex with men have significantly elevated rates. People with prior gonorrhea are at elevated risk for reinfection.',
    actionItems: [
      { text: 'Get tested regularly for gonorrhea if you are sexually active with new or multiple partners', type: 'monitor' },
      { text: 'Men who have sex with men should be tested at all exposed sites (urine, throat, rectum) at least annually', type: 'monitor' },
      { text: 'Use condoms correctly every time to significantly reduce transmission risk', type: 'prevention' },
      { text: 'If diagnosed, complete treatment with injectable ceftriaxone and notify recent sexual partners immediately', type: 'treatment' },
    ],
  },

  {
    slug: 'syphilis-early',
    shortDescription: 'Bacterial STI in its early, treatable stages; cases are rising sharply in NYS and nationally.',
    whatIsIt: 'Early syphilis includes primary and secondary stages of infection with Treponema pallidum. NYS had 5,984 early syphilis cases in 2024, reflecting a significant and sustained national surge. Without treatment, syphilis progresses through stages and can cause serious damage to the heart, brain, and nervous system decades later. Congenital syphilis — passed from mother to fetus — has also been rising dramatically and can be fatal to newborns.',
    howItSpreads: 'Spreads through direct contact with a syphilis sore (chancre) during vaginal, anal, or oral sex. Sores can occur in the genitals, anus, under the foreskin, lips, or mouth and are often painless and easy to miss.',
    symptoms: 'Primary stage (10–90 days after exposure): a single firm, round, painless sore (chancre) that heals on its own in 3–6 weeks. Secondary stage (weeks to months later): skin rash (often on palms and soles), flu-like symptoms, swollen lymph nodes, and mucous membrane sores. Both stages are highly infectious.',
    whoIsAtRisk: 'Sexually active people. Men who have sex with men account for a large proportion of cases. Pregnant people with untreated syphilis face high risk of passing the infection to their baby.',
    actionItems: [
      { text: 'Get tested for syphilis regularly if you have new or multiple sexual partners or are a man who has sex with men', type: 'monitor' },
      { text: 'All pregnant people should be tested for syphilis at the first prenatal visit and again in the third trimester', type: 'monitor' },
      { text: 'Use condoms during sexual activity — condoms reduce but do not eliminate risk since sores may be outside the protected area', type: 'prevention' },
      { text: 'If diagnosed, a single injection of penicillin G cures early syphilis — notify all recent partners immediately', type: 'treatment' },
    ],
  },

  {
    slug: 'syphilis-late',
    shortDescription: 'Advanced-stage syphilis after years of untreated infection; causes serious damage to the heart and nervous system.',
    whatIsIt: 'Late and latent syphilis represents infection that has persisted for more than a year without treatment. NYS had 4,539 late syphilis cases in 2024. Latent syphilis (no symptoms) is diagnosed by blood test. Tertiary syphilis — which can develop decades after initial infection — causes serious damage to the cardiovascular system, brain, and spinal cord (neurosyphilis), potentially causing dementia, blindness, and paralysis.',
    howItSpreads: 'Late/latent syphilis is generally not transmitted sexually (sores have healed). However, a pregnant person with latent syphilis can still pass it to the fetus.',
    symptoms: 'Latent syphilis: no symptoms, detected only by blood test. Tertiary syphilis (develops years to decades later): cardiovascular problems (aortic aneurysm, valve disease), neurosyphilis (confusion, dementia, vision/hearing loss, weakness), or gummas (destructive lesions in any organ).',
    whoIsAtRisk: 'Anyone who had untreated early syphilis. All people diagnosed with syphilis who did not receive adequate treatment. Pregnant people with latent syphilis can infect their fetus.',
    actionItems: [
      { text: 'Get tested for syphilis if you may have been exposed and have not been treated — blood tests are reliable', type: 'monitor' },
      { text: 'If diagnosed with late or latent syphilis, complete the full penicillin treatment course', type: 'treatment' },
      { text: 'All pregnant people should be tested for syphilis — late syphilis in pregnancy can be treated to prevent congenital infection', type: 'monitor' },
      { text: 'People with syphilis should also be tested for HIV and other STIs', type: 'monitor' },
    ],
  },

  {
    slug: 'mpox',
    shortDescription: 'Viral infection causing a distinctive rash; transmitted through close skin-to-skin contact including sexual contact.',
    whatIsIt: 'Mpox (formerly called monkeypox) is caused by the mpox virus. Following a global outbreak in 2022 that peaked in New York City, mpox transmission in NYS has declined significantly. The 2022 outbreak was predominantly among gay, bisexual, and other men who have sex with men (GBMSM). The JYNNEOS vaccine remains available for high-risk individuals.',
    howItSpreads: 'Spreads primarily through prolonged skin-to-skin contact with mpox rash lesions, scabs, or body fluids, including during sexual contact. Can also spread through contact with contaminated materials like bedding or clothing. Not primarily airborne, but can spread through respiratory secretions during prolonged close face-to-face contact.',
    symptoms: 'Rash that may look like pimples, blisters, or sores — often starting on the genitals, anus, or face — along with fever, swollen lymph nodes, muscle aches, and fatigue. Rash lesions can be painful, especially in the genital/anal area. Illness typically lasts 2–4 weeks.',
    whoIsAtRisk: 'Gay, bisexual, and other men who have sex with men, and transgender individuals with multiple sexual partners face the highest current risk. Anyone with direct contact with mpox rash lesions or contaminated materials can be infected.',
    actionItems: [
      { text: 'Get vaccinated with JYNNEOS (two doses) if you are at elevated risk — free through NYCDOHMH and NYSDOH vaccination sites', type: 'vaccine' },
      { text: 'Avoid sexual contact if you or a partner has unexplained rash or sores', type: 'prevention' },
      { text: 'See a provider promptly for any unexplained rash, especially in the genital or anal area', type: 'treatment' },
    ],
    vaccineInfo: 'JYNNEOS vaccine (two doses, 4 weeks apart) is recommended for people at elevated risk of mpox, including GBMSM with multiple partners. Available through NYSDOH and local health departments.',
  },

  // ── BLOODBORNE ────────────────────────────────────────────────────────────

  {
    slug: 'hepatitis-a',
    shortDescription: 'Liver infection spread through contaminated food and water; two-dose vaccine provides lifelong protection.',
    whatIsIt: 'Hepatitis A is a highly contagious liver infection caused by the hepatitis A virus (HAV). NYS had 111 cases in 2024. Unlike hepatitis B and C, hepatitis A does not cause chronic liver disease — most people recover fully. Recent US outbreaks have primarily affected people experiencing homelessness, people who use drugs, and close contacts of infected individuals.',
    howItSpreads: 'Spreads when a person unknowingly ingests microscopic amounts of feces from an infected person. This occurs through contaminated food or water, close personal contact, or sex with an infected person. Food workers who are infected can cause large outbreaks.',
    symptoms: 'Fatigue, nausea, stomach pain, loss of appetite, dark urine, clay-colored stools, and jaundice (yellowing of skin and eyes). Symptoms last a few weeks to several months. Older adults tend to have more severe illness.',
    whoIsAtRisk: 'Travelers to countries with high hepatitis A rates; people who use drugs (injection or non-injection); men who have sex with men; people experiencing homelessness; those with chronic liver disease or clotting disorders; unvaccinated household contacts of infected individuals.',
    actionItems: [
      { text: 'Get vaccinated — two doses provide lifelong protection and vaccination is the most effective prevention', type: 'vaccine' },
      { text: 'Wash hands thoroughly with soap and water after using the bathroom and before preparing or eating food', type: 'prevention' },
      { text: 'When traveling internationally, drink bottled or boiled water and avoid raw shellfish in high-risk areas', type: 'prevention' },
      { text: 'Post-exposure prophylaxis (vaccine or immune globulin) can prevent illness if given within 2 weeks of exposure', type: 'treatment' },
    ],
    vaccineInfo: 'Two-dose hepatitis A vaccine provides lifelong protection. Recommended for all children at age 1, travelers to endemic areas, men who have sex with men, people who use drugs, and people with chronic liver disease.',
  },

  {
    slug: 'hepatitis-b-acute',
    shortDescription: 'Initial hepatitis B infection; most adults recover but some develop chronic infection.',
    whatIsIt: 'Acute hepatitis B is the initial phase of infection with the hepatitis B virus (HBV). NYS had 107 acute cases in 2024. About 95% of adults infected with hepatitis B recover completely and develop immunity. However, infants and young children who are infected are much more likely to develop chronic hepatitis B, which significantly increases risk of liver cirrhosis and liver cancer.',
    howItSpreads: 'Spreads through contact with infected blood, semen, vaginal fluids, and other body fluids. Routes include sharing needles or drug equipment, unprotected sex, needlestick injuries in healthcare settings, and from an infected mother to her newborn during delivery.',
    symptoms: 'Many acute infections cause no symptoms. When present (appearing 1–4 months after exposure): fatigue, nausea, vomiting, abdominal pain, dark urine, clay-colored stools, joint pain, and jaundice. Symptoms typically resolve within a few months.',
    whoIsAtRisk: 'People who inject drugs, men who have sex with men, people with multiple sexual partners, healthcare workers exposed to blood, unvaccinated infants born to infected mothers, and household contacts of people with chronic hepatitis B.',
    actionItems: [
      { text: 'Get vaccinated — hepatitis B vaccine is safe, effective, and prevents infection entirely', type: 'vaccine' },
      { text: 'Use condoms during sex and never share needles, syringes, or drug preparation equipment', type: 'prevention' },
      { text: 'All pregnant people should be tested for hepatitis B; infants born to infected mothers receive vaccine and HBIG at birth', type: 'monitor' },
      { text: 'Healthcare workers should follow standard precautions and ensure they are vaccinated', type: 'prevention' },
    ],
    vaccineInfo: 'Hepatitis B vaccine is highly effective and recommended for all children (starting at birth) and adults not previously vaccinated. A 2- or 3-dose series provides lasting immunity for most people.',
  },

  {
    slug: 'hepatitis-b-chronic',
    shortDescription: 'Long-term hepatitis B infection; the leading cause of liver cancer worldwide.',
    whatIsIt: 'Chronic hepatitis B develops when the hepatitis B virus persists in the body for more than 6 months. NYS had 9,757 chronic cases in 2024. Worldwide, chronic hepatitis B is the leading cause of liver cancer and a major cause of cirrhosis. Many people with chronic hepatitis B are unaware of their infection and can transmit it to others.',
    howItSpreads: 'Same routes as acute hepatitis B: blood, sexual contact, and mother-to-child transmission. People with chronic hepatitis B can transmit the virus for years even with no symptoms.',
    symptoms: 'Many people with chronic hepatitis B have no symptoms for years or decades. Over time, liver damage can accumulate, eventually causing fatigue, jaundice, abdominal swelling, and complications of cirrhosis. Some develop liver cancer without preceding cirrhosis.',
    whoIsAtRisk: 'People born in regions with high HBV prevalence (especially sub-Saharan Africa and East/Southeast Asia), people who inject drugs, individuals who were not vaccinated at birth, and household contacts of people with chronic hepatitis B.',
    actionItems: [
      { text: 'All adults should be tested for hepatitis B at least once — testing is recommended regardless of risk factors', type: 'monitor' },
      { text: 'People with chronic hepatitis B should have regular liver function tests and monitoring by a liver specialist', type: 'monitor' },
      { text: 'Effective antiviral treatments (entecavir, tenofovir) can suppress the virus and prevent liver damage — ask your provider', type: 'treatment' },
      { text: 'People with chronic hepatitis B should avoid alcohol, which accelerates liver damage, and get vaccinated for hepatitis A', type: 'prevention' },
    ],
    vaccineInfo: 'Hepatitis B vaccine prevents new infections. People with chronic hepatitis B cannot be cured by the vaccine, but their household contacts and sexual partners should be vaccinated.',
  },

  {
    slug: 'hepatitis-c-acute',
    shortDescription: 'Initial hepatitis C infection; often asymptomatic but can progress to chronic infection.',
    whatIsIt: 'Acute hepatitis C is the initial phase of hepatitis C virus (HCV) infection, lasting approximately the first 6 months. NYS had 623 acute cases in 2024. About 25–50% of people clear the infection spontaneously; the remainder develop chronic hepatitis C. Unlike hepatitis B, there is no vaccine for hepatitis C, but it is now highly curable with antiviral treatment.',
    howItSpreads: 'Primarily spreads through sharing needles, syringes, or other drug injection equipment. Less commonly through sexual contact, healthcare exposures, and from mother to child during birth. Can be transmitted through shared personal items that may have blood on them (razors, toothbrushes).',
    symptoms: 'Most acute HCV infections cause no symptoms or only mild, nonspecific symptoms such as fatigue, nausea, and jaundice. This "silent" nature means most people don\'t know they\'ve been infected until chronic infection is detected on testing.',
    whoIsAtRisk: 'People who inject drugs face the highest risk. Also at risk: people with HIV, men who have sex with men with high-risk behaviors, healthcare workers with needlestick exposures, and infants born to HCV-infected mothers.',
    actionItems: [
      { text: 'All adults aged 18–79 should be tested for hepatitis C at least once — it is often curable if caught early', type: 'monitor' },
      { text: 'Never share needles, syringes, or drug preparation equipment; use sterile equipment every time', type: 'prevention' },
      { text: 'If newly diagnosed, see a specialist — highly effective direct-acting antiviral treatment can achieve cure in 8–12 weeks', type: 'treatment' },
    ],
  },

  {
    slug: 'hepatitis-c-chronic',
    shortDescription: 'Long-term hepatitis C infection; now highly curable with short-course antiviral treatment.',
    whatIsIt: 'Chronic hepatitis C develops when HCV infection persists beyond 6 months. NYS had 4,308 chronic cases in 2024. It is the most common chronic bloodborne infection in the US, affecting approximately 2.4 million Americans. Untreated chronic hepatitis C can progress to cirrhosis, liver failure, and liver cancer over decades. The good news: direct-acting antiviral medications now cure hepatitis C in over 95% of people with an 8–12 week pill regimen.',
    howItSpreads: 'Same routes as acute HCV. People with chronic hepatitis C can transmit the virus for years. Unlike hepatitis B, reinfection after cure is possible if exposure continues.',
    symptoms: 'Most people with chronic hepatitis C have no symptoms for decades. When liver damage becomes significant: fatigue, jaundice, abdominal discomfort, swelling, and complications of cirrhosis. Extrahepatic manifestations include joint pain, skin conditions, and kidney disease.',
    whoIsAtRisk: 'Baby boomers (born 1945–1965) have the highest rates due to medical procedures and blood transfusions before routine screening began in 1992. People who currently inject or have injected drugs. All adults aged 18–79 should be tested.',
    actionItems: [
      { text: 'Get tested — all adults 18–79 should be tested at least once regardless of risk factors', type: 'monitor' },
      { text: 'People who inject drugs or have other ongoing risk factors should be tested at least annually', type: 'monitor' },
      { text: 'If diagnosed, see a specialist — modern direct-acting antivirals (like sofosbuvir/velpatasvir) cure hepatitis C in 8–12 weeks with minimal side effects', type: 'treatment' },
      { text: 'Avoid alcohol and hepatotoxic drugs, which accelerate liver damage while awaiting treatment', type: 'prevention' },
    ],
  },

  // ── RESPIRATORY ───────────────────────────────────────────────────────────

  {
    slug: 'tuberculosis',
    shortDescription: 'Bacterial infection spread through the air; NYS has among the highest TB rates in the US, concentrated in NYC.',
    whatIsIt: 'Tuberculosis (TB) is caused by Mycobacterium tuberculosis and spread through the air when a person with active pulmonary TB coughs, speaks, or sings. NYS reported 1,089 cases in 2024 — among the highest rates in the US, with the vast majority of cases in New York City. Two-thirds of TB cases in NYS occur in foreign-born individuals from high-burden countries.',
    howItSpreads: 'Spread through the air when a person with active TB in the lungs or throat coughs, sneezes, or speaks. TB is NOT spread through casual contact, sharing dishes, surfaces, or being in the same room briefly. Prolonged close contact with an infectious person is usually needed for transmission.',
    symptoms: 'Active pulmonary TB: persistent cough lasting 3+ weeks, coughing up blood or sputum, chest pain, night sweats, weight loss, fatigue, and fever. Latent TB infection (LTBI) causes no symptoms and is not contagious.',
    whoIsAtRisk: 'People who have spent time with someone with active TB; people born in or who have lived in high-TB-burden countries; people experiencing homelessness; people with HIV or other immunocompromising conditions; people who live or work in congregate settings (shelters, correctional facilities, long-term care).',
    actionItems: [
      { text: 'Get tested if you are at high risk or have been in contact with someone with active TB — a skin test or blood test can detect infection', type: 'monitor' },
      { text: 'If diagnosed with latent TB, complete preventive treatment to reduce lifetime risk of active disease by 90%', type: 'treatment' },
      { text: 'If active TB is diagnosed, take all medications as prescribed for the full course (usually 6–9 months) — stopping early leads to drug-resistant TB', type: 'treatment' },
    ],
    vaccineInfo: 'BCG vaccine is used in high-burden countries and provides partial protection in infants and young children. It is not routinely recommended in the US and does not reliably prevent adult pulmonary TB.',
  },

  {
    slug: 'legionellosis',
    shortDescription: 'Pneumonia caused by bacteria that grow in building water systems; peaks in summer and fall.',
    whatIsIt: 'Legionellosis includes Legionnaires\' disease (severe pneumonia) and Pontiac fever (milder illness) caused by Legionella bacteria. NYS had 799 cases in 2024. Outbreaks are often linked to building water systems — cooling towers, hot tubs, decorative fountains, and large building plumbing are common sources. Legionella is not spread from person-to-person.',
    howItSpreads: 'People get infected by inhaling small water droplets (aerosols) or mist containing Legionella bacteria. Sources include cooling towers on rooftops, hot tubs and spas, decorative fountains, showers, and faucets in large buildings with stagnant warm water.',
    symptoms: 'Legionnaires\' disease: cough, shortness of breath, high fever (often 104°F or higher), muscle aches, and headache — a potentially fatal pneumonia. Pontiac fever: flu-like illness without pneumonia, resolving within 2–5 days without treatment.',
    whoIsAtRisk: 'Adults over 50, current or former smokers, people with chronic lung disease or weakened immune systems, and people with diabetes. Legionnaires\' disease is the most common cause of waterborne disease outbreaks in the US.',
    actionItems: [
      { text: 'Building and facility managers: maintain water systems per NYSDOH and ASHRAE 188 requirements to prevent Legionella growth', type: 'prevention' },
      { text: 'If you develop pneumonia, especially after staying in a hotel or visiting a healthcare facility, tell your provider — Legionella-specific testing changes treatment', type: 'treatment' },
      { text: 'Legionnaires\' disease responds well to antibiotics (fluoroquinolones or azithromycin) when treated promptly', type: 'treatment' },
    ],
  },

  {
    slug: 'pertussis',
    shortDescription: 'Whooping cough; a highly contagious respiratory illness with a national resurgence in 2024.',
    whatIsIt: 'Pertussis (whooping cough) is caused by Bordetella pertussis bacteria and is one of the most contagious diseases known. NYS had 2,875 cases in 2024 — significantly above recent-year averages, reflecting a national resurgence. Unvaccinated infants face the highest risk of severe illness and death; many are infected by adults and older children who don\'t know they have pertussis.',
    howItSpreads: 'Spreads very easily through respiratory droplets when an infected person coughs or sneezes. Highly contagious from the start of the runny nose stage until about 3 weeks after coughing begins (or 5 days after antibiotics start).',
    symptoms: 'Begins like a cold (runny nose, mild cough, low fever). After 1–2 weeks, progresses to severe coughing fits ending with a high-pitched "whooping" sound when inhaling, often followed by vomiting. Infants may not whoop but may have apnea (pauses in breathing) or turn blue. Cough can last months — pertussis is called the "100-day cough."',
    whoIsAtRisk: 'Infants under 12 months are at highest risk for severe disease and death, especially those too young to be fully vaccinated. Older children, teens, and adults typically have milder illness but spread it unknowingly. Vaccine immunity wanes over time.',
    actionItems: [
      { text: 'Ensure infants receive all DTaP doses on schedule (2, 4, 6, 15–18 months, and 4–6 years)', type: 'vaccine' },
      { text: 'Pregnant people should receive Tdap during every pregnancy (weeks 27–36) to pass antibodies to the newborn before it can be vaccinated', type: 'vaccine' },
      { text: 'Adults who have never had Tdap should get one dose, especially before being around infants', type: 'vaccine' },
      { text: 'Treat with azithromycin or another antibiotic if diagnosed early — treatment reduces contagiousness even if cough continues', type: 'treatment' },
    ],
    vaccineInfo: 'DTaP for children (5 doses), Tdap booster for adolescents and adults. Tdap during pregnancy is especially important — it provides protection to the newborn until the baby can be vaccinated.',
  },

  {
    slug: 'mumps',
    shortDescription: 'Viral infection causing swollen salivary glands; outbreaks occur in vaccinated populations, particularly on college campuses.',
    whatIsIt: 'Mumps is a viral infection caused by a paramyxovirus. NYS had 35 cases in 2024. While rare in the vaccine era, mumps outbreaks continue to occur — notably on college campuses and in closely knit communities — because vaccine-induced immunity wanes over time and because the MMR vaccine is about 88% effective against mumps (compared to near-100% for measles).',
    howItSpreads: 'Spreads through respiratory droplets and direct contact with saliva from an infected person. Mumps is contagious from 2 days before symptoms appear until 5 days after swelling begins. Living in close quarters (dormitories, sports teams) facilitates spread.',
    symptoms: 'Swollen, painful parotid glands (the salivary glands near the jaw, causing puffy cheeks and jaw pain), fever, headache, muscle aches, fatigue, and loss of appetite. Complications include orchitis (testicular swelling, in up to 38% of post-pubertal males), oophoritis, meningitis, and rarely deafness.',
    whoIsAtRisk: 'Unvaccinated individuals. People in close-contact settings such as college students, military personnel, and athletes. Vaccine-induced immunity can wane, making previously vaccinated adults vulnerable during outbreaks.',
    actionItems: [
      { text: 'Ensure vaccination: children need 2 doses of MMR vaccine (at 12–15 months and 4–6 years)', type: 'vaccine' },
      { text: 'Adults born after 1957 who lack documentation of two MMR doses should be vaccinated — college students especially', type: 'vaccine' },
      { text: 'Isolate if diagnosed with mumps for 5 days after onset of parotid swelling to prevent spread', type: 'prevention' },
      { text: 'During an outbreak, a third MMR dose may be recommended by public health authorities', type: 'vaccine' },
    ],
    vaccineInfo: 'Two doses of MMR vaccine are about 88% effective against mumps, 97% against measles, and 97% against rubella. A third dose may be recommended during outbreaks.',
  },

  {
    slug: 'varicella',
    shortDescription: 'Chickenpox; a highly contagious viral illness now largely preventable by the varicella vaccine.',
    whatIsIt: 'Varicella (chickenpox) is caused by the varicella-zoster virus (VZV). NYS had 381 cases in 2024, predominantly in unvaccinated individuals. The disease was once nearly universal in childhood before the vaccine era. The same virus causes shingles (herpes zoster) later in life when it reactivates. Chickenpox can be severe during pregnancy, leading to serious fetal complications.',
    howItSpreads: 'One of the most contagious diseases known — spreads through airborne respiratory droplets and direct contact with blister fluid. Contagious from 1–2 days before the rash appears until all blisters have crusted over (usually 5–7 days). Can spread via airborne route across rooms.',
    symptoms: 'Characteristic itchy, blister-like rash that appears in crops starting on the face, chest, and back before spreading to the rest of the body. Fever, fatigue, and loss of appetite typically precede the rash by 1–2 days. Complications include bacterial skin infections, pneumonia, and encephalitis, which are more common in adults and immunocompromised individuals.',
    whoIsAtRisk: 'Unvaccinated individuals of all ages. Adults who get chickenpox tend to have more severe illness than children. Pregnant people, newborns, and immunocompromised individuals face the highest risk of serious complications.',
    actionItems: [
      { text: 'Get vaccinated: 2 doses of varicella vaccine are recommended for all children (12–15 months and 4–6 years)', type: 'vaccine' },
      { text: 'Unvaccinated adults with no history of chickenpox should receive 2 doses of varicella vaccine (4–8 weeks apart)', type: 'vaccine' },
      { text: 'Isolate infected individuals until all blisters have completely crusted over', type: 'prevention' },
      { text: 'Seek immediate care if pregnant and exposed to chickenpox without prior immunity', type: 'monitor' },
    ],
    vaccineInfo: 'Two-dose varicella vaccine series (Varivax) is about 90% effective against any chickenpox and over 99% effective against severe disease. Also prevents shingles in vaccinated children. Zoster vaccine (Shingrix) is recommended for adults 50+ to prevent shingles.',
  },

  // ── INVASIVE BACTERIAL ────────────────────────────────────────────────────

  {
    slug: 'strep-a-invasive',
    shortDescription: 'Severe Group A Streptococcus infections going beyond the throat; can progress rapidly to life-threatening illness.',
    whatIsIt: 'Invasive Group A Streptococcus (iGAS) disease occurs when the same bacteria that causes strep throat enters normally sterile body sites — bloodstream, lungs, muscles, and connective tissue. NYS had 1,636 cases in 2024. The two most feared forms are necrotizing fasciitis ("flesh-eating bacteria") and streptococcal toxic shock syndrome (STSS). iGAS infections require immediate hospitalization and are potentially fatal.',
    howItSpreads: 'Spreads through respiratory droplets from infected people or through contact with infected wounds. Most invasive cases arise from the patient\'s own skin or throat bacteria entering a wound or the bloodstream. People with chickenpox are at higher risk for secondary iGAS infections.',
    symptoms: 'Varies by site of infection. Bacteremia (bloodstream): high fever, severe illness. Necrotizing fasciitis: rapidly worsening, disproportionately severe pain at a wound site, followed by swelling, redness, and skin breakdown. Streptococcal TSS: sudden high fever, rapidly dropping blood pressure, and multi-organ failure.',
    whoIsAtRisk: 'Elderly adults, people with diabetes or chronic illness, people who inject drugs, and those with recent skin wounds or chickenpox. Close contacts of iGAS cases may be offered prophylactic antibiotics.',
    actionItems: [
      { text: 'Keep wounds and skin breaks clean and covered; watch for signs of rapidly worsening infection', type: 'prevention' },
      { text: 'Seek emergency care immediately for pain, redness, or swelling that worsens unusually rapidly — do not wait', type: 'treatment' },
      { text: 'Ensure chickenpox vaccination — varicella significantly increases risk of iGAS in unvaccinated children', type: 'vaccine' },
      { text: 'Treat strep throat promptly to reduce the bacterial load and spread', type: 'treatment' },
    ],
  },

  {
    slug: 'strep-b-invasive',
    shortDescription: 'Invasive Group B Streptococcus; the leading cause of life-threatening bacterial infections in newborns.',
    whatIsIt: 'Invasive Group B Streptococcus (GBS) disease is caused by Streptococcus agalactiae entering sterile body sites. NYS had 970 cases in 2024. GBS is the leading cause of sepsis, pneumonia, and meningitis in newborns in the United States. It also commonly infects pregnant women, elderly adults, and people with underlying health conditions.',
    howItSpreads: 'GBS colonizes the intestines and vagina of about 25% of healthy adults without causing illness. Newborns can acquire GBS from their mother during delivery. In adults, invasive GBS occurs when the bacteria enter the bloodstream or other sterile sites, often related to underlying health conditions.',
    symptoms: 'In newborns: fever, difficulty breathing, poor feeding, limpness, and abnormal heart rate — can progress to sepsis, pneumonia, or meningitis. In adults: bloodstream infection, pneumonia, skin and soft tissue infections, or urinary tract infections, often in the setting of underlying illness.',
    whoIsAtRisk: 'Newborns, especially those born to mothers with GBS colonization who did not receive intrapartum antibiotics. Adults over 65, pregnant people, and those with diabetes, heart disease, cancer, or obesity.',
    actionItems: [
      { text: 'All pregnant people should be tested for GBS colonization at 36–37 weeks of pregnancy — testing is standard of care', type: 'monitor' },
      { text: 'If GBS-positive, intrapartum antibiotics (IV penicillin during labor) reduce risk of newborn infection by 80%', type: 'treatment' },
      { text: 'Seek care for any sudden onset of fever and severe illness in a newborn under 3 months — this is a medical emergency', type: 'treatment' },
    ],
  },

  {
    slug: 'strep-pneumo-invasive',
    shortDescription: 'Invasive pneumococcal disease; a leading cause of bacterial meningitis and pneumonia in adults and children.',
    whatIsIt: 'Invasive pneumococcal disease (IPD) is caused by Streptococcus pneumoniae entering normally sterile body sites. NYS had 1,783 cases in 2024. S. pneumoniae is a leading cause of bacterial meningitis, bloodstream infections, and pneumonia in both children and adults. Strong vaccines are available and have dramatically reduced childhood IPD since their introduction.',
    howItSpreads: 'Spreads through respiratory droplets from close contact with an infected person or carrier. Most healthy people carry S. pneumoniae in their nose and throat without getting sick; invasive disease occurs when bacteria spread beyond the respiratory tract.',
    symptoms: 'Meningitis: stiff neck, severe headache, fever, sensitivity to light, confusion. Bacteremia: fever, chills, severe illness. Pneumonia: fever, cough, shortness of breath, chest pain. Symptoms can progress rapidly, especially in older adults and immunocompromised individuals.',
    whoIsAtRisk: 'Infants and toddlers under 2, adults 65+, people with certain chronic illnesses (heart disease, lung disease, diabetes, asplenia), and immunocompromised individuals. Unvaccinated individuals are at much higher risk.',
    actionItems: [
      { text: 'Ensure children receive all PCV15 or PCV20 vaccine doses on schedule (2, 4, 6, and 12–15 months)', type: 'vaccine' },
      { text: 'Adults 65+ should receive pneumococcal vaccine — talk to your provider about which vaccine is right for you (PCV20 or PCV15+PPSV23)', type: 'vaccine' },
      { text: 'Adults under 65 with certain chronic conditions or immunocompromising conditions should also be vaccinated — ask your provider', type: 'vaccine' },
    ],
    vaccineInfo: 'PCV20 (Prevnar 20) provides broad protection and is the preferred vaccine for adults 65+. Children receive a primary series of PCV15 or PCV20. Annual flu vaccine also reduces risk of secondary pneumococcal pneumonia.',
  },

  {
    slug: 'meningococcal',
    shortDescription: 'Bacterial meningitis that can kill within 24 hours; vaccine-preventable and recommended for adolescents and college students.',
    whatIsIt: 'Meningococcal disease is caused by Neisseria meningitidis and can cause meningitis, septicemia, and meningococcemia. NYS had 51 cases in 2024. It is one of the most rapidly fatal bacterial infections — death can occur within 24 hours of first symptoms, and 10–15% of survivors have permanent disabilities including hearing loss and limb amputations. Outbreaks occur in college dormitories, military barracks, and other settings with close contact.',
    howItSpreads: 'Spreads through respiratory droplets and close contact — kissing, sharing drinks, or prolonged contact in crowded settings. About 10% of people carry N. meningitidis in their nose and throat without becoming ill.',
    symptoms: 'Sudden high fever, severe headache, stiff neck, sensitivity to light, nausea, vomiting, and altered mental status. A petechial or purpuric rash (small purple spots that don\'t fade under pressure) may appear and indicates serious bloodstream infection. If rash appears, seek emergency care immediately.',
    whoIsAtRisk: 'Teenagers and young adults (especially first-year college students in dormitories), infants under 1, military recruits, people without a spleen, and immunocompromised individuals are at highest risk.',
    actionItems: [
      { text: 'Ensure adolescents receive meningococcal vaccine (MenACWY) at 11–12 years with a booster at age 16', type: 'vaccine' },
      { text: 'First-year college students living in dormitories should receive MenACWY vaccine if not previously vaccinated', type: 'vaccine' },
      { text: 'Ask your provider about MenB (serogroup B) vaccine — recommended for some high-risk groups and available for teens and young adults', type: 'vaccine' },
      { text: 'Seek emergency care immediately for sudden severe headache with fever, stiff neck, or rash — this is a medical emergency', type: 'treatment' },
    ],
    vaccineInfo: 'MenACWY vaccine (Menactra, Menveo, MenQuadfi) protects against serogroups A, C, W, and Y. MenB vaccines (Bexsero, Trumenba) protect against serogroup B, which causes about 1/3 of US cases. Both vaccine types are recommended for high-risk groups.',
  },

  {
    slug: 'haemophilus-influenzae',
    shortDescription: 'Invasive bacterial infection; dramatically reduced in children by the Hib vaccine but still affects unvaccinated and older adults.',
    whatIsIt: 'Invasive Haemophilus influenzae (Hi) disease is caused by H. influenzae bacteria entering the bloodstream, lungs, or meninges. NYS had 478 cases in 2024. The Hib vaccine, introduced in the 1990s, nearly eliminated the most dangerous form (serotype b) in children — one of the great vaccine success stories. Most current invasive disease is caused by non-b serotypes and affects adults with underlying conditions.',
    howItSpreads: 'Spreads through respiratory droplets from infected people or carriers. H. influenzae commonly colonizes the nose and throat without causing illness; invasive disease occurs when bacteria breach normal barriers.',
    symptoms: 'Meningitis (stiff neck, severe headache, fever), bacteremia (bloodstream infection), epiglottitis (severe throat swelling that can obstruct breathing), pneumonia, and septic arthritis. Symptoms can develop rapidly.',
    whoIsAtRisk: 'Unvaccinated children under 5 (though now rare due to Hib vaccination), adults 65+, immunocompromised individuals, people without a spleen, and those with chronic health conditions.',
    actionItems: [
      { text: 'Ensure infants receive all Hib vaccine doses on schedule (2, 4, 6, and 12–15 months)', type: 'vaccine' },
      { text: 'Unvaccinated or incompletely vaccinated children should be caught up on Hib vaccination', type: 'vaccine' },
      { text: 'Adults with certain high-risk conditions (asplenia, immunodeficiency) should receive Hib vaccine — consult your provider', type: 'vaccine' },
    ],
    vaccineInfo: 'Hib vaccine is one of the most effective vaccines ever developed — it reduced Hib meningitis in children by over 99%. Part of the standard childhood immunization schedule.',
  },

  {
    slug: 'meningitis-aseptic',
    shortDescription: 'Viral meningitis — inflammation of the brain\'s protective coverings; usually self-limiting in healthy adults.',
    whatIsIt: 'Aseptic (viral) meningitis is inflammation of the meninges (the membranes covering the brain and spinal cord) caused by viruses rather than bacteria. Enteroviruses cause most cases and are common in summer and early fall. NYS had 179 cases in 2024 (NYS excluding NYC). While usually less severe than bacterial meningitis, viral meningitis can cause significant illness and requires medical evaluation to rule out the more dangerous bacterial form.',
    howItSpreads: 'Enteroviruses spread through the fecal-oral route and respiratory droplets. Herpes simplex virus, mumps, and arboviruses also cause viral meningitis. Not all cases are directly contagious.',
    symptoms: 'Sudden onset of headache (often severe), fever, and stiff neck — the classic meningitis triad. Sensitivity to light (photophobia), nausea, vomiting, and fatigue are common. Symptoms usually improve within 7–10 days in healthy individuals.',
    whoIsAtRisk: 'Children are most commonly affected. Immunocompromised individuals may have more severe or prolonged illness. Anyone is susceptible during an enterovirus season.',
    actionItems: [
      { text: 'Seek medical evaluation for any sudden severe headache with fever and stiff neck — bacterial meningitis must be ruled out', type: 'treatment' },
      { text: 'Wash hands frequently during enterovirus season to reduce exposure to common viral causes', type: 'prevention' },
      { text: 'Stay well hydrated and rest during illness; most viral meningitis resolves with supportive care', type: 'treatment' },
    ],
  },

  {
    slug: 'meningitis-bacterial',
    shortDescription: 'Life-threatening bacterial infection of the brain\'s protective coverings; requires emergency treatment.',
    whatIsIt: 'Bacterial meningitis is inflammation of the meninges caused by bacteria — most commonly Streptococcus pneumoniae, Neisseria meningitidis, Listeria monocytogenes, and group B Streptococcus. NYS had 272 cases in 2024. Bacterial meningitis has a mortality rate of 10–15% even with treatment, and 11–19% of survivors develop long-term complications including hearing loss, brain damage, and limb amputations from associated septicemia.',
    howItSpreads: 'Varies by causative organism — most spread through respiratory droplets or from the patient\'s own colonized bacteria entering the bloodstream during an immunocompromised state, following trauma, or from a nearby infection.',
    symptoms: 'Classic triad: sudden high fever, severe headache, and stiff neck. Other symptoms: sensitivity to light, nausea, vomiting, altered mental status, and seizures. Petechial rash (small purple spots) suggests meningococcemia and requires immediate emergency care. Symptoms can progress from first signs to death within hours.',
    whoIsAtRisk: 'Infants and young children, college students in dormitories (meningococcal), elderly adults (Listeria), people with recent head trauma or neurosurgery, immunocompromised individuals, and people without a spleen.',
    actionItems: [
      { text: 'Seek emergency care IMMEDIATELY for sudden severe headache, fever, and stiff neck — do not wait to see if symptoms resolve', type: 'treatment' },
      { text: 'Vaccination prevents many cases: ensure children are vaccinated against pneumococcal disease, Hib, and meningococcal disease', type: 'vaccine' },
      { text: 'Close contacts of confirmed meningococcal meningitis cases should receive prophylactic antibiotics (rifampin or ciprofloxacin) — contact your local health department', type: 'prevention' },
    ],
  },

  {
    slug: 'acute-flaccid-myelitis',
    shortDescription: 'Rare but serious neurological condition causing sudden limb weakness; most often affects children.',
    whatIsIt: 'Acute Flaccid Myelitis (AFM) is a rare but serious condition that affects the spinal cord, causing sudden weakness or paralysis in one or more limbs. NYS had 4 cases in 2024. AFM is strongly associated with enterovirus D68 (EV-D68) and biennial peaks are seen. The condition is distinct from polio but can resemble it clinically. Many patients are left with persistent weakness.',
    howItSpreads: 'The associated enteroviruses spread through respiratory droplets and the fecal-oral route. AFM itself is a rare complication of enterovirus infection — most people infected with the associated viruses do not develop AFM.',
    symptoms: 'Sudden onset of weakness or floppiness in one or more limbs (arm or leg), usually in a child who had a recent respiratory illness. Other symptoms may include facial droop, difficulty swallowing or speaking, eye movement problems, and drooping eyelids.',
    whoIsAtRisk: 'Children under 18 are most commonly affected. Most cases occur in previously healthy children with no underlying health conditions.',
    actionItems: [
      { text: 'Seek emergency care immediately for any sudden arm or leg weakness in a child, especially following a recent respiratory illness', type: 'treatment' },
      { text: 'Wash hands frequently to reduce exposure to enteroviruses', type: 'prevention' },
      { text: 'Rehabilitation with physical and occupational therapy is important for recovery — start as soon as possible', type: 'treatment' },
    ],
  },

  // ── OTHER ─────────────────────────────────────────────────────────────────

  {
    slug: 'q-fever',
    shortDescription: 'Zoonotic bacterial infection from livestock; mostly affects those who work with cattle, sheep, and goats.',
    whatIsIt: 'Q fever is caused by Coxiella burnetii, a bacterial infection primarily acquired from livestock. NYS had 5 cases in 2024. It is primarily an occupational disease of farmers, veterinarians, and abattoir workers. Acute Q fever is usually a self-limiting flu-like illness, but chronic Q fever — which can develop years later — involves endocarditis (heart valve infection) and can be fatal without prolonged antibiotic treatment.',
    howItSpreads: 'Spreads by inhaling dust or aerosols contaminated with Coxiella from the birth fluids, placenta, feces, urine, or milk of infected animals — primarily cattle, sheep, and goats. The bacteria are extremely hardy and can remain infectious in the environment for months. Not typically spread person-to-person.',
    symptoms: 'Acute Q fever (2–3 weeks after exposure): sudden high fever, severe headache, fatigue, muscle pain, and sometimes pneumonia or hepatitis. Up to half of infections are asymptomatic. Chronic Q fever: fatigue, fever, and signs of endocarditis (typically months to years after initial infection).',
    whoIsAtRisk: 'People who work with livestock (farmers, veterinarians, abattoir workers) or who live near farms and agricultural facilities. People with heart valve disease or who are immunocompromised face highest risk for chronic Q fever.',
    actionItems: [
      { text: 'People working with livestock should wear gloves, masks, and eye protection when handling birth products or aborted fetuses', type: 'prevention' },
      { text: 'Dispose of birth materials from livestock carefully and safely', type: 'prevention' },
      { text: 'People with pre-existing heart valve disease who have occupational animal exposure should inform their cardiologist', type: 'monitor' },
      { text: 'Doxycycline is effective for acute Q fever; chronic Q fever requires prolonged combination antibiotic therapy', type: 'treatment' },
    ],
  },

  {
    slug: 'brucellosis',
    shortDescription: 'Bacterial infection from animals or unpasteurized dairy; an important travel and occupational disease.',
    whatIsIt: 'Brucellosis is caused by Brucella bacteria and is one of the world\'s most common zoonotic infections, though rare in NYS (3 cases in 2024). Most US cases involve laboratory workers, veterinarians, abattoir workers, or people who traveled to countries where brucellosis is endemic and consumed unpasteurized dairy products. It can become a chronic, debilitating illness if not treated properly.',
    howItSpreads: 'Spreads through direct contact with infected animals (cattle, swine, goats, sheep, dogs) or their products, especially consuming unpasteurized milk, cheese, or ice cream from affected animals. Laboratory workers can be infected through aerosols.',
    symptoms: 'Undulating (coming and going) fever, sweating (especially at night), fatigue, weakness, joint pain, and muscle aches. Hepatitis, endocarditis, and skeletal infections can develop. Without treatment, illness can persist for months to years.',
    whoIsAtRisk: 'Veterinarians, farmers, abattoir workers, and laboratory personnel. Travelers who consume unpasteurized dairy in endemic regions (Middle East, Mediterranean, Latin America, Central Asia).',
    actionItems: [
      { text: 'Avoid consuming unpasteurized milk, cheese, or ice cream, especially when traveling internationally', type: 'prevention' },
      { text: 'People working with animals or animal products should wear protective equipment and follow safety protocols', type: 'prevention' },
      { text: 'Treatment requires combination antibiotics (doxycycline + rifampin) for 6 weeks or longer — see a specialist', type: 'treatment' },
    ],
  },

  {
    slug: 'candida-auris',
    shortDescription: 'Emerging drug-resistant fungal infection spreading in healthcare settings; difficult to treat and detect.',
    whatIsIt: 'Candida auris (C. auris) is an emerging multidrug-resistant yeast that spreads in healthcare settings and causes invasive infections with high mortality. NYS had 147 cases in 2024 (excluding NYC). C. auris is concerning because it is often resistant to multiple antifungal drugs, can persist on surfaces and equipment for weeks, and is difficult to identify with standard laboratory methods. It predominantly affects patients in long-term care facilities and intensive care units.',
    howItSpreads: 'Spreads in healthcare settings through contact with contaminated surfaces, equipment, and healthcare worker hands. Patients colonized with C. auris can spread it to others even without active infection. Strict contact precautions and specialized environmental cleaning are required to control spread.',
    symptoms: 'C. auris can colonize the skin, ear, and other sites without causing illness. Invasive infections cause fever and chills that do not improve with standard antifungal treatment, bloodstream infections, wound infections, and ear infections in high-risk patients.',
    whoIsAtRisk: 'Patients in long-term care facilities, ICUs, and other healthcare settings, especially those who are seriously ill, on ventilators, receiving IV nutrition or fluids through central lines, or on broad-spectrum antibiotics or antifungal medications.',
    actionItems: [
      { text: 'Healthcare facilities must implement strict contact precautions and enhanced environmental cleaning for C. auris patients', type: 'prevention' },
      { text: 'Patients and families should ask healthcare providers about C. auris screening and precautions in healthcare settings', type: 'monitor' },
      { text: 'Treatment with echinocandin antifungals (anidulafungin, micafungin, caspofungin) is the first-line approach — consult an infectious disease specialist', type: 'treatment' },
    ],
  },

  {
    slug: 'blastomycosis',
    shortDescription: 'Fungal lung infection from soil; sporadic in NYS and associated with outdoor activities in wooded areas.',
    whatIsIt: 'Blastomycosis is caused by Blastomyces dermatitidis, a fungus found in moist soil rich in organic matter, particularly near waterways and in wooded areas. NYS had 6 cases in 2024. Most infections cause no symptoms or a mild respiratory illness; severe cases can cause life-threatening pneumonia and spread to skin, bones, and other organs.',
    howItSpreads: 'Spreads by inhaling fungal spores from disturbed soil. Risk activities include construction, farming, forestry, hunting, and recreational activities in endemic areas. Not spread from person-to-person.',
    symptoms: 'Ranges from asymptomatic to severe. Respiratory: fever, cough, chest pain, and muscle aches. Skin: painless, raised, and wartlike or ulcerated lesions often on the face or extremities. Bone and joint pain can occur with disseminated disease. Immunocompromised individuals may develop severe, rapidly progressive disease.',
    whoIsAtRisk: 'People who work or recreate outdoors in wooded areas near water, particularly in the Great Lakes region. Immunocompromised individuals face higher risk of severe disseminated disease.',
    actionItems: [
      { text: 'Wear gloves and a mask when disturbing soil or leaf litter in wooded areas', type: 'prevention' },
      { text: 'See a provider for persistent respiratory illness or unusual skin lesions after outdoor activities in wooded or wetland areas', type: 'monitor' },
      { text: 'Itraconazole treats mild to moderate blastomycosis; severe disease requires IV amphotericin B — see an infectious disease specialist', type: 'treatment' },
    ],
  },

  {
    slug: 'typhoid-fever',
    shortDescription: 'Serious bacterial illness from contaminated food and water; primarily a disease of travelers to developing countries.',
    whatIsIt: 'Typhoid fever is caused by Salmonella Typhi and spreads through contaminated food and water in developing countries. NYS had 58 cases in 2024, nearly all travel-associated. S. Typhi only infects humans and is spread by people — poor sanitation and contaminated water supplies sustain transmission in endemic areas.',
    howItSpreads: 'Spreads through eating food or drinking water contaminated by the feces or urine of an infected person. Food handlers who are chronic carriers can contaminate food. Not spread through casual contact.',
    symptoms: 'Gradual onset of sustained (not intermittent) high fever over 1–3 weeks, along with headache, weakness, abdominal pain, and constipation or diarrhea. A rose-colored rash ("rose spots") may appear on the trunk. Complications include intestinal perforation and hemorrhage.',
    whoIsAtRisk: 'Travelers to South Asia (especially India, Pakistan, Bangladesh) and other developing countries with poor sanitation and water treatment.',
    actionItems: [
      { text: 'Get typhoid vaccine before traveling to endemic areas — oral or injectable vaccine available', type: 'vaccine' },
      { text: 'In endemic areas: drink only bottled or boiled water, eat cooked food served hot, and avoid raw fruits and vegetables unless you peel them yourself', type: 'prevention' },
      { text: 'Seek care promptly for fever during or after travel to endemic areas — treatment with antibiotics (azithromycin, fluoroquinolones, ceftriaxone) is effective', type: 'treatment' },
    ],
    vaccineInfo: 'Two typhoid vaccines are available: an injectable polysaccharide vaccine (Typhim Vi) that requires a booster every 2 years, and an oral live-attenuated vaccine (Vivotif, 4 capsules) that provides protection for 5 years. Both are about 50–80% effective.',
  },

  {
    slug: 'neonatal-herpes',
    shortDescription: 'HSV infection in newborns; can cause severe disease — prevention through maternal screening and management is crucial.',
    whatIsIt: 'Neonatal herpes is HSV (usually HSV-2, sometimes HSV-1) infection in infants, typically acquired during birth from a mother with active genital herpes. NYS had 32 cases in 2024. It is a serious condition with three presentations: localized skin, eye, and mouth (SEM) disease; disseminated disease affecting multiple organs; and CNS disease (encephalitis). Without prompt treatment, mortality and long-term neurological damage are high.',
    howItSpreads: 'Most commonly acquired during birth if the mother has active genital herpes at delivery. Risk is highest when the mother has a primary (first-time) HSV infection near the time of delivery. Transmission can also occur through postnatal contact with cold sores on caregivers.',
    symptoms: 'In infants (onset usually 1–3 weeks of life): SEM disease — clusters of vesicles on skin, eye discharge, or mouth sores. Disseminated disease — poor feeding, lethargy, seizures, liver failure, DIC. CNS disease — seizures, bulging fontanelle, temperature instability.',
    whoIsAtRisk: 'Newborns of mothers with active or primary genital herpes at delivery. Risk is highest when mothers have a first-episode primary infection in the third trimester.',
    actionItems: [
      { text: 'Pregnant people with a history of genital herpes should inform their obstetrician early in pregnancy', type: 'monitor' },
      { text: 'Antiviral suppressive therapy (acyclovir) from 36 weeks of pregnancy reduces viral shedding at delivery for women with recurrent herpes', type: 'treatment' },
      { text: 'People with cold sores should avoid kissing newborns — HSV-1 can also cause neonatal herpes', type: 'prevention' },
      { text: 'Seek emergency care immediately for any vesicular rash, eye discharge, poor feeding, or seizures in a newborn', type: 'treatment' },
    ],
  },

  {
    slug: 'toxic-shock-syndrome',
    shortDescription: 'Life-threatening bacterial toxin syndrome; requires immediate emergency care.',
    whatIsIt: 'Toxic Shock Syndrome (TSS) is a rare but life-threatening condition caused by toxins produced by Staphylococcus aureus or Group A Streptococcus. NYS had 35 cases in 2024. Staphylococcal TSS was historically associated with tampon use; streptococcal TSS is often associated with wound infections. Both forms can progress to multi-organ failure and death within hours.',
    howItSpreads: 'Not contagious. TSS occurs when toxin-producing bacteria (typically Staphylococci colonizing the vaginal tract or infecting a wound) release toxins directly into the bloodstream under certain conditions — prolonged tampon use, surgical wounds, or invasive infections.',
    symptoms: 'Sudden high fever (over 102°F), rapidly dropping blood pressure, widespread sunburn-like rash (especially palms and soles), vomiting, diarrhea, muscle aches, dizziness, and confusion. Organ failure can develop rapidly.',
    whoIsAtRisk: 'Menstruating people who use high-absorbency tampons, people with recent surgery or open wounds, and anyone with an invasive Group A streptococcal infection. Streptococcal TSS can occur in otherwise healthy individuals following minor injuries.',
    actionItems: [
      { text: 'Change tampons every 4–8 hours and use the lowest absorbency tampon needed; consider alternating with pads', type: 'prevention' },
      { text: 'Remove tampons before sleeping when possible, or use pads at night', type: 'prevention' },
      { text: 'Seek emergency care immediately for sudden high fever, rash, and low blood pressure — TSS requires IV antibiotics, fluids, and often ICU care', type: 'treatment' },
    ],
  },

  {
    slug: 'visa-staph',
    shortDescription: 'Drug-resistant Staph aureus with reduced vancomycin susceptibility; a healthcare-associated infection of serious concern.',
    whatIsIt: 'Vancomycin-Intermediate Staphylococcus aureus (VISA) is a form of Staphylococcus aureus with reduced susceptibility to vancomycin, the antibiotic of last resort for MRSA. NYS had 4 cases in 2024 (excluding NYC). VISA represents a critical stage in the evolution of antibiotic resistance — full resistance (VRSA) would render common staph infections essentially untreatable.',
    howItSpreads: 'Spreads through contact with infected wounds or colonized body sites, and via healthcare worker hands or contaminated equipment. Healthcare settings are the primary transmission environment.',
    symptoms: 'Similar to other Staph aureus infections: wound infections, bloodstream infections (sepsis), pneumonia, endocarditis, and abscesses. The key clinical concern is failure to respond to standard vancomycin treatment.',
    whoIsAtRisk: 'Patients with prolonged healthcare exposure, multiple recent antibiotic courses (especially vancomycin), dialysis patients, patients with indwelling catheters, and those with prior MRSA infections.',
    actionItems: [
      { text: 'Healthcare facilities must implement rigorous contact precautions and hand hygiene for VISA patients', type: 'prevention' },
      { text: 'Antimicrobial stewardship — using antibiotics only when necessary — is essential to slow resistance development', type: 'prevention' },
      { text: 'Infectious disease specialist consultation is essential; newer agents (daptomycin, ceftaroline, linezolid combinations) may be effective', type: 'treatment' },
    ],
  },

  // ── TIER C ─────────────────────────────────────────────────────────────────

  {
    slug: 'measles',
    shortDescription: 'Highly contagious viral disease; almost entirely preventable by the MMR vaccine — any case is a public health emergency.',
    whatIsIt: 'Measles is caused by the measles virus (morbillivirus) and is one of the most contagious infectious diseases known — one infected person can infect 12–18 others in an unvaccinated population. NYS had 15 cases in 2024, with outbreaks linked to communities with low vaccination rates. Before the vaccine era, virtually every child got measles; today, any case signals inadequate vaccination coverage.',
    howItSpreads: 'Airborne transmission — the virus spreads through respiratory droplets and can remain in the air for up to 2 hours after an infected person has left a room. A person is contagious from 4 days before the rash appears through 4 days after it appears.',
    symptoms: 'High fever, cough, runny nose, and red, watery eyes (conjunctivitis) for several days, followed by Koplik\'s spots (small white dots inside the mouth) and then a red, blotchy rash that starts at the hairline and spreads downward. Complications include ear infections, pneumonia, encephalitis, and rarely death — more common in malnourished children and immunocompromised individuals.',
    whoIsAtRisk: 'Unvaccinated individuals of any age. Infants too young to be vaccinated depend entirely on community immunity. International travelers to endemic areas. People born before 1957 are generally considered immune through natural infection.',
    actionItems: [
      { text: 'Verify your MMR vaccination status — you need 2 documented doses for full protection', type: 'vaccine' },
      { text: 'Contact your provider immediately if you may have been exposed and are not fully vaccinated — post-exposure vaccination within 72 hours can prevent infection', type: 'monitor' },
      { text: 'Unvaccinated individuals exposed to measles should isolate for 21 days and contact their local health department', type: 'prevention' },
    ],
    vaccineInfo: 'Two doses of MMR vaccine are 97% effective against measles. First dose at 12–15 months, second dose at 4–6 years. Infants 6–11 months traveling internationally may receive an early dose (does not count toward the 2-dose series).',
  },

  {
    slug: 'botulism',
    shortDescription: 'Rare but life-threatening paralytic illness from a bacterial toxin; any confirmed case requires immediate emergency response.',
    whatIsIt: 'Botulism is caused by the potent neurotoxin produced by Clostridium botulinum bacteria. NYS had 5 cases in 2024. There are several forms: foodborne botulism (from eating improperly preserved foods), wound botulism (increasingly associated with injection drug use), and infant botulism (the most common form in the US, from ingesting bacterial spores). Botulinum toxin is the most potent toxin known — it blocks nerve signals to muscles, causing descending paralysis.',
    howItSpreads: 'Foodborne botulism: from eating foods contaminated with the toxin, most often home-canned or improperly preserved foods. Wound botulism: from C. botulinum spores infecting a wound, most commonly in people who inject black-tar heroin. Infant botulism: from ingesting spores (in honey, soil, or dust) that germinate in the infant\'s gut.',
    symptoms: 'Double vision, blurred vision, drooping eyelids, slurred speech, difficulty swallowing, dry mouth, and muscle weakness progressing downward from the head. Without treatment, paralysis of breathing muscles can be fatal. The mind typically remains clear.',
    whoIsAtRisk: 'Home food canners who do not follow safe canning practices; people who inject drugs; infants under 12 months (should never be given honey).',
    actionItems: [
      { text: 'Never give honey to infants under 12 months — it can contain C. botulinum spores', type: 'prevention' },
      { text: 'Follow tested safe canning recipes and use a pressure canner for low-acid foods; when in doubt, throw it out', type: 'prevention' },
      { text: 'Seek emergency care immediately for vision problems, difficulty swallowing, or progressive muscle weakness — botulism antitoxin is available but must be given early', type: 'treatment' },
    ],
  },

  {
    slug: 'diphtheria',
    shortDescription: 'Severe bacterial throat infection; essentially eliminated in the US by vaccination — any case is a medical emergency.',
    whatIsIt: 'Diphtheria is caused by toxin-producing strains of Corynebacterium diphtheriae. Once a leading cause of childhood death worldwide, it is now essentially eliminated in countries with high vaccination coverage. No cases are expected in NYS, and any confirmed case represents a critical public health event requiring immediate response. Diphtheria remains a serious concern in countries with poor vaccination coverage.',
    howItSpreads: 'Spreads through respiratory droplets from coughing or sneezing, or through direct contact with infected wounds or skin lesions. A person can be contagious for 2–4 weeks if untreated.',
    symptoms: 'Sore throat, mild fever, and the development of a thick gray membrane (pseudomembrane) over the throat and tonsils that can obstruct breathing. The bacterial toxin can spread through the bloodstream and cause damage to the heart and nervous system, even weeks after infection.',
    whoIsAtRisk: 'Unvaccinated individuals of any age. People traveling to countries where diphtheria is still endemic (parts of Africa, Asia, Middle East). Adults whose vaccine immunity has waned (protection from childhood DTaP wanes over time; adults need Td boosters every 10 years).',
    actionItems: [
      { text: 'Ensure up-to-date vaccination: all children need DTaP, all adults need a Td booster every 10 years', type: 'vaccine' },
      { text: 'Travelers to endemic countries should verify their diphtheria vaccination status before travel', type: 'vaccine' },
      { text: 'Seek emergency care immediately for any rapidly worsening sore throat with a gray throat membrane — diphtheria antitoxin must be given urgently', type: 'treatment' },
    ],
    vaccineInfo: 'DTaP for children (5 doses), then Td booster every 10 years for adults. Tdap replaces one Td booster and also provides pertussis protection — recommended once for all adults.',
  },

  {
    slug: 'tetanus',
    shortDescription: 'Bacterial toxin causing muscle spasms (lockjaw); preventable by vaccine — boosters needed every 10 years.',
    whatIsIt: 'Tetanus is caused by the toxin of Clostridium tetani, bacteria found in soil, dust, and manure that enter through skin wounds. NYS had 2 cases in 2024. Tetanus is not spread from person-to-person — it comes from environmental spores. The disease causes progressive, potentially fatal muscle spasms. With modern intensive care, mortality in treated patients is about 10–20%, but it requires prolonged ICU care.',
    howItSpreads: 'C. tetani spores enter the body through cuts, puncture wounds, burns, or even minor scrapes contaminated with soil, manure, or rusty metal. Injection drug use is an increasing risk factor. Spores germinate in deep wounds with low oxygen levels and produce the toxin.',
    symptoms: 'Stiffness of the jaw (lockjaw — difficulty opening the mouth), neck stiffness, and difficulty swallowing, followed by painful muscle spasms of the jaw, neck, and then the entire body. Spasms can be triggered by light, sound, or touch. Severe spasms can fracture bones and interfere with breathing.',
    whoIsAtRisk: 'Unvaccinated individuals, adults who have not received a booster in over 10 years, injection drug users, people with wounds contaminated by soil or manure, and newborns born to unvaccinated mothers in some countries.',
    actionItems: [
      { text: 'Keep tetanus vaccination current — adults need a Td or Tdap booster every 10 years', type: 'vaccine' },
      { text: 'For deep, dirty, or contaminated wounds, see a provider — a booster may be needed if your last vaccine was more than 5 years ago', type: 'vaccine' },
      { text: 'Clean all wounds thoroughly with soap and water; seek care for puncture wounds, especially if contaminated with soil', type: 'prevention' },
    ],
    vaccineInfo: 'DTaP for children, then Td booster every 10 years for adults. After a contaminated wound, unvaccinated people may need tetanus immune globulin (TIG) in addition to vaccine.',
  },

  {
    slug: 'tularemia',
    shortDescription: 'Rare bacterial infection from wildlife contact or tick bites; any confirmed case requires public health investigation.',
    whatIsIt: 'Tularemia is caused by Francisella tularensis, one of the most infectious bacteria known — fewer than 10 organisms can cause disease. NYS had 6 cases in 2024. There are several forms depending on how infection occurs: ulceroglandular (most common — tick bite or animal contact), pneumonic (inhalation — most severe), and typhoidal (bloodstream). The bacteria is also classified as a potential bioterrorism agent.',
    howItSpreads: 'Tick bites (primarily from dog ticks, lone star ticks, and wood ticks); handling infected animals, especially rabbits and hares; bites or scratches from infected animals; inhaling contaminated dust or aerosols; and drinking contaminated water. Not spread from person-to-person.',
    symptoms: 'Ulceroglandular form (most common): a skin ulcer at the site of tick bite or animal contact, with swollen lymph nodes. Pneumonic form: chest pain, cough, and difficulty breathing. All forms: sudden fever, headache, fatigue, and muscle aches beginning 3–5 days after exposure.',
    whoIsAtRisk: 'Hunters, trappers, farmers, and outdoor workers who handle wild animals. Anyone bitten by ticks in areas where tularemia is present. Laboratory workers handling F. tularensis (requires biosafety level 3 containment).',
    actionItems: [
      { text: 'Use tick repellent and wear protective clothing when outdoors in tick-endemic areas', type: 'prevention' },
      { text: 'Wear gloves when handling dead wild animals, especially rabbits; cook wild game thoroughly', type: 'prevention' },
      { text: 'Seek care promptly for any skin ulcer with swollen lymph nodes after tick exposure or wild animal contact — early treatment with doxycycline, streptomycin, or gentamicin is effective', type: 'treatment' },
    ],
  },

];

export const diseaseContentBySlug = Object.fromEntries(
  diseaseContent.map(d => [d.slug, d])
) as Record<string, DiseaseContent>;
