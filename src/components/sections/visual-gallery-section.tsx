'use client';

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import {
  Upload, X, Camera, MapPin, User, ChevronLeft,
  ChevronRight, Trash2, ZoomIn, ImagePlus, Star
} from 'lucide-react';
import { ImageKitProvider, Image } from '@imagekit/next';
import { upload } from '@imagekit/javascript';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth-context';
import { AuthDialog } from '@/components/auth-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  getAllPhotos, deletePhoto,
  type TravelerPhoto
} from '@/lib/photo-db';
import { formatFileSize } from '@/lib/utils';

// ─── Default seed images shown before any uploads ─────────────────────────
const DEFAULT_PHOTOS: TravelerPhoto[] = [
  {
    id: 'seed-1', name: 'Ali Hassan', location: 'Hunza Valley',
    caption: 'Morning mist over the Karakoram peaks — pure magic.',
    dataUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1080&q=90',
    uploadedAt: '2026-02-14', fileSize: 0,
  },
  {
    id: 'seed-2', name: 'Sara Khan', location: 'Skardu',
    caption: 'Satpara Lake at golden hour — absolutely breathtaking!',
    dataUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=90',
    uploadedAt: '2026-02-20', fileSize: 0,
  },
  {
    id: 'seed-3', name: 'Usman Tariq', location: 'Lahore',
    caption: 'Badshahi Mosque at dusk — timeless Mughal grandeur.',
    dataUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&q=90',
    uploadedAt: '2026-02-25', fileSize: 0,
  },
  {
    id: 'seed-4', name: 'Fatima Malik', location: 'Swat Valley',
    caption: 'Switzerland of Pakistan — every view is a painting.',
    dataUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1080&q=90',
    uploadedAt: '2026-03-01', fileSize: 0,
  },
  {
    id: 'seed-5', name: 'Bilal Riaz', location: 'Deosai Plains',
    caption: 'Wildflowers dancing in the wind at 4000m elevation.',
    dataUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1080&q=90',
    uploadedAt: '2026-03-02', fileSize: 0,
  },
  {
    id: 'seed-6', name: 'Hina Javed', location: 'Gwadar',
    caption: 'Arabian Sea sunset — colours you cannot describe.',
    dataUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=90',
    uploadedAt: '2026-03-03', fileSize: 0,
  },
];

function formatUploadError(stage: 'auth' | 'imagekit' | 'list', err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'Unknown upload error.';

  if (stage === 'auth') {
    return `ImageKit auth failed: ${message}`;
  }

  if (stage === 'imagekit') {
    return `ImageKit upload failed: ${message}`;
  }

  return `ImageKit gallery refresh failed: ${message}`;
}

function safeFileToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30) || 'unknown';
}

function restoreFocusToOpener(
  returnFocusRef: RefObject<HTMLElement | null>,
  fallback: HTMLElement | null
) {
  const preferred = returnFocusRef.current;
  if (preferred && document.contains(preferred)) {
    preferred.focus();
    return;
  }
  if (fallback && document.contains(fallback)) {
    fallback.focus();
  }
}

// ─── Upload Modal ──────────────────────────────────────────────────────────
function UploadModal({
  onClose,
  onUploaded,
  returnFocusRef,
  currentUserId,
}: {
  onClose: () => void;
  onUploaded: () => void | Promise<void>;
  returnFocusRef: RefObject<HTMLElement | null>;
  currentUserId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackFocusRef = useRef<HTMLElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ size: number; name: string } | null>(null);
  const [form, setForm] = useState({ name: '', location: '', caption: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 25 * 1024 * 1024) { setError('File too large. Max size is 25 MB.'); return; }
    setError('');
    setFileInfo({ size: file.size, name: file.name });
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!preview) { setError('Please select a photo.'); return; }
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.location.trim()) { setError('Please enter the location.'); return; }
    if (!form.caption.trim()) { setError('Please add a caption.'); return; }
    setLoading(true);
    try {
      // 1. Fetch authentication tokens from our own server
      const fetchImageKitAuth = async () => {
        const authResponse = await fetch('/api/imagekit-auth', {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
          body: JSON.stringify({
            nonce: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          }),
        });

        if (!authResponse.ok) {
          const details = await authResponse.json().catch(() => null);
          throw new Error(details?.error || `Authorization endpoint returned ${authResponse.status}.`);
        }

        return authResponse.json() as Promise<{ token: string; signature: string; expire: number }>;
      };

      const uploadWithAuth = async (auth: { token: string; signature: string; expire: number }) => {
        const { token, signature, expire } = auth;
        console.debug('ImageKit upload — using token:', token);
        const uploadedAt = new Date().toLocaleDateString('en-PK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const safeNameToken = safeFileToken(form.name.trim());
        const safeLocationToken = safeFileToken(form.location.trim());

        const uploadBase = {
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          file: preview,
          fileName: `photo-${Date.now()}-${safeNameToken}-${safeLocationToken}`,
          folder: '/gallery',
          token,
          signature,
          expire,
          useUniqueFileName: true,
        };

        try {
          console.debug('ImageKit upload attempt with metadata — token:', token, 'fileName:', uploadBase.fileName);
          return await upload({
            ...uploadBase,
            customMetadata: {
              name: form.name.trim(),
              location: form.location.trim(),
              caption: form.caption.trim(),
              uploadedAt,
              fileSize: String(fileInfo?.size ?? 0),
              userId: currentUserId,
            },
          });
        } catch (metaErr) {
          console.debug('ImageKit upload failed with metadata — token:', token, 'error:', metaErr);
          const msg = String((metaErr as Error)?.message || metaErr || '');
          if (!msg.toLowerCase().includes('invalid custom metadata')) {
            throw metaErr;
          }

          // Some ImageKit accounts require custom metadata fields to be pre-defined.
          // Fetch a fresh auth token before retrying without metadata to avoid re-using
          // a token that may have been consumed.
          console.debug('Invalid custom metadata detected; fetching fresh auth and retrying without metadata');
          const freshAuth = await fetchImageKitAuth();
          console.debug('Retry upload (no-metadata) using fresh token:', freshAuth.token);
          return await upload({
            ...uploadBase,
            token: freshAuth.token,
            signature: freshAuth.signature,
            expire: freshAuth.expire,
          });
        }
      };

      // 2. Upload DIRECTLY to ImageKit from browser (with metadata)
      let uploadResponse;
      try {
        let auth = await fetchImageKitAuth();
        try {
          uploadResponse = await uploadWithAuth(auth);
        } catch (uploadErr) {
          const msg = String((uploadErr as Error)?.message || uploadErr || '').toLowerCase();
          const tokenWasReused = msg.includes('token') && msg.includes('used before');
          if (!tokenWasReused) {
            throw uploadErr;
          }

          // Token can be consumed once. Refresh auth and retry exactly one time.
          auth = await fetchImageKitAuth();
          uploadResponse = await uploadWithAuth(auth);
        }
      } catch (err) {
        throw new Error(formatUploadError('imagekit', err));
      }

      if (!uploadResponse.url || !uploadResponse.fileId) {
        throw new Error("Upload completed without a valid ImageKit asset reference.");
      }

      // 3. Metadata is stored on ImageKit itself (no Firestore dependency)

      await onUploaded();
      onClose();
    } catch (err: any) {
      console.error("Upload process failed:", err);
      if (String(err?.message || "").includes("Authorization endpoint")) {
        setError(formatUploadError('auth', err));
      } else if (String(err?.message || "").startsWith("ImageKit upload failed:")) {
        setError(err.message);
      } else if (String(err?.message || "").startsWith("ImageKit gallery refresh failed:")) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to save photo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fallbackFocusRef.current = document.activeElement as HTMLElement | null;
    const root = containerRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        const items = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreFocusToOpener(returnFocusRef, fallbackFocusRef.current);
    };
  }, [onClose, returnFocusRef]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Upload your travel photo"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Share Your Photo</h2>
              <p className="text-xs text-muted-foreground">Upload HD quality — max 25 MB</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close upload form" className="rounded-full p-2 hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Change Photo</span>
                </div>
                {fileInfo && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {formatFileSize(fileInfo.size)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ImagePlus className="w-12 h-12 mb-3 text-primary/40" />
                <p className="font-medium text-sm">Click or drag & drop your HD photo</p>
                <p className="text-xs mt-1">JPG, PNG, WEBP — up to 25 MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Your Name *</label>
              <Input
                placeholder="e.g. Ali Hassan"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location *</label>
              <Input
                placeholder="e.g. Hunza Valley, GB"
                value={form.location}
                onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Caption *</label>
            <Textarea
              placeholder="Describe this beautiful moment..."
              rows={2}
              value={form.caption}
              className="resize-none"
              onChange={(e) => setForm(p => ({ ...p, caption: e.target.value }))}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              <Upload className="w-4 h-4" />
              {loading ? 'Uploading...' : 'Share Photo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
  onDelete,
  returnFocusRef,
  currentUserId,
}: {
  photos: TravelerPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDelete: (id: string, storagePath?: string) => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  currentUserId?: string;
}) {
  const photo = photos[index];
  const isSeeded = photo.id.startsWith('seed-');
  const canDelete = !isSeeded && !!photo.userId && photo.userId === currentUserId;
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fallbackFocusRef.current = document.activeElement as HTMLElement | null;
    const root = containerRef.current;
    if (root) {
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusables[0]?.focus();
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === "Tab" && root) {
        const items = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      restoreFocusToOpener(returnFocusRef, fallbackFocusRef.current);
    };
  }, [onClose, onPrev, onNext, returnFocusRef]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-black/95 flex flex-col items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
    >
      {/* Close */}
      <button onClick={onClose} aria-label="Close photo viewer" className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-[100000] cursor-pointer" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <X className="w-7 h-7" />
      </button>

      {/* Nav */}
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous photo"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next photo"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <div className="relative w-full max-w-5xl max-h-[75vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img src={photo.dataUrl} alt={photo.caption} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl" />
      </div>

      {/* Info bar */}
      <div className="mt-4 text-center max-w-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-white font-semibold text-lg">{photo.caption}</p>
        <div className="flex items-center justify-center gap-4 mt-2 text-white/70 text-sm">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{photo.name}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{photo.location}</span>
          <span>{photo.uploadedAt}</span>
        </div>
        {canDelete && (
          <button
            onClick={() => { onDelete(photo.id, photo.storagePath); onClose(); }}
            className="mt-3 text-red-400 hover:text-red-300 flex items-center gap-1 mx-auto text-sm transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove photo
          </button>
        )}
        <p className="text-white/40 text-xs mt-2">{index + 1} / {photos.length}</p>
      </div>
    </div>
  );
}

// ─── Main Gallery Section ──────────────────────────────────────────────────
export default function VisualGallerySection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<TravelerPhoto[]>(DEFAULT_PHOTOS);
  const [showUpload, setShowUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const uploadReturnFocusRef = useRef<HTMLElement | null>(null);
  const lightboxReturnFocusRef = useRef<HTMLElement | null>(null);

  const openUploadFlow = (trigger: HTMLElement) => {
    uploadReturnFocusRef.current = trigger;
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setShowUpload(true);
  };

  const loadPhotos = useCallback(async () => {
    try {
      const saved = await getAllPhotos();
      setPhotos([...saved, ...DEFAULT_PHOTOS]);
    } catch {
      setPhotos(DEFAULT_PHOTOS);
    }
  }, []);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const handleUploadSuccess = useCallback(async () => {
    try {
      await loadPhotos();
    } catch (err) {
      console.error('Failed to reload photos after upload:', err);
    } finally {
      setShowUpload(false);
      toast({
        title: 'Photo uploaded',
        description: 'Your photo has been shared in the gallery successfully.',
      });
    }
  }, [loadPhotos, toast]);

  const handleDelete = async (id: string, storagePath?: string) => {
    try {
      await deletePhoto(id, storagePath);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch { }
  };

  const allPhotos = photos;

  return (
    <ImageKitProvider 
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
    >
      <section className="py-20 md:py-32 bg-stone-50">
      <div className="container mx-auto px-4 md:px-8">
        <AuthDialog
          isOpen={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onSuccess={() => setShowUpload(true)}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row animate-fade-in-up items-center justify-between gap-6 mb-16">
          <div className="text-center sm:text-left max-w-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline md:text-5xl">
              Traveler <span className="text-primary">Gallery</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">
              Real moments captured by real travelers across Pakistan.
              Share your HD photos and inspire the world.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 text-amber-500 text-sm font-bold uppercase tracking-wider">
              <Star className="w-5 h-5 fill-amber-500" />
              <span>{allPhotos.length} photos shared by our community</span>
            </div>
          </div>
          <Button
            onClick={(e) => {
              openUploadFlow(e.currentTarget);
            }}
            size="lg"
            className="gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 rounded-full h-14 px-8 text-lg shrink-0 transition-all font-bold"
          >
            <Camera className="w-5 h-5" />
            Share Your Photo
          </Button>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-6 space-y-6">
          {allPhotos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              className="break-inside-avoid block w-full text-left group overflow-hidden rounded-xl shadow-md relative cursor-pointer hover:shadow-xl transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={(e) => {
                lightboxReturnFocusRef.current = e.currentTarget;
                setLightbox(i);
              }}
              aria-label={`Open photo by ${photo.name} from ${photo.location}`}
            >
              <Image
                src={photo.dataUrl}
                alt={photo.caption}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-semibold text-sm line-clamp-2">{photo.caption}</p>
                <div className="flex items-center gap-2 mt-1 text-white/80 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{photo.location}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-white/60 text-xs">
                  <User className="w-3 h-3" />
                  <span>{photo.name}</span>
                </div>
              </div>

              {/* Zoom icon */}
              <div className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          ))}
        </div>


        {/* Upload CTA at bottom */}
        {allPhotos.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Have a beautiful photo of Pakistan?</p>
            <Button
              variant="outline"
              onClick={(e) => {
                openUploadFlow(e.currentTarget);
              }}
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Upload className="w-4 h-4" />
              Add Your Photo to the Gallery
            </Button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && user && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploadSuccess}
          returnFocusRef={uploadReturnFocusRef}
          currentUserId={user.uid}
        />
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          photos={allPhotos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((lightbox - 1 + allPhotos.length) % allPhotos.length)}
          onNext={() => setLightbox((lightbox + 1) % allPhotos.length)}
          onDelete={handleDelete}
          returnFocusRef={lightboxReturnFocusRef}
          currentUserId={user?.uid}
        />
      )}
      </section>
    </ImageKitProvider>
  );
}
