'use server';

export interface PermitInfo {
  locationId: string;
  locationName: string;
  permitRequired: boolean;
  permitType?: string; // e.g., 'National Park', 'Border Crossing'
  feePKR?: number;
  applicationUrl?: string;
}

// Mock data for demonstration; in production this would query a real API or Firestore
export async function getPermitInfo(locationId: string, locationName: string): Promise<PermitInfo> {
  const permits: Record<string, PermitInfo> = {
    'hunza-valley': {
      locationId,
      locationName,
      permitRequired: true,
      permitType: 'National Park Entry',
      feePKR: 1500,
      applicationUrl: 'https://permit.gov.pk/hunza',
    },
    'k2-basecamp': {
      locationId,
      locationName,
      permitRequired: true,
      permitType: 'Mountaineering Permit',
      feePKR: 5000,
      applicationUrl: 'https://permit.gov.pk/k2',
    },
    'fairy-meadows': {
      locationId,
      locationName,
      permitRequired: false,
    },
  };

  return permits[locationId] ?? {
    locationId,
    locationName,
    permitRequired: false,
  };
}
