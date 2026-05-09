import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';
const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

// In-memory recent tokens to avoid returning the same token twice in dev/runtime.
// This is a temporary safeguard for debugging token-reuse issues. Tokens are
// removed shortly after issuance to avoid memory growth.
const recentTokens = new Set<string>();

async function handleAuth() {
  try {
    const ik = getImageKit();

    // Ensure we don't accidentally return the same token twice quickly.
    // Try a few times to get a fresh token.
    let attempts = 0;
    let authParameters: { token: string; signature: string; expire: number } | null = null;
    while (attempts < 6) {
      const candidate = ik.getAuthenticationParameters();
      if (!candidate || !candidate.token) {
        authParameters = candidate as any;
        break;
      }
      if (!recentTokens.has(candidate.token)) {
        authParameters = candidate as any;
        recentTokens.add(candidate.token);
        // Remove token after it's unlikely to be useful (tokens are short-lived).
        setTimeout(() => recentTokens.delete(candidate.token), 90 * 1000);
        break;
      }
      attempts += 1;
      console.warn('Duplicate ImageKit token detected, retrying auth generation (attempt', attempts + 1, ')');
    }

    if (!authParameters) {
      throw new Error('Failed to generate a unique ImageKit auth token after several attempts.');
    }

    console.debug('Issuing ImageKit auth token:', authParameters.token);
    return NextResponse.json(authParameters, { headers: noStoreHeaders });
  } catch (error: any) {
    console.error('ImageKit auth error:', error);
    const status = String(error?.message || "").includes("missing") ? 503 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to generate auth' }, 
      { status, headers: noStoreHeaders }
    );
  }
}

export async function GET() {
  return handleAuth();
}

export async function POST() {
  return handleAuth();
}
