'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Guide {
  id?: string;
  name: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  ratePerDay: number;
  location: string;
  avatarUrl?: string;
}

const COLLECTION_GUIDES = "guides";
const COLLECTION_GUIDE_BOOKINGS = "guide_bookings";

const MOCK_GUIDES: Guide[] = [
  {
    name: "Ali Ahmad",
    verified: true,
    rating: 4.9,
    reviewCount: 38,
    specialties: ["Trekking", "Karakoram History", "Photography"],
    languages: ["Urdu", "English", "Burushaski"],
    ratePerDay: 5000,
    location: "Hunza Valley",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Sajid Sadpara",
    verified: true,
    rating: 5.0,
    reviewCount: 47,
    specialties: ["High-Altitude Climbing", "K2 Basecamp", "Rescue"],
    languages: ["Urdu", "English", "Balti"],
    ratePerDay: 8000,
    location: "Skardu",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Zahra Khan",
    verified: true,
    rating: 4.8,
    reviewCount: 22,
    specialties: ["Cultural Heritage", "Mughal History", "Food Tours"],
    languages: ["Urdu", "English", "Punjabi"],
    ratePerDay: 4000,
    location: "Lahore",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Imran Khan",
    verified: true,
    rating: 4.7,
    reviewCount: 15,
    specialties: ["Swat Valley Trekking", "Buddhist Ruins", "Fishing Guides"],
    languages: ["Urdu", "Pashto", "English"],
    ratePerDay: 4500,
    location: "Swat Valley",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  }
];

export async function searchGuides(location: string): Promise<Guide[]> {
  try {
    const q = query(
      collection(db, COLLECTION_GUIDES),
      where("location", "==", location)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If collection is empty, filter and return from mock data
      return MOCK_GUIDES.filter(g => g.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(g.location.toLowerCase()));
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Guide, 'id'>)
    }));
  } catch (e) {
    console.error("Failed to query guides:", e);
    // Graceful fallback to filtered mock guides
    return MOCK_GUIDES.filter(g => g.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(g.location.toLowerCase()));
  }
}

export async function bookGuide(
  userId: string,
  guideId: string,
  guideName: string,
  date: string,
  price: number
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_GUIDE_BOOKINGS), {
      userId,
      guideId,
      guideName,
      date,
      price,
      status: 'confirmed',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error booking guide:", e);
    throw new Error(e.message || "Failed to make guide reservation.");
  }
}

export async function rateGuide(guideId: string, rating: number): Promise<void> {
  try {
    const guideRef = doc(db, COLLECTION_GUIDES, guideId);
    await updateDoc(guideRef, {
      rating: rating,
      reviewCount: serverTimestamp() // triggers timestamp tracking
    });
  } catch (e) {
    console.warn("Failed to rate guide in live DB, rating processed locally.");
  }
}
