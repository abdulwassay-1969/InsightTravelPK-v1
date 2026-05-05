import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "").trim(),
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "").trim(),
  projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim(),
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").trim(),
  messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "").trim(),
  appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "").trim(),
  measurementId: (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "").trim(),
};

// Safety Check: Ensure the critical keys exist
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const missing = [];
  if (!firebaseConfig.apiKey) missing.push("API_KEY");
  if (!firebaseConfig.projectId) missing.push("PROJECT_ID");
  console.error(`❌ CRITICAL ERROR: Firebase ${missing.join(" and ")} missing.`, {
    usingProjectId: firebaseConfig.projectId || "UNDEFINED",
    envValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  });
}

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
