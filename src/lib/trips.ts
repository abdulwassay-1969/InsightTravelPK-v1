'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

export type SavedTrip = {
    id: string;           
    userId: string;
    tripTitle: string;
    destination: string;
    duration: string;
    tripData: any;
    createdAt: any;
};

const COLLECTION_NAME = "saved_trips";

export async function saveTrip(userId: string, trip: Omit<SavedTrip, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            userId,
            ...trip,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e: any) {
        console.error("Firestore Error saving trip:", e);
        throw new Error(e.message || "Failed to save trip to database.");
    }
}

export async function getUserTrips(userId: string): Promise<SavedTrip[]> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<SavedTrip, 'id'>)
        }));
    } catch (e) {
        console.error("Failed to fetch trips from Firestore", e);
        return [];
    }
}

export async function deleteTrip(tripId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, tripId));
    } catch (e) {
        console.error("Failed to delete trip from Firestore", e);
        throw new Error("Could not delete the trip.");
    }
}
