'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface IncidentReport {
  id?: string;
  userId: string;
  location: string;
  type: 'landslide' | 'roadblock' | 'scam' | 'weather_hazard' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt?: any;
}

export interface SosAlert {
  id?: string;
  userId: string;
  lat: number;
  lng: number;
  contactNumber: string;
  status: 'active' | 'resolved';
  createdAt?: any;
}

const COLLECTION_INCIDENTS = "safety_incidents";
const COLLECTION_SOS = "sos_alerts";

export async function reportIncident(
  userId: string,
  location: string,
  type: IncidentReport['type'],
  severity: IncidentReport['severity'],
  description: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_INCIDENTS), {
      userId,
      location,
      type,
      severity,
      description,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error reporting safety incident:", e);
    throw new Error(e.message || "Failed to submit safety report.");
  }
}

export async function triggerSOS(
  userId: string,
  lat: number,
  lng: number,
  contactNumber: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_SOS), {
      userId,
      lat,
      lng,
      contactNumber,
      status: 'active',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error triggering SOS alert:", e);
    throw new Error(e.message || "Failed to broadcast emergency SOS signal.");
  }
}

export async function getSafetyAlerts(locationFilter?: string): Promise<IncidentReport[]> {
  try {
    let q = query(
      collection(db, COLLECTION_INCIDENTS),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    
    if (locationFilter) {
      q = query(
        collection(db, COLLECTION_INCIDENTS),
        where("location", "==", locationFilter),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<IncidentReport, 'id'>)
    }));
  } catch (e) {
    console.error("Failed to retrieve safety alerts:", e);
    return [];
  }
}
