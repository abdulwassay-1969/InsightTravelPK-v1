'use server';

export interface CrowdData {
  locationId: string;
  locationName: string;
  currentDensity: 'Empty' | 'Quiet' | 'Moderate' | 'Busy' | 'Peak';
  bestMonths: string[];
  peakMonths: string[];
  bestTimeOfDay: string;
  avgWaitMinutes: number;
  tip: string;
}

export interface AlternativeDestination {
  name: string;
  locationId: string;
  reason: string;
}

type LocationDataMap = Record<
  string,
  Omit<CrowdData, 'locationId' | 'locationName' | 'currentDensity'>
>;

const locationData: LocationDataMap = {
  'hunza-valley': {
    bestMonths: ['April', 'May', 'September', 'October'],
    peakMonths: ['July', 'August'],
    bestTimeOfDay: 'Early morning (6–9am)',
    avgWaitMinutes: 20,
    tip: 'Visit in April for cherry blossoms with far fewer tourists than summer.',
  },
  'skardu': {
    bestMonths: ['May', 'June', 'September', 'October'],
    peakMonths: ['July', 'August'],
    bestTimeOfDay: 'Early morning (6–9am)',
    avgWaitMinutes: 25,
    tip: 'Book accommodations months in advance for July–August; shoulder season offers the same views with half the crowd.',
  },
  'badshahi-mosque': {
    bestMonths: ['October', 'November', 'February', 'March'],
    peakMonths: ['July', 'August', 'December'],
    bestTimeOfDay: 'Weekday mornings (8–11am)',
    avgWaitMinutes: 15,
    tip: 'Arrive right after Fajr prayer on weekdays to explore with virtually no crowds.',
  },
  'faisal-mosque': {
    bestMonths: ['October', 'November', 'March', 'April'],
    peakMonths: ['July', 'August', 'December'],
    bestTimeOfDay: 'Early morning (7–10am)',
    avgWaitMinutes: 10,
    tip: 'Weekday mornings are significantly quieter. Avoid Friday noon entirely.',
  },
  'mohenjo-daro': {
    bestMonths: ['November', 'December', 'January', 'February'],
    peakMonths: ['March', 'April'],
    bestTimeOfDay: 'Morning (8–11am)',
    avgWaitMinutes: 5,
    tip: 'Winter months are best — cooler weather and fewer visitors make exploration comfortable.',
  },
  'swat-valley': {
    bestMonths: ['April', 'May', 'September', 'October'],
    peakMonths: ['July', 'August'],
    bestTimeOfDay: 'Early morning (6–9am)',
    avgWaitMinutes: 15,
    tip: 'Spring (April–May) offers lush greenery and far fewer tourists than peak summer.',
  },
  'neelum-valley': {
    bestMonths: ['May', 'June', 'September'],
    peakMonths: ['July', 'August'],
    bestTimeOfDay: 'Early morning (6–9am)',
    avgWaitMinutes: 30,
    tip: 'Traffic jams are common in peak season — start your drive before 7am from Muzaffarabad.',
  },
};

const densityPool: CrowdData['currentDensity'][] = ['Quiet', 'Moderate', 'Busy'];

function getSimulatedDensity(): CrowdData['currentDensity'] {
  const hour = new Date().getHours();
  // Morning and late evening feel quieter
  if (hour < 7 || hour >= 19) return 'Quiet';
  // Mid-morning / mid-afternoon busiest
  if ((hour >= 10 && hour <= 13) || (hour >= 15 && hour <= 17)) return 'Busy';
  return densityPool[Math.floor(Math.random() * densityPool.length)];
}

export async function getCrowdInfo(
  locationId: string,
  locationName: string
): Promise<CrowdData> {
  const data = locationData[locationId];

  if (data) {
    return {
      locationId,
      locationName,
      currentDensity: getSimulatedDensity(),
      ...data,
    };
  }

  // Default fallback
  return {
    locationId,
    locationName,
    currentDensity: getSimulatedDensity(),
    bestMonths: ['April', 'September', 'October'],
    peakMonths: ['July', 'August'],
    bestTimeOfDay: 'Early morning (6–9am)',
    avgWaitMinutes: 10,
    tip: 'Visit during weekday mornings for the best experience with fewer tourists.',
  };
}

type AlternativeMap = Record<string, AlternativeDestination[]>;

const alternativesMap: AlternativeMap = {
  'hunza-valley': [
    {
      name: 'Shigar Valley',
      locationId: 'shigar-valley',
      reason: 'Less commercialised than Hunza; ancient forts and apricot orchards with minimal tourist infrastructure.',
    },
    {
      name: 'Hispar Valley',
      locationId: 'hispar-valley',
      reason: 'Remote glacial valley rarely visited — near Hunza but virtually crowd-free.',
    },
    {
      name: 'Naltar Valley',
      locationId: 'naltar-valley',
      reason: 'Stunning coloured lakes and pine forests with a fraction of Hunza\'s visitor numbers.',
    },
  ],
  'skardu': [
    {
      name: 'Khaplu Valley',
      locationId: 'khaplu-valley',
      reason: 'Quieter royal town near Skardu with a beautiful palace and less tourist traffic.',
    },
    {
      name: 'Roundu Valley',
      locationId: 'roundu-valley',
      reason: 'Untouched riverside scenery along the Shyok River, largely undiscovered.',
    },
  ],
  'badshahi-mosque': [
    {
      name: 'Wazir Khan Mosque',
      locationId: 'wazir-khan-mosque',
      reason: 'Equally stunning Mughal tilework inside the Walled City with far fewer visitors.',
    },
    {
      name: 'Sunehri Masjid',
      locationId: 'sunehri-masjid',
      reason: 'Smaller golden mosque in Peshawar offering authentic Mughal atmosphere without the queues.',
    },
  ],
  'faisal-mosque': [
    {
      name: 'Shah Faisal Mosque Viewpoint Trail',
      locationId: 'margalla-trail-3',
      reason: 'Margalla Trail 3 offers aerial views of the mosque with only hikers for company.',
    },
    {
      name: 'Golra Sharif Shrine',
      locationId: 'golra-sharif',
      reason: 'Historic spiritual site in Islamabad\'s outskirts — peaceful and rarely crowded.',
    },
  ],
  'swat-valley': [
    {
      name: 'Gabral Valley',
      locationId: 'gabral-valley',
      reason: 'Remote side valley off Swat with pristine forests and almost no tourist infrastructure.',
    },
    {
      name: 'Ushu Forest',
      locationId: 'ushu-forest',
      reason: 'Dense pine forest near Kalam visited mainly by locals — tranquil and photogenic.',
    },
  ],
  'neelum-valley': [
    {
      name: 'Leepa Valley',
      locationId: 'leepa-valley',
      reason: 'AJK\'s hidden gem with terraced fields and wooden villages, much quieter than Neelum.',
    },
    {
      name: 'Chikar',
      locationId: 'chikar-ajk',
      reason: 'Small hill station above Muzaffarabad — cooler and crowd-free even in summer.',
    },
  ],
  'mohenjo-daro': [
    {
      name: 'Kot Diji Fort',
      locationId: 'kot-diji-fort',
      reason: 'Pre-Indus Valley fortress near Khairpur — historically rich and barely visited.',
    },
    {
      name: 'Amri Archaeological Site',
      locationId: 'amri-site',
      reason: 'Ancient Indus settlement south of Mohenjo-daro with almost no tourist crowds.',
    },
  ],
};

export async function getAlternativeDestinations(
  locationId: string
): Promise<AlternativeDestination[]> {
  return (
    alternativesMap[locationId] ?? [
      {
        name: 'Deosai Plains',
        locationId: 'deosai-plains',
        reason: 'World\'s second-highest plateau — vast, serene, and far off the beaten tourist trail.',
      },
      {
        name: 'Gorakh Hill Station',
        locationId: 'gorakh-hill',
        reason: 'Sindh\'s highest peak with stunning views and minimal visitor numbers.',
      },
    ]
  );
}
