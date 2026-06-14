'use server';

import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface TripShare {
  id?: string;
  tripId: string;
  ownerId: string;
  sharedWith: string[];
  shareCode: string;
  permissions: 'view' | 'edit';
  expiresAt: string;
  createdAt?: any;
}

function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function shareTrip(ownerId: string, tripId: string, emails: string[], permissions: 'view' | 'edit' = 'view'): Promise<string> {
  const shareCode = generateShareCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  try {
    await addDoc(collection(db, 'trip_shares'), {
      tripId, ownerId, sharedWith: emails, shareCode, permissions, expiresAt, createdAt: serverTimestamp()
    });
    return shareCode;
  } catch (e: any) {
    console.error('Error sharing trip:', e);
    throw new Error(e.message || 'Failed to share trip.');
  }
}

export async function getSharedTrips(userId: string): Promise<TripShare[]> {
  try {
    const q = query(collection(db, 'trip_shares'), where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<TripShare, 'id'>) }));
  } catch (e) {
    console.error('Error fetching shared trips:', e);
    return [];
  }
}

export async function revokeShare(shareId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'trip_shares', shareId));
  } catch (e) {
    throw new Error('Could not revoke share link.');
  }
}
