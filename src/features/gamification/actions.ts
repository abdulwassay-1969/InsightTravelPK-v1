'use server';

export interface BadgeInfo {
  badgeId: string;
  name: string;
  description: string;
  earnedAt: Date;
}

export interface CheckInInfo {
  locationId: string;
  timestamp: Date;
}

// Mock data stores (replace with Firestore in production)
const userBadges: Record<string, BadgeInfo[]> = {};
const userCheckIns: Record<string, CheckInInfo[]> = {};

/** Retrieve all badges earned by a user */
export async function getUserBadges(userId: string): Promise<BadgeInfo[]> {
  return userBadges[userId] ?? [];
}

/** Award a badge to a user */
export async function awardBadge(userId: string, badge: Omit<BadgeInfo, 'earnedAt'>): Promise<void> {
  const badgeInfo: BadgeInfo = { ...badge, earnedAt: new Date() };
  const existing = userBadges[userId] ?? [];
  userBadges[userId] = [...existing, badgeInfo];
}

/** Record a location check‑in for a user */
export async function recordCheckIn(userId: string, locationId: string): Promise<void> {
  const checkIn: CheckInInfo = { locationId, timestamp: new Date() };
  const existing = userCheckIns[userId] ?? [];
  userCheckIns[userId] = [...existing, checkIn];
}
