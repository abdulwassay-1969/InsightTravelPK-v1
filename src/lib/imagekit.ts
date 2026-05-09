import ImageKit from "@imagekit/nodejs";

// Server-side instance (for deletions and auth generation)
let imagekitInstance: ImageKit | null = null;

function requireImageKitConfig() {
  const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim();
  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
  const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim();

  const missing = [];
  if (!publicKey) missing.push("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY");
  if (!privateKey) missing.push("IMAGEKIT_PRIVATE_KEY");
  if (!urlEndpoint) missing.push("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");

  if (missing.length > 0) {
    throw new Error(`ImageKit configuration is missing: ${missing.join(", ")}`);
  }

  return { publicKey, privateKey, urlEndpoint };
}

export const getImageKit = () => {
  if (!imagekitInstance) {
    const { publicKey, privateKey, urlEndpoint } = requireImageKitConfig();

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitInstance;
};

// Client-side config helper
export const IK_CONFIG = {
  publicKey: (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim(),
  urlEndpoint: (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim(),
};
