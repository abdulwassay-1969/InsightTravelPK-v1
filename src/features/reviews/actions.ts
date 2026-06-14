'use server';

import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface LocationReview {
  id?: string;
  locationId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  photoUrl?: string;
  createdAt?: any;
}

const MOCK_REVIEWS: LocationReview[] = [
  { locationId: 'hunza-valley', userId: 'mock-1', userName: 'Zara Ahmed', rating: 5, text: 'The hospitality of the locals was truly unmatched. Waking up to Rakaposhi through our guesthouse window is something I will never forget. The food, culture, and friendliness — Pakistan\'s best kept secret.' },
  { locationId: 'hunza-valley', userId: 'mock-2', userName: 'Bilal Chaudhry', rating: 5, text: 'Came here for the cherry blossoms in April. The entire valley turns pink and white. Roads are manageable from Islamabad in two days. Altit Fort was breathtaking — 1100 years old and still standing!' },
  { locationId: 'hunza-valley', userId: 'mock-3', userName: 'Sara Malik', rating: 4, text: 'Stunning in every way. Do carry warm layers even in summer — nights drop sharply. The apricot harvest in July is magical. Book your guesthouse in advance as it fills up fast during peak season.' },
];

export async function submitReview(userId: string, userName: string, locationId: string, locationName: string, rating: number, text: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'location_reviews'), {
      userId, userName, locationId, locationName, rating, text, createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error('Error submitting review:', e);
    throw new Error(e.message || 'Failed to submit review.');
  }
}

export async function getLocationReviews(locationId: string): Promise<LocationReview[]> {
  try {
    const q = query(collection(db, 'location_reviews'), where('locationId', '==', locationId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      return MOCK_REVIEWS.filter(r => r.locationId === locationId || locationId.includes('hunza'));
    }
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<LocationReview, 'id'>) }));
  } catch (e) {
    console.error('Error fetching reviews:', e);
    return MOCK_REVIEWS.filter(r => r.locationId === locationId);
  }
}
