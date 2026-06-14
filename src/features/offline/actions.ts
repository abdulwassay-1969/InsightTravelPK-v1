'use server';

export interface OfflinePackage {
  province: string;
  spotCount: number;
  packageSizeMb: number;
  lastUpdated: string;
}

export async function downloadOfflineMap(province: string): Promise<OfflinePackage> {
  // Simulate packaging and downloading geographic data for offline use
  const sizes: Record<string, number> = {
    all: 4.8,
    punjab: 1.2,
    sindh: 0.8,
    kp: 1.5,
    balochistan: 0.5,
    gilgit_baltistan: 1.9,
    azad_kashmir: 0.6,
    capital: 0.3
  };

  const spotCounts: Record<string, number> = {
    all: 215,
    punjab: 48,
    sindh: 32,
    kp: 55,
    balochistan: 15,
    gilgit_baltistan: 40,
    azad_kashmir: 17,
    capital: 8
  };

  return {
    province,
    spotCount: spotCounts[province] || 10,
    packageSizeMb: sizes[province] || 0.5,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}
