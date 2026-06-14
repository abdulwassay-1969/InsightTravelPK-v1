'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type BookingType = 'hotel' | 'transport' | 'activity' | 'restaurant';

export interface Booking {
  id?: string;
  userId: string;
  bookingType: BookingType;
  itemName: string;
  amount: number;
  commission: number; // e.g. 10% commission tracking
  status: 'pending' | 'confirmed' | 'cancelled';
  date: string;
  details: any;
  createdAt?: any;
}

const COLLECTION_NAME = "bookings";

export async function bookHotel(
  userId: string, 
  hotelName: string, 
  price: number, 
  date: string, 
  details: any = {}
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      bookingType: 'hotel',
      itemName: hotelName,
      amount: price,
      commission: Math.round(price * 0.12), // 12% hotel commission
      status: 'confirmed',
      date,
      details,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error booking hotel:", e);
    throw new Error(e.message || "Failed to make hotel booking.");
  }
}

export async function bookTransport(
  userId: string, 
  transportName: string, 
  price: number, 
  date: string, 
  details: any = {}
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      bookingType: 'transport',
      itemName: transportName,
      amount: price,
      commission: Math.round(price * 0.08), // 8% transport commission
      status: 'confirmed',
      date,
      details,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error booking transport:", e);
    throw new Error(e.message || "Failed to make transport booking.");
  }
}

export async function bookActivity(
  userId: string, 
  activityName: string, 
  price: number, 
  date: string, 
  details: any = {}
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      bookingType: 'activity',
      itemName: activityName,
      amount: price,
      commission: Math.round(price * 0.10), // 10% activity commission
      status: 'confirmed',
      date,
      details,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error booking activity:", e);
    throw new Error(e.message || "Failed to make activity booking.");
  }
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Booking, 'id'>)
    }));
  } catch (e) {
    console.error("Failed to retrieve user bookings:", e);
    return [];
  }
}
