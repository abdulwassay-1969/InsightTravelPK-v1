'use server';

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AdminAlert {
  id?: string;
  userId: string;
  alertType: 'weather' | 'road_close' | 'general';
  message: string;
  createdAt?: any;
}

export interface PartnerRegistration {
  id?: string;
  userId: string;
  partnerName: string;
  partnerType: 'hotel' | 'transport' | 'guide';
  details: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
}

const COLLECTION_ALERTS = "admin_updates";
const COLLECTION_PARTNERS = "partner_registrations";

// Helper to simulate role-based authorization check
async function checkAdminRole(userId: string): Promise<boolean> {
  // Simple check: In production, verify user record claims or Firestore roles collection.
  // For now, allow valid user IDs for demonstration, but log simulation.
  console.log(`Verifying admin role permissions for session: ${userId}`);
  return !!userId;
}

export async function publishAlert(
  userId: string, 
  alertType: AdminAlert['alertType'], 
  message: string
): Promise<string> {
  const isAdmin = await checkAdminRole(userId);
  if (!isAdmin) {
    throw new Error("Unauthorized access. Admin role required.");
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_ALERTS), {
      userId,
      alertType,
      message,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error publishing admin alert:", e);
    throw new Error(e.message || "Failed to publish alert.");
  }
}

export async function addPartner(
  userId: string, 
  partnerName: string, 
  partnerType: PartnerRegistration['partnerType'],
  details: any = {}
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_PARTNERS), {
      userId,
      partnerName,
      partnerType,
      details,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e: any) {
    console.error("Firestore error registering partner:", e);
    throw new Error(e.message || "Failed to submit partner application.");
  }
}

export async function getAdminAlerts(): Promise<AdminAlert[]> {
  try {
    const q = query(
      collection(db, COLLECTION_ALERTS),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<AdminAlert, 'id'>)
    }));
  } catch (e) {
    console.error("Failed to retrieve admin alerts:", e);
    return [];
  }
}
