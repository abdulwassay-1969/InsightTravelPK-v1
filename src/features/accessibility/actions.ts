'use server';

export interface AccessibilityInfo {
  locationId: string;
  locationName: string;
  wheelchairAccess: boolean;
  seniorFriendly: boolean;
  familyFriendly: boolean;
  altitude: number; // meters above sea level
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
  nearestHospital: string;
  hospitalDistanceKm: number;
  prayerFacilities: boolean;
  halalFood: boolean;
  notes: string;
}

export interface HospitalInfo {
  name: string;
  city: string;
  phone: string;
  type: 'Public' | 'Private' | 'Military' | 'Mission';
}

const ACCESS_DATA: Record<string, Omit<AccessibilityInfo, 'locationId' | 'locationName'>> = {
  'faisal-mosque': {
    wheelchairAccess: true,
    seniorFriendly: true,
    familyFriendly: true,
    altitude: 540,
    difficulty: 'Easy',
    nearestHospital: 'Pakistan Institute of Medical Sciences (PIMS)',
    hospitalDistanceKm: 3,
    prayerFacilities: true,
    halalFood: true,
    notes: 'Easily reachable via Margalla Road, ample parking and prayer area.'
  },
  'badshahi-mosque': {
    wheelchairAccess: true,
    seniorFriendly: true,
    familyFriendly: true,
    altitude: 220,
    difficulty: 'Easy',
    nearestHospital: 'Services Hospital',
    hospitalDistanceKm: 2,
    prayerFacilities: true,
    halalFood: true,
    notes: 'Ramps available at main entrances; crowded during Friday prayers.'
  },
  'hunza-valley': {
    wheelchairAccess: false,
    seniorFriendly: false,
    familyFriendly: true,
    altitude: 2438,
    difficulty: 'Moderate',
    nearestHospital: 'District Headquarters Hospital Gilgit',
    hospitalDistanceKm: 100,
    prayerFacilities: true,
    halalFood: true,
    notes: 'Roads can be rough; advisable to travel with a guide.'
  },
  'skardu': {
    wheelchairAccess: false,
    seniorFriendly: false,
    familyFriendly: true,
    altitude: 2500,
    difficulty: 'Moderate',
    nearestHospital: 'Combined Military Hospital (CMH) Skardu',
    hospitalDistanceKm: 5,
    prayerFacilities: true,
    halalFood: true,
    notes: 'Limited medical facilities; carry basic first‑aid supplies.'
  }
};

export async function getAccessibilityInfo(locationId: string, locationName: string): Promise<AccessibilityInfo> {
  const data = ACCESS_DATA[locationId];
  if (data) {
    return { locationId, locationName, ...data };
  }
  // Default fallback
  return {
    locationId,
    locationName,
    wheelchairAccess: false,
    seniorFriendly: false,
    familyFriendly: true,
    altitude: 0,
    difficulty: 'Easy',
    nearestHospital: 'Not available',
    hospitalDistanceKm: 0,
    prayerFacilities: false,
    halalFood: false,
    notes: 'No specific accessibility data.'
  };
}

// Mock hospitals per province
export const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad'];

export async function getHealthcareFacilities(province: string): Promise<HospitalInfo[]> {
  const mock: Record<string, HospitalInfo[]> = {
    Punjab: [
      { name: 'Mayo Hospital', city: 'Lahore', phone: '+92-42-111-111-111', type: 'Public' },
      { name: 'Shifa International', city: 'Islamabad', phone: '+92-51-111-111-111', type: 'Private' },
      { name: 'Combined Military Hospital', city: 'Rawalpindi', phone: '+92-51-222-222-222', type: 'Military' }
    ],
    Sindh: [
      { name: 'Jinnah Postgraduate Medical Centre', city: 'Karachi', phone: '+92-21-111-111-111', type: 'Public' },
      { name: 'Aga Khan University Hospital', city: 'Karachi', phone: '+92-21-222-222-222', type: 'Private' }
    ],
    'Gilgit-Baltistan': [
      { name: 'DHQ Gilgit', city: 'Gilgit', phone: '+92-5811-111111', type: 'Public' },
      { name: 'SKCH Hospital', city: 'Skardu', phone: '+92-5812-222222', type: 'Public' }
    ],
    // other provinces can be added similarly
  };
  return mock[province] ?? [];
}
