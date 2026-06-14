'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface CreatorProfile {
  id?: string;
  userId: string;
  displayName: string;
  bio: string;
  followers: number;
  totalViews: number;
  earnings: number;
  verified: boolean;
  createdAt?: string;
}

export interface CreatorContent {
  id?: string;
  creatorId: string;
  title: string;
  type: 'itinerary' | 'review' | 'vlog';
  views: number;
  earnings: number;
  embedCode?: string;
}

// ─── Register Creator ─────────────────────────────────────────────────────────

export async function registerCreator(
  userId: string,
  displayName: string,
  bio: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const profileRef = doc(db, 'creator_profiles', userId);
    const existing = await getDoc(profileRef);

    if (existing.exists()) {
      return { success: false, error: 'Creator profile already exists.' };
    }

    const profile: CreatorProfile = {
      userId,
      displayName: displayName.trim(),
      bio: bio.trim(),
      followers: 0,
      totalViews: 0,
      earnings: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    };

    await setDoc(profileRef, profile);
    return { success: true };
  } catch (err) {
    console.error('registerCreator error:', err);
    return { success: false, error: 'Failed to register creator. Please try again.' };
  }
}

// ─── Get Creator Profile ──────────────────────────────────────────────────────

export async function getCreatorProfile(
  userId: string
): Promise<CreatorProfile | null> {
  try {
    const profileRef = doc(db, 'creator_profiles', userId);
    const snap = await getDoc(profileRef);

    if (!snap.exists()) return null;

    return { id: snap.id, ...(snap.data() as Omit<CreatorProfile, 'id'>) };
  } catch (err) {
    console.error('getCreatorProfile error:', err);
    return null;
  }
}

// ─── Generate Embed Code ──────────────────────────────────────────────────────

export async function generateEmbedCode(
  tripId: string,
  creatorId: string
): Promise<string> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://insighttravelpk.com';

  return `<iframe
  src="${baseUrl}/embed/itinerary/${tripId}?creator=${creatorId}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius:12px;overflow:hidden;"
  allow="clipboard-read; clipboard-write"
  title="InsightTravelPK Itinerary – ${tripId}"
></iframe>`;
}

// ─── Get Creator Stats ────────────────────────────────────────────────────────

export async function getCreatorStats(creatorId: string): Promise<{
  totalViews: number;
  totalEarnings: number;
  contentCount: number;
  topContent: CreatorContent[];
}> {
  // Mock realistic stats — replace with real Firestore reads when content
  // collection is live.
  const mockContent: CreatorContent[] = [
    {
      id: 'c1',
      creatorId,
      title: '7-Day Hunza & Skardu Road Trip',
      type: 'itinerary',
      views: 14820,
      earnings: 37050,
      embedCode: await generateEmbedCode('hunza-skardu-7day', creatorId),
    },
    {
      id: 'c2',
      creatorId,
      title: 'Lahore Foodie Weekend Guide',
      type: 'review',
      views: 8340,
      earnings: 20850,
    },
    {
      id: 'c3',
      creatorId,
      title: 'Swat Valley Summer Vlog',
      type: 'vlog',
      views: 21600,
      earnings: 54000,
    },
  ];

  // Try to fetch from Firestore first
  try {
    const q = query(
      collection(db, 'creator_content'),
      where('creatorId', '==', creatorId)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const firestoreContent: CreatorContent[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CreatorContent, 'id'>),
      }));

      const totalViews = firestoreContent.reduce((s, c) => s + c.views, 0);
      const totalEarnings = firestoreContent.reduce((s, c) => s + c.earnings, 0);
      const topContent = [...firestoreContent]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

      return {
        totalViews,
        totalEarnings,
        contentCount: firestoreContent.length,
        topContent,
      };
    }
  } catch {
    // Fall through to mock data
  }

  const totalViews = mockContent.reduce((s, c) => s + c.views, 0);
  const totalEarnings = mockContent.reduce((s, c) => s + c.earnings, 0);

  return {
    totalViews,
    totalEarnings,
    contentCount: mockContent.length,
    topContent: [...mockContent].sort((a, b) => b.views - a.views),
  };
}
