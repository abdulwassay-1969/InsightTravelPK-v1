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

export async function getAllPhotos(): Promise<TravelerPhoto[]> {
    try {
        const response = await fetch("/api/imagekit-photos", {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            const details = await response.json().catch(() => null);
            throw new Error(details?.error || `ImageKit list endpoint returned ${response.status}.`);
        }

        const payload = await response.json();
        return Array.isArray(payload?.photos) ? payload.photos as TravelerPhoto[] : [];
    } catch (e: any) {
        console.error("Failed to fetch photos from ImageKit:", e?.message || e);
        return [];
    }
}

export async function deletePhoto(id: string, fileId?: string): Promise<void> {
    try {
        const targetFileId = String(fileId || id || "").trim();
        if (!targetFileId) {
            throw new Error("Missing file id for deletion.");
        }

        const response = await fetch("/api/imagekit-delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileId: targetFileId }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.error || "ImageKit deletion failed.");
        }
    } catch (e: any) {
        console.error("Failed to delete photo from ImageKit", e);
        throw new Error(e?.message || "Could not delete the photo.");
    }
}
