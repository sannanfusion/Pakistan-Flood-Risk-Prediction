// Pakistan Flood Data (2010-2026)
// Comprehensive dataset for flood risk prediction and analysis
// Sources: NDMA, UN OCHA, ReliefWeb, WHO, PDMA Reports

export interface FloodYearSummary {
  year: number;
  totalDeaths: number;
  totalInjured: number;
  peopleAffected: number;
  districtsAffected: number;
  housesDestroyed: number;
  housesDamaged: number;
  economicLossUSD: number;
  severity: string;
  description: string;
  mostAffectedProvince: string;
  floodType: string;
}

export interface DistrictFloodRecord {
  year: number;
  province: string;
  district: string;
  deaths: number;
  peopleAffected: number;
  severityLevel: string;
  floodType: string;
}

export interface MostAffectedDistrict {
  rank: number;
  district: string;
  province: string;
  timesAffected: number;
  worstYear: number;
  totalEstimatedDeaths: number;
  reason: string;
}

export interface AffectedCity {
  city: string;
  province: string;
  population: number;
  floodYears: number[];
  primaryFloodType: string;
  majorEvent: string;
  vulnerabilityFactors: string[];
}

export interface ProvincialDeathRecord {
  year: number;
  province: string;
  deaths: number;
}

// ============================================
// YEARLY SUMMARY DATA (2010-2026)
// ============================================
export const floodYearlySummary: FloodYearSummary[] = [
  {
    year: 2010,
    totalDeaths: 1985,
    totalInjured: 2946,
    peopleAffected: 20_000_000,
    districtsAffected: 78,
    housesDestroyed: 1_600_000,
    housesDamaged: 2_000_000,
    economicLossUSD: 9_700_000_000,
    severity: "Catastrophic",
    description: "One of the worst humanitarian disasters in Pakistan's history. 1/5th of country submerged.",
    mostAffectedProvince: "Khyber Pakhtunkhwa",
    floodType: "Riverine and Flash Floods",
  },
  {
    year: 2011,
    totalDeaths: 434,
    totalInjured: 1356,
    peopleAffected: 5_800_000,
    districtsAffected: 16,
    housesDestroyed: 1_500_000,
    housesDamaged: 1_600_000,
    economicLossUSD: 3_700_000_000,
    severity: "Severe",
    description: "Massive monsoon rains devastated Sindh province. Record-breaking rainfall 8-10x drainage capacity.",
    mostAffectedProvince: "Sindh",
    floodType: "Monsoon Flooding",
  },
  {
    year: 2012,
    totalDeaths: 480,
    totalInjured: 2837,
    peopleAffected: 4_847_000,
    districtsAffected: 29,
    housesDestroyed: 216_000,
    housesDamaged: 400_000,
    economicLossUSD: 2_500_000_000,
    severity: "Severe",
    description: "Third consecutive year of major flooding. Severe impacts in Sindh, southern Punjab, and Balochistan.",
    mostAffectedProvince: "Sindh",
    floodType: "Monsoon Flooding",
  },
  {
    year: 2013,
    totalDeaths: 333,
    totalInjured: 1500,
    peopleAffected: 1_500_000,
    districtsAffected: 25,
    housesDestroyed: 36_000,
    housesDamaged: 97_000,
    economicLossUSD: 2_000_000_000,
    severity: "Moderate",
    description: "Flash floods affected parts of Punjab, KP, Sindh, and Balochistan simultaneously.",
    mostAffectedProvince: "Multiple (Punjab, KP, Balochistan)",
    floodType: "Flash Floods",
  },
  {
    year: 2014,
    totalDeaths: 367,
    totalInjured: 1860,
    peopleAffected: 2_500_000,
    districtsAffected: 32,
    housesDestroyed: 129_000,
    housesDamaged: 250_000,
    economicLossUSD: 2_100_000_000,
    severity: "Severe",
    description: "Severe riverine flooding along Chenab and Jhelum rivers. Punjab and AJK worst affected.",
    mostAffectedProvince: "Punjab",
    floodType: "Riverine Flooding",
  },
  {
    year: 2015,
    totalDeaths: 238,
    totalInjured: 945,
    peopleAffected: 1_500_000,
    districtsAffected: 22,
    housesDestroyed: 28_000,
    housesDamaged: 67_000,
    economicLossUSD: 1_000_000_000,
    severity: "Moderate",
    description: "Monsoon rains combined with GLOF events. Chitral and KP regions severely hit.",
    mostAffectedProvince: "Khyber Pakhtunkhwa",
    floodType: "Monsoon and GLOF",
  },
  {
    year: 2016,
    totalDeaths: 262,
    totalInjured: 780,
    peopleAffected: 1_200_000,
    districtsAffected: 18,
    housesDestroyed: 21_000,
    housesDamaged: 55_000,
    economicLossUSD: 800_000_000,
    severity: "Moderate",
    description: "Pre-monsoon and monsoon flash floods. 56% of fatalities in KP. Karakoram Highway blocked.",
    mostAffectedProvince: "Khyber Pakhtunkhwa",
    floodType: "Flash Floods",
  },
  {
    year: 2017,
    totalDeaths: 164,
    totalInjured: 450,
    peopleAffected: 600_000,
    districtsAffected: 15,
    housesDestroyed: 12_000,
    housesDamaged: 38_000,
    economicLossUSD: 500_000_000,
    severity: "Low-Moderate",
    description: "Localized monsoon impacts. Riverine and low-lying districts primarily affected.",
    mostAffectedProvince: "KP and Punjab",
    floodType: "Monsoon Flooding",
  },
  {
    year: 2018,
    totalDeaths: 186,
    totalInjured: 520,
    peopleAffected: 800_000,
    districtsAffected: 17,
    housesDestroyed: 15_000,
    housesDamaged: 42_000,
    economicLossUSD: 600_000_000,
    severity: "Low-Moderate",
    description: "Typical seasonal flooding with manageable impacts compared to mega-flood years.",
    mostAffectedProvince: "Sindh and Balochistan",
    floodType: "Monsoon Flooding",
  },
  {
    year: 2019,
    totalDeaths: 225,
    totalInjured: 680,
    peopleAffected: 950_000,
    districtsAffected: 20,
    housesDestroyed: 18_000,
    housesDamaged: 48_000,
    economicLossUSD: 700_000_000,
    severity: "Moderate",
    description: "Widespread flooding and landslides in KP, Balochistan, and AJK. Mardan and Dir Lower worst hit.",
    mostAffectedProvince: "Khyber Pakhtunkhwa",
    floodType: "Flash Floods and Landslides",
  },
  {
    year: 2020,
    totalDeaths: 410,
    totalInjured: 890,
    peopleAffected: 2_000_000,
    districtsAffected: 24,
    housesDestroyed: 200_000,
    housesDamaged: 350_000,
    economicLossUSD: 1_500_000_000,
    severity: "Severe",
    description: "Record-breaking monsoon. Sindh declared calamity-affected. Karachi received heaviest rain in 89 years.",
    mostAffectedProvince: "Sindh",
    floodType: "Urban and Monsoon Flooding",
  },
  {
    year: 2021,
    totalDeaths: 160,
    totalInjured: 400,
    peopleAffected: 500_000,
    districtsAffected: 14,
    housesDestroyed: 10_000,
    housesDamaged: 30_000,
    economicLossUSD: 400_000_000,
    severity: "Low-Moderate",
    description: "Less catastrophic but still resulted in significant rain-related fatalities across multiple provinces.",
    mostAffectedProvince: "Khyber Pakhtunkhwa",
    floodType: "Monsoon Flooding",
  },
  {
    year: 2022,
    totalDeaths: 1739,
    totalInjured: 12867,
    peopleAffected: 33_000_000,
    districtsAffected: 90,
    housesDestroyed: 2_100_000,
    housesDamaged: 2_800_000,
    economicLossUSD: 40_000_000_000,
    severity: "Catastrophic",
    description: "The 'Monsoon on Steroids'. Nearly 1/3 of country submerged. 84 districts declared calamity-hit.",
    mostAffectedProvince: "Sindh and Balochistan",
    floodType: "Mega Monsoon Flooding",
  },
  {
    year: 2023,
    totalDeaths: 226,
    totalInjured: 349,
    peopleAffected: 1_000_000,
    districtsAffected: 18,
    housesDestroyed: 5_800,
    housesDamaged: 28_000,
    economicLossUSD: 500_000_000,
    severity: "Moderate",
    description: "Recovery year post-2022. Localized flash floods. Sutlej River belt badly hit.",
    mostAffectedProvince: "Punjab",
    floodType: "Flash Floods and Riverine",
  },
  {
    year: 2024,
    totalDeaths: 354,
    totalInjured: 666,
    peopleAffected: 1_500_000,
    districtsAffected: 22,
    housesDestroyed: 20_653,
    housesDamaged: 55_000,
    economicLossUSD: 800_000_000,
    severity: "Moderate-Severe",
    description: "Above-average monsoon. 13 Balochistan districts calamity-hit. Heavy impact in Sindh and Punjab.",
    mostAffectedProvince: "Balochistan and Sindh",
    floodType: "Monsoon and Flash Floods",
  },
  {
    year: 2025,
    totalDeaths: 1037,
    totalInjured: 1067,
    peopleAffected: 6_900_000,
    districtsAffected: 70,
    housesDestroyed: 229_760,
    housesDamaged: 450_000,
    economicLossUSD: 5_000_000_000,
    severity: "Catastrophic",
    description: "Devastating monsoon floods. Worst riverine flooding in decades in Punjab. 2.5M acres farmland damaged.",
    mostAffectedProvince: "Punjab and Khyber Pakhtunkhwa",
    floodType: "Flash and Riverine Flooding",
  },
  {
    year: 2026,
    totalDeaths: 180,
    totalInjured: 350,
    peopleAffected: 600_000,
    districtsAffected: 15,
    housesDestroyed: 8_000,
    housesDamaged: 25_000,
    economicLossUSD: 300_000_000,
    severity: "Moderate (Ongoing)",
    description: "Ongoing monsoon season. Urban flooding in Rawalpindi/Islamabad. Flash floods in northern regions.",
    mostAffectedProvince: "KP and Gilgit-Baltistan",
    floodType: "Urban and Flash Floods",
  },
];

// ============================================
// DISTRICT-LEVEL FLOOD DATA (2010-2026)
// ============================================
export const districtFloodData: DistrictFloodRecord[] = [
  // --- 2010 ---
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Nowshera", deaths: 280, peopleAffected: 1_200_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Charsadda", deaths: 250, peopleAffected: 900_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Swat", deaths: 210, peopleAffected: 750_000, severityLevel: "Critical", floodType: "Flash Flood" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Kohistan", deaths: 130, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Shangla", deaths: 85, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "D.I. Khan", deaths: 75, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Tank", deaths: 45, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Upper Dir", deaths: 40, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2010, province: "Khyber Pakhtunkhwa", district: "Lower Dir", deaths: 35, peopleAffected: 140_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2010, province: "Sindh", district: "Jacobabad", deaths: 80, peopleAffected: 900_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Kashmore", deaths: 65, peopleAffected: 700_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Shikarpur", deaths: 55, peopleAffected: 600_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Ghotki", deaths: 45, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Qambar Shahdad Kot", deaths: 40, peopleAffected: 600_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Dadu", deaths: 40, peopleAffected: 800_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Jamshoro", deaths: 35, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Sindh", district: "Thatta", deaths: 30, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "D.G. Khan", deaths: 30, peopleAffected: 600_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "Rajanpur", deaths: 25, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "Rahim Yar Khan", deaths: 20, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "Layyah", deaths: 15, peopleAffected: 350_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "Bhakkar", deaths: 10, peopleAffected: 300_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2010, province: "Punjab", district: "Mianwali", deaths: 10, peopleAffected: 250_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2010, province: "Balochistan", district: "Jaffarabad", deaths: 65, peopleAffected: 400_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2010, province: "Balochistan", district: "Nasirabad", deaths: 55, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2010, province: "Balochistan", district: "Sibi", deaths: 40, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },

  // --- 2011 ---
  { year: 2011, province: "Sindh", district: "Badin", deaths: 64, peopleAffected: 1_021_301, severityLevel: "Critical", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Mirpurkhas", deaths: 55, peopleAffected: 800_000, severityLevel: "Critical", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Tharparkar", deaths: 45, peopleAffected: 600_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Sanghar", deaths: 40, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Shaheed Benazirabad", deaths: 35, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Tando Allahyar", deaths: 40, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Tando Muhammad Khan", deaths: 35, peopleAffected: 300_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2011, province: "Sindh", district: "Umerkot", deaths: 30, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Monsoon" },

  // --- 2012 ---
  { year: 2012, province: "Sindh", district: "Kashmore", deaths: 50, peopleAffected: 500_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2012, province: "Sindh", district: "Jacobabad", deaths: 45, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2012, province: "Sindh", district: "Shikarpur", deaths: 35, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2012, province: "Balochistan", district: "Jaffarabad", deaths: 40, peopleAffected: 300_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2012, province: "Balochistan", district: "Naseerabad", deaths: 35, peopleAffected: 280_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2012, province: "Punjab", district: "Rajanpur", deaths: 30, peopleAffected: 250_000, severityLevel: "Severe", floodType: "Riverine" },

  // --- 2013 ---
  { year: 2013, province: "Punjab", district: "Rajanpur", deaths: 25, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2013, province: "Punjab", district: "D.G. Khan", deaths: 20, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2013, province: "Khyber Pakhtunkhwa", district: "Chitral", deaths: 25, peopleAffected: 80_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2013, province: "Khyber Pakhtunkhwa", district: "Peshawar", deaths: 18, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2013, province: "Balochistan", district: "Sibi", deaths: 22, peopleAffected: 100_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2013, province: "Balochistan", district: "Jaffarabad", deaths: 20, peopleAffected: 120_000, severityLevel: "Severe", floodType: "Riverine" },

  // --- 2014 ---
  { year: 2014, province: "Punjab", district: "Sialkot", deaths: 30, peopleAffected: 300_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Narowal", deaths: 22, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Lahore", deaths: 18, peopleAffected: 250_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2014, province: "Punjab", district: "Gujranwala", deaths: 15, peopleAffected: 200_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Mandi Bahauddin", deaths: 14, peopleAffected: 180_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Gujrat", deaths: 12, peopleAffected: 170_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Hafizabad", deaths: 10, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Jhelum", deaths: 12, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Chiniot", deaths: 8, peopleAffected: 100_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2014, province: "Punjab", district: "Sargodha", deaths: 10, peopleAffected: 130_000, severityLevel: "Moderate", floodType: "Riverine" },

  // --- 2015 ---
  { year: 2015, province: "Khyber Pakhtunkhwa", district: "Chitral", deaths: 45, peopleAffected: 200_000, severityLevel: "Critical", floodType: "GLOF and Flash Flood" },
  { year: 2015, province: "Khyber Pakhtunkhwa", district: "Dir Upper", deaths: 20, peopleAffected: 100_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2015, province: "Khyber Pakhtunkhwa", district: "Swat", deaths: 15, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2015, province: "Punjab", district: "Rajanpur", deaths: 18, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2015, province: "Punjab", district: "D.G. Khan", deaths: 15, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Riverine" },

  // --- 2016 ---
  { year: 2016, province: "Khyber Pakhtunkhwa", district: "Peshawar", deaths: 30, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2016, province: "Khyber Pakhtunkhwa", district: "Charsadda", deaths: 25, peopleAffected: 150_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2016, province: "Khyber Pakhtunkhwa", district: "Nowshera", deaths: 22, peopleAffected: 140_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2016, province: "Balochistan", district: "Lasbela", deaths: 15, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Flash Flood" },

  // --- 2017 ---
  { year: 2017, province: "Khyber Pakhtunkhwa", district: "D.I. Khan", deaths: 18, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2017, province: "Punjab", district: "Rajanpur", deaths: 12, peopleAffected: 100_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2017, province: "Punjab", district: "Muzaffargarh", deaths: 10, peopleAffected: 90_000, severityLevel: "Moderate", floodType: "Riverine" },

  // --- 2018 ---
  { year: 2018, province: "Sindh", district: "Karachi", deaths: 20, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2018, province: "Balochistan", district: "Quetta", deaths: 18, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2018, province: "Balochistan", district: "Lasbela", deaths: 12, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "Flash Flood" },

  // --- 2019 ---
  { year: 2019, province: "Khyber Pakhtunkhwa", district: "Mardan", deaths: 25, peopleAffected: 100_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2019, province: "Khyber Pakhtunkhwa", district: "Dir Lower", deaths: 20, peopleAffected: 80_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2019, province: "Balochistan", district: "Lasbela", deaths: 18, peopleAffected: 70_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2019, province: "Balochistan", district: "Turbat", deaths: 12, peopleAffected: 50_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2019, province: "AJK", district: "Poonch", deaths: 15, peopleAffected: 40_000, severityLevel: "Moderate", floodType: "Landslide" },

  // --- 2020 ---
  { year: 2020, province: "Sindh", district: "Karachi", deaths: 41, peopleAffected: 500_000, severityLevel: "Critical", floodType: "Urban Flooding" },
  { year: 2020, province: "Sindh", district: "Hyderabad", deaths: 30, peopleAffected: 250_000, severityLevel: "Severe", floodType: "Urban Flooding" },
  { year: 2020, province: "Sindh", district: "Mirpur Khas", deaths: 25, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2020, province: "Sindh", district: "Sukkur", deaths: 20, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2020, province: "Sindh", district: "Larkana", deaths: 18, peopleAffected: 160_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2020, province: "Sindh", district: "Dadu", deaths: 22, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Hill Torrent" },

  // --- 2021 ---
  { year: 2021, province: "Khyber Pakhtunkhwa", district: "Swat", deaths: 15, peopleAffected: 50_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2021, province: "Punjab", district: "Rawalpindi", deaths: 12, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2021, province: "Balochistan", district: "Quetta", deaths: 10, peopleAffected: 40_000, severityLevel: "Moderate", floodType: "Flash Flood" },

  // --- 2022 ---
  { year: 2022, province: "Sindh", district: "Dadu", deaths: 120, peopleAffected: 2_500_000, severityLevel: "Critical", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Jacobabad", deaths: 95, peopleAffected: 1_500_000, severityLevel: "Critical", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Larkana", deaths: 85, peopleAffected: 1_200_000, severityLevel: "Critical", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Qambar Shahdadkot", deaths: 80, peopleAffected: 1_100_000, severityLevel: "Critical", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Sukkur", deaths: 65, peopleAffected: 800_000, severityLevel: "Severe", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Khairpur", deaths: 60, peopleAffected: 900_000, severityLevel: "Severe", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Sanghar", deaths: 55, peopleAffected: 700_000, severityLevel: "Severe", floodType: "Mega Flood" },
  { year: 2022, province: "Sindh", district: "Mirpurkhas", deaths: 50, peopleAffected: 650_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2022, province: "Sindh", district: "Badin", deaths: 45, peopleAffected: 600_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2022, province: "Sindh", district: "Thatta", deaths: 40, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2022, province: "Balochistan", district: "Jaffarabad", deaths: 70, peopleAffected: 800_000, severityLevel: "Critical", floodType: "Flash Flood" },
  { year: 2022, province: "Balochistan", district: "Jhal Magsi", deaths: 55, peopleAffected: 500_000, severityLevel: "Critical", floodType: "Flash Flood" },
  { year: 2022, province: "Balochistan", district: "Lasbela", deaths: 50, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2022, province: "Balochistan", district: "Naseerabad", deaths: 45, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2022, province: "Balochistan", district: "Quetta", deaths: 35, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2022, province: "Punjab", district: "Rajanpur", deaths: 45, peopleAffected: 600_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2022, province: "Punjab", district: "D.G. Khan", deaths: 40, peopleAffected: 500_000, severityLevel: "Severe", floodType: "Hill Torrent" },
  { year: 2022, province: "Punjab", district: "Muzaffargarh", deaths: 30, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2022, province: "Khyber Pakhtunkhwa", district: "D.I. Khan", deaths: 55, peopleAffected: 300_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2022, province: "Khyber Pakhtunkhwa", district: "Tank", deaths: 40, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2022, province: "Khyber Pakhtunkhwa", district: "Charsadda", deaths: 45, peopleAffected: 250_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2022, province: "Khyber Pakhtunkhwa", district: "Swabi", deaths: 35, peopleAffected: 180_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2022, province: "Khyber Pakhtunkhwa", district: "Karak", deaths: 28, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Flash Flood" },

  // --- 2023 ---
  { year: 2023, province: "Punjab", district: "Kasur", deaths: 18, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2023, province: "Punjab", district: "Okara", deaths: 15, peopleAffected: 180_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2023, province: "Punjab", district: "Bahawalnagar", deaths: 12, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2023, province: "Punjab", district: "Lodhran", deaths: 10, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2023, province: "Khyber Pakhtunkhwa", district: "Chitral", deaths: 15, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "GLOF" },
  { year: 2023, province: "Balochistan", district: "Lasbela", deaths: 14, peopleAffected: 70_000, severityLevel: "Moderate", floodType: "Flash Flood" },

  // --- 2024 ---
  { year: 2024, province: "Sindh", district: "Mirpurkhas", deaths: 18, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Sanghar", deaths: 15, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Badin", deaths: 14, peopleAffected: 160_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Jacobabad", deaths: 12, peopleAffected: 140_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2024, province: "Sindh", district: "Dadu", deaths: 10, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Khairpur", deaths: 8, peopleAffected: 100_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Qambar Shahdadkot", deaths: 8, peopleAffected: 90_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2024, province: "Sindh", district: "Umerkot", deaths: 6, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2024, province: "Balochistan", district: "Jaffarabad", deaths: 22, peopleAffected: 100_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2024, province: "Balochistan", district: "Lasbela", deaths: 18, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2024, province: "Balochistan", district: "Quetta", deaths: 15, peopleAffected: 70_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2024, province: "Punjab", district: "Rajanpur", deaths: 16, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2024, province: "Punjab", district: "D.G. Khan", deaths: 14, peopleAffected: 100_000, severityLevel: "Moderate", floodType: "Hill Torrent" },

  // --- 2025 ---
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Swat", deaths: 85, peopleAffected: 400_000, severityLevel: "Critical", floodType: "Flash Flood" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Buner", deaths: 65, peopleAffected: 250_000, severityLevel: "Critical", floodType: "Flash Flood" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Bhattagram", deaths: 55, peopleAffected: 180_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Bajur", deaths: 50, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Dir Upper", deaths: 48, peopleAffected: 150_000, severityLevel: "Severe", floodType: "Flash Flood" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Chitral", deaths: 40, peopleAffected: 120_000, severityLevel: "Severe", floodType: "GLOF" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Nowshera", deaths: 35, peopleAffected: 200_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2025, province: "Khyber Pakhtunkhwa", district: "Charsadda", deaths: 30, peopleAffected: 180_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2025, province: "Punjab", district: "Multan", deaths: 55, peopleAffected: 600_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2025, province: "Punjab", district: "Muzaffargarh", deaths: 50, peopleAffected: 500_000, severityLevel: "Critical", floodType: "Riverine" },
  { year: 2025, province: "Punjab", district: "Rajanpur", deaths: 45, peopleAffected: 450_000, severityLevel: "Severe", floodType: "Riverine" },
  { year: 2025, province: "Punjab", district: "D.G. Khan", deaths: 40, peopleAffected: 400_000, severityLevel: "Severe", floodType: "Hill Torrent" },
  { year: 2025, province: "Punjab", district: "Lahore", deaths: 30, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Urban Flooding" },
  { year: 2025, province: "Punjab", district: "Rahim Yar Khan", deaths: 28, peopleAffected: 300_000, severityLevel: "Moderate", floodType: "Riverine" },
  { year: 2025, province: "Sindh", district: "Karachi", deaths: 22, peopleAffected: 350_000, severityLevel: "Severe", floodType: "Urban Flooding" },
  { year: 2025, province: "Sindh", district: "Hyderabad", deaths: 18, peopleAffected: 200_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2025, province: "Sindh", district: "Mirpurkhas", deaths: 15, peopleAffected: 180_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2025, province: "Sindh", district: "Thatta", deaths: 12, peopleAffected: 150_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2025, province: "Sindh", district: "Badin", deaths: 10, peopleAffected: 120_000, severityLevel: "Moderate", floodType: "Monsoon" },
  { year: 2025, province: "Balochistan", district: "Kachhi", deaths: 20, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2025, province: "Balochistan", district: "Khuzdar", deaths: 15, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2025, province: "Gilgit-Baltistan", district: "Diamer", deaths: 18, peopleAffected: 40_000, severityLevel: "Moderate", floodType: "GLOF" },
  { year: 2025, province: "Gilgit-Baltistan", district: "Ghizer", deaths: 12, peopleAffected: 30_000, severityLevel: "Moderate", floodType: "Landslide" },

  // --- 2026 (Ongoing) ---
  { year: 2026, province: "Khyber Pakhtunkhwa", district: "Peshawar", deaths: 15, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2026, province: "Khyber Pakhtunkhwa", district: "Nowshera", deaths: 12, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2026, province: "Khyber Pakhtunkhwa", district: "Swabi", deaths: 10, peopleAffected: 50_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2026, province: "Khyber Pakhtunkhwa", district: "Mardan", deaths: 8, peopleAffected: 40_000, severityLevel: "Moderate", floodType: "Flash Flood" },
  { year: 2026, province: "Punjab", district: "Rawalpindi", deaths: 18, peopleAffected: 100_000, severityLevel: "Severe", floodType: "Urban Flooding" },
  { year: 2026, province: "Punjab", district: "Islamabad", deaths: 10, peopleAffected: 60_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2026, province: "Sindh", district: "Karachi", deaths: 12, peopleAffected: 80_000, severityLevel: "Moderate", floodType: "Urban Flooding" },
  { year: 2026, province: "Gilgit-Baltistan", district: "Diamer", deaths: 8, peopleAffected: 20_000, severityLevel: "Moderate", floodType: "GLOF" },
];

// ============================================
// PROVINCIAL DEATH RECORDS (2010-2026)
// ============================================
export const provincialDeathData: ProvincialDeathRecord[] = [
  // 2010
  { year: 2010, province: "Khyber Pakhtunkhwa", deaths: 1156 },
  { year: 2010, province: "Sindh", deaths: 411 },
  { year: 2010, province: "Balochistan", deaths: 183 },
  { year: 2010, province: "Punjab", deaths: 110 },
  { year: 2010, province: "Gilgit-Baltistan", deaths: 75 },
  { year: 2010, province: "AJK", deaths: 50 },
  // 2011
  { year: 2011, province: "Sindh", deaths: 390 },
  { year: 2011, province: "Balochistan", deaths: 25 },
  { year: 2011, province: "Punjab", deaths: 12 },
  { year: 2011, province: "Khyber Pakhtunkhwa", deaths: 7 },
  // 2012
  { year: 2012, province: "Sindh", deaths: 220 },
  { year: 2012, province: "Balochistan", deaths: 110 },
  { year: 2012, province: "Punjab", deaths: 85 },
  { year: 2012, province: "Khyber Pakhtunkhwa", deaths: 65 },
  // 2013
  { year: 2013, province: "Punjab", deaths: 95 },
  { year: 2013, province: "Khyber Pakhtunkhwa", deaths: 90 },
  { year: 2013, province: "Balochistan", deaths: 80 },
  { year: 2013, province: "Sindh", deaths: 45 },
  { year: 2013, province: "AJK", deaths: 23 },
  // 2014
  { year: 2014, province: "Punjab", deaths: 158 },
  { year: 2014, province: "AJK", deaths: 85 },
  { year: 2014, province: "Khyber Pakhtunkhwa", deaths: 60 },
  { year: 2014, province: "Sindh", deaths: 35 },
  { year: 2014, province: "Gilgit-Baltistan", deaths: 29 },
  // 2015
  { year: 2015, province: "Khyber Pakhtunkhwa", deaths: 105 },
  { year: 2015, province: "Punjab", deaths: 68 },
  { year: 2015, province: "Balochistan", deaths: 35 },
  { year: 2015, province: "Sindh", deaths: 20 },
  { year: 2015, province: "Gilgit-Baltistan", deaths: 10 },
  // 2016
  { year: 2016, province: "Khyber Pakhtunkhwa", deaths: 147 },
  { year: 2016, province: "Punjab", deaths: 55 },
  { year: 2016, province: "Balochistan", deaths: 38 },
  { year: 2016, province: "Sindh", deaths: 15 },
  { year: 2016, province: "Gilgit-Baltistan", deaths: 7 },
  // 2017
  { year: 2017, province: "Khyber Pakhtunkhwa", deaths: 65 },
  { year: 2017, province: "Punjab", deaths: 45 },
  { year: 2017, province: "Balochistan", deaths: 30 },
  { year: 2017, province: "Sindh", deaths: 18 },
  { year: 2017, province: "Gilgit-Baltistan", deaths: 6 },
  // 2018
  { year: 2018, province: "Sindh", deaths: 55 },
  { year: 2018, province: "Balochistan", deaths: 50 },
  { year: 2018, province: "Punjab", deaths: 40 },
  { year: 2018, province: "Khyber Pakhtunkhwa", deaths: 35 },
  { year: 2018, province: "AJK", deaths: 6 },
  // 2019
  { year: 2019, province: "Khyber Pakhtunkhwa", deaths: 95 },
  { year: 2019, province: "Balochistan", deaths: 52 },
  { year: 2019, province: "Punjab", deaths: 40 },
  { year: 2019, province: "AJK", deaths: 25 },
  { year: 2019, province: "Sindh", deaths: 13 },
  // 2020
  { year: 2020, province: "Sindh", deaths: 180 },
  { year: 2020, province: "Khyber Pakhtunkhwa", deaths: 85 },
  { year: 2020, province: "Balochistan", deaths: 72 },
  { year: 2020, province: "Punjab", deaths: 55 },
  { year: 2020, province: "AJK", deaths: 18 },
  // 2021
  { year: 2021, province: "Khyber Pakhtunkhwa", deaths: 60 },
  { year: 2021, province: "Punjab", deaths: 47 },
  { year: 2021, province: "Balochistan", deaths: 24 },
  { year: 2021, province: "AJK", deaths: 21 },
  { year: 2021, province: "Sindh", deaths: 8 },
  // 2022
  { year: 2022, province: "Sindh", deaths: 870 },
  { year: 2022, province: "Balochistan", deaths: 330 },
  { year: 2022, province: "Khyber Pakhtunkhwa", deaths: 330 },
  { year: 2022, province: "Punjab", deaths: 165 },
  { year: 2022, province: "AJK", deaths: 25 },
  { year: 2022, province: "Gilgit-Baltistan", deaths: 19 },
  // 2023
  { year: 2023, province: "Punjab", deaths: 72 },
  { year: 2023, province: "Khyber Pakhtunkhwa", deaths: 65 },
  { year: 2023, province: "Balochistan", deaths: 48 },
  { year: 2023, province: "Sindh", deaths: 28 },
  { year: 2023, province: "Gilgit-Baltistan", deaths: 13 },
  // 2024
  { year: 2024, province: "Balochistan", deaths: 118 },
  { year: 2024, province: "Sindh", deaths: 95 },
  { year: 2024, province: "Punjab", deaths: 72 },
  { year: 2024, province: "Khyber Pakhtunkhwa", deaths: 55 },
  { year: 2024, province: "AJK", deaths: 14 },
  // 2025
  { year: 2025, province: "Khyber Pakhtunkhwa", deaths: 509 },
  { year: 2025, province: "Punjab", deaths: 322 },
  { year: 2025, province: "Sindh", deaths: 90 },
  { year: 2025, province: "Balochistan", deaths: 65 },
  { year: 2025, province: "Gilgit-Baltistan", deaths: 35 },
  { year: 2025, province: "AJK", deaths: 16 },
  // 2026
  { year: 2026, province: "Khyber Pakhtunkhwa", deaths: 60 },
  { year: 2026, province: "Punjab", deaths: 45 },
  { year: 2026, province: "Sindh", deaths: 30 },
  { year: 2026, province: "Balochistan", deaths: 25 },
  { year: 2026, province: "Gilgit-Baltistan", deaths: 15 },
  { year: 2026, province: "AJK", deaths: 5 },
];

// ============================================
// MOST AFFECTED DISTRICTS (ALL-TIME RANKING)
// ============================================
export const mostAffectedDistricts: MostAffectedDistrict[] = [
  { rank: 1, district: "Nowshera", province: "Khyber Pakhtunkhwa", timesAffected: 8, worstYear: 2010, totalEstimatedDeaths: 362, reason: "Located along Kabul River; highly vulnerable to riverine flooding" },
  { rank: 2, district: "Jacobabad", province: "Sindh", timesAffected: 7, worstYear: 2022, totalEstimatedDeaths: 244, reason: "Low-lying area in upper Sindh; receives floodwaters from Indus and hill torrents" },
  { rank: 3, district: "Rajanpur", province: "Punjab", timesAffected: 9, worstYear: 2022, totalEstimatedDeaths: 171, reason: "Between Indus River and Sulaiman Mountains; combined riverine and hill torrent flooding" },
  { rank: 4, district: "Charsadda", province: "Khyber Pakhtunkhwa", timesAffected: 7, worstYear: 2010, totalEstimatedDeaths: 350, reason: "Confluence of Kabul and Swat rivers; extreme vulnerability" },
  { rank: 5, district: "Swat", province: "Khyber Pakhtunkhwa", timesAffected: 7, worstYear: 2010, totalEstimatedDeaths: 325, reason: "Mountainous terrain with Swat River; prone to flash floods and GLOFs" },
  { rank: 6, district: "Dadu", province: "Sindh", timesAffected: 6, worstYear: 2022, totalEstimatedDeaths: 192, reason: "Indus River passes through; massive inundation during mega floods" },
  { rank: 7, district: "Jaffarabad", province: "Balochistan", timesAffected: 7, worstYear: 2022, totalEstimatedDeaths: 217, reason: "Flat terrain along Pat Feeder Canal; receives both Indus and hill torrent water" },
  { rank: 8, district: "D.G. Khan", province: "Punjab", timesAffected: 7, worstYear: 2025, totalEstimatedDeaths: 159, reason: "Between Sulaiman Range and Indus; combined hill torrent and riverine flooding" },
  { rank: 9, district: "Karachi", province: "Sindh", timesAffected: 5, worstYear: 2020, totalEstimatedDeaths: 95, reason: "Inadequate drainage infrastructure; coastal city vulnerable to urban flooding" },
  { rank: 10, district: "Kashmore", province: "Sindh", timesAffected: 5, worstYear: 2010, totalEstimatedDeaths: 115, reason: "Upper Sindh district along Indus River; receives early floodwaters" },
];

// ============================================
// TOP AFFECTED CITIES
// ============================================
export const topAffectedCities: AffectedCity[] = [
  {
    city: "Karachi", province: "Sindh", population: 16_000_000,
    floodYears: [2018, 2020, 2022, 2025, 2026],
    primaryFloodType: "Urban Flooding",
    majorEvent: "2020 - Heaviest rainfall in 89 years (490mm in August)",
    vulnerabilityFactors: ["Poor drainage", "Rapid urbanization", "Coastal location", "Encroachment on nullahs"],
  },
  {
    city: "Hyderabad", province: "Sindh", population: 3_000_000,
    floodYears: [2010, 2011, 2020, 2022, 2025],
    primaryFloodType: "Urban and Riverine",
    majorEvent: "2022 - Massive inundation during mega flood",
    vulnerabilityFactors: ["Indus River proximity", "Low elevation", "Aging infrastructure"],
  },
  {
    city: "Peshawar", province: "Khyber Pakhtunkhwa", population: 2_200_000,
    floodYears: [2010, 2013, 2016, 2022, 2026],
    primaryFloodType: "Urban and Flash Flood",
    majorEvent: "2010 - Kabul River devastation",
    vulnerabilityFactors: ["Kabul River proximity", "Rapid urbanization", "Downstream from mountains"],
  },
  {
    city: "Rawalpindi", province: "Punjab", population: 2_300_000,
    floodYears: [2014, 2021, 2025, 2026],
    primaryFloodType: "Urban Flooding",
    majorEvent: "2026 - Extreme rainfall caused severe urban flooding",
    vulnerabilityFactors: ["Nullah Leh", "Encroachments on waterways", "Margalla Hills runoff"],
  },
  {
    city: "Lahore", province: "Punjab", population: 13_000_000,
    floodYears: [2014, 2022, 2025],
    primaryFloodType: "Urban and Riverine",
    majorEvent: "2025 - Ravi River flooding threatened city",
    vulnerabilityFactors: ["Ravi River proximity", "High water table", "Poor drainage"],
  },
  {
    city: "Multan", province: "Punjab", population: 2_200_000,
    floodYears: [2010, 2014, 2022, 2025],
    primaryFloodType: "Riverine",
    majorEvent: "2025 - Extended submersion from Chenab River flooding",
    vulnerabilityFactors: ["Chenab River confluence", "Flat terrain", "Agricultural dependency"],
  },
  {
    city: "Quetta", province: "Balochistan", population: 1_200_000,
    floodYears: [2018, 2021, 2022, 2024],
    primaryFloodType: "Flash Flood",
    majorEvent: "2022 - Severe flash flooding across Balochistan",
    vulnerabilityFactors: ["Mountain surrounded valley", "Limited drainage", "Climate extremes"],
  },
  {
    city: "Sukkur", province: "Sindh", population: 700_000,
    floodYears: [2010, 2020, 2022, 2024],
    primaryFloodType: "Riverine",
    majorEvent: "2022 - Sukkur Barrage threatened by historic high water levels",
    vulnerabilityFactors: ["Sukkur Barrage", "Indus River dependency", "Low elevation"],
  },
  {
    city: "Nowshera", province: "Khyber Pakhtunkhwa", population: 900_000,
    floodYears: [2010, 2016, 2022, 2025, 2026],
    primaryFloodType: "Riverine",
    majorEvent: "2010 - Completely submerged by Kabul River overflow",
    vulnerabilityFactors: ["Kabul River banks", "Low-lying city center", "Recurring seasonal floods"],
  },
  {
    city: "Chitral", province: "Khyber Pakhtunkhwa", population: 400_000,
    floodYears: [2013, 2015, 2023, 2025],
    primaryFloodType: "GLOF and Flash Flood",
    majorEvent: "2015 - Devastating GLOF event",
    vulnerabilityFactors: ["Glacial lakes", "Remote mountainous terrain", "Limited infrastructure"],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Get flood data for a specific year */
export const getFloodDataByYear = (year: number) => ({
  summary: floodYearlySummary.find((s) => s.year === year),
  districts: districtFloodData.filter((d) => d.year === year),
  provincialDeaths: provincialDeathData.filter((p) => p.year === year),
});

/** Get all flood records for a specific district */
export const getDistrictHistory = (district: string) =>
  districtFloodData.filter((d) => d.district.toLowerCase() === district.toLowerCase());

/** Get all flood records for a specific province */
export const getProvinceData = (province: string) =>
  districtFloodData.filter((d) => d.province.toLowerCase() === province.toLowerCase());

/** Get total deaths across all years */
export const getTotalDeaths = () =>
  floodYearlySummary.reduce((sum, year) => sum + year.totalDeaths, 0);

/** Get the worst flood year by deaths */
export const getWorstYear = () =>
  floodYearlySummary.reduce((worst, current) =>
    current.totalDeaths > worst.totalDeaths ? current : worst
  );

/** Get unique affected districts count */
export const getUniqueAffectedDistricts = () =>
  new Set(districtFloodData.map((d) => d.district)).size;

/** Get all years where a province was most affected */
export const getProvinceWorstYears = (province: string) =>
  floodYearlySummary.filter((s) =>
    s.mostAffectedProvince.toLowerCase().includes(province.toLowerCase())
  );
