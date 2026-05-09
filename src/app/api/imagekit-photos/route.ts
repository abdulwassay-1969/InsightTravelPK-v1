import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';
import type { TravelerPhoto } from '@/lib/photo-db';

type ImageKitListItem = {
  fileId: string;
  name?: string;
  url?: string;
  thumbnail?: string;
  createdAt?: string;
  size?: number;
  customMetadata?: Record<string, unknown>;
};

function titleCaseSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseNameAndLocationFromFileName(fileName: string) {
  const cleanName = fileName.replace(/\.[^.]+$/, '');
  const parts = cleanName.split('-');
  if (parts.length < 4 || parts[0] !== 'photo') {
    return { name: 'Traveler', location: 'Pakistan' };
  }

  const maybeTimestamp = Number(parts[1]);
  if (!Number.isFinite(maybeTimestamp)) {
    return { name: 'Traveler', location: 'Pakistan' };
  }

  const locationSlug = parts.pop() || 'pakistan';
  parts.splice(0, 2); // remove photo + timestamp
  const nameSlug = parts.join('-') || 'traveler';

  return {
    name: titleCaseSlug(nameSlug) || 'Traveler',
    location: titleCaseSlug(locationSlug) || 'Pakistan',
  };
}

function asString(value: unknown, fallback = '') {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  return fallback;
}

function toPhoto(item: ImageKitListItem): TravelerPhoto {
  const meta = item.customMetadata || {};
  const createdAt = asString(item.createdAt);
  const fileName = asString(item.name);
  const parsed = parseNameAndLocationFromFileName(fileName);
  const uploadedAt = asString(meta.uploadedAt, createdAt ? new Date(createdAt).toLocaleDateString('en-PK') : 'Recently uploaded');
  const fileSizeFromMeta = Number(meta.fileSize);
  const fileSize = Number.isFinite(fileSizeFromMeta) && fileSizeFromMeta >= 0
    ? fileSizeFromMeta
    : Number(item.size || 0);

  return {
    id: item.fileId,
    name: asString(meta.name, parsed.name),
    location: asString(meta.location, parsed.location),
    caption: asString(meta.caption, 'Shared from the traveler gallery.'),
    dataUrl: asString(item.url, asString(item.thumbnail)),
    storagePath: item.fileId,
    uploadedAt,
    fileSize,
    userId: asString(meta.userId) || undefined,
  };
}

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const ik = getImageKit();

    // Try several possible client shapes so this works across @imagekit/nodejs versions.
    const opts = { path: '/gallery', skip: 0, limit: 100 };

    // Helper to promisify callback-style functions
    const promisifyCall = (fn: Function) =>
      new Promise<any[]>((resolve, reject) => {
        try {
          fn(opts, (err: any, result: any) => {
            if (err) return reject(err);
            resolve(result || []);
          });
        } catch (e) {
          reject(e);
        }
      });

    let files: ImageKitListItem[] = [];

    // 1) If method returns a promise when called without callback
    try {
      const maybePromise = (ik as any).listFiles?.(opts);
      if (maybePromise && typeof maybePromise.then === 'function') {
        files = await maybePromise;
      }
    } catch (e) {
      // ignore and try other shapes
    }

    // 2) If callback-style listFiles exists
    if (!files.length && typeof (ik as any).listFiles === 'function') {
      files = await promisifyCall((ik as any).listFiles.bind(ik));
    }

    // 3) Some versions expose under `api.listFiles`
    if (!files.length && (ik as any).api && typeof (ik as any).api.listFiles === 'function') {
      files = await promisifyCall((ik as any).api.listFiles.bind((ik as any).api));
    }

    // 4) Some versions expose under `files.list`
    if (!files.length && (ik as any).files && typeof (ik as any).files.list === 'function') {
      files = await promisifyCall((ik as any).files.list.bind((ik as any).files));
    }

    // 5) As a last resort, check for `list` on root
    if (!files.length && typeof (ik as any).list === 'function') {
      const maybe = (ik as any).list(opts);
      if (maybe && typeof maybe.then === 'function') {
        files = await maybe;
      } else {
        files = await promisifyCall((ik as any).list.bind(ik));
      }
    }

    if (!files || !files.length) {
      console.warn('ImageKit client did not return any files. Available keys:', Object.keys(ik));
    }

    const photos = files
      .filter((item) => typeof item.fileId === 'string' && (item.url || item.thumbnail))
      .map(toPhoto)
      .sort((a, b) => {
        const aTime = new Date(a.uploadedAt).getTime();
        const bTime = new Date(b.uploadedAt).getTime();
        return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
      });

    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error('ImageKit list error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch gallery photos from ImageKit.' },
      { status: 500 }
    );
  }
}
