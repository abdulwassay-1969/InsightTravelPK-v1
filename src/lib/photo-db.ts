import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

export type TravelerPhoto = {
    id: string;           
    name: string;         
    location: string;     
    caption: string;
    dataUrl: string;      // This will now be the ImageKit URL
    storagePath?: string; // This will now be the ImageKit FileID (for deletion)
    uploadedAt: string;
    fileSize: number;
    userId?: string;
};

const COLLECTION_NAME = "photos";

export async function savePhoto(photo: Omit<TravelerPhoto, 'id' | 'dataUrl' | 'storagePath'> & { url: string, fileId: string }): Promise<void> {
    try {
        // 1. Save metadata to Firestore (details provided by client)
        await addDoc(collection(db, COLLECTION_NAME), {
            name: photo.name,
            location: photo.location,
            caption: photo.caption,
            dataUrl: photo.url,
            storagePath: photo.fileId,
            uploadedAt: photo.uploadedAt,
            fileSize: photo.fileSize,
            userId: photo.userId ?? null,
            createdAt: new Date().toISOString()
        });
    } catch (e: any) {
        console.error("Firestore Error:", e);
        if (e?.code === "permission-denied") {
            throw new Error("Firestore blocked the save. Check your Firestore Rules for the photos collection.");
        }
        if (e?.code === "unauthenticated") {
            throw new Error("Firestore rejected the save because the user session is missing.");
        }
        throw new Error(e?.message || "Failed to save photo details to database.");
    }
}

export async function getAllPhotos(): Promise<TravelerPhoto[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<TravelerPhoto, 'id'>)
        }));
    } catch (e) {
        console.error("Failed to fetch photos from Firestore", e);
        return [];
    }
}

export async function deletePhoto(id: string, fileId?: string): Promise<void> {
    try {
        // 1. Delete from Firestore
        await deleteDoc(doc(db, COLLECTION_NAME, id));

        // 2. Delete from ImageKit via our secure server route if fileId is provided
        if (fileId) {
            const response = await fetch("/api/imagekit-delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileId }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                throw new Error(data?.error || "ImageKit deletion failed.");
            }
        }
    } catch (e: any) {
        console.error("Failed to delete photo from ImageKit/Firestore", e);
        if (e?.code === "permission-denied") {
            throw new Error("You are not allowed to delete this photo.");
        }
        throw new Error(e?.message || "Could not delete the photo.");
    }
}
