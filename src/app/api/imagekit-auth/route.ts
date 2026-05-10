import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

// In-memory recent tokens to avoid returning the same token twice in dev/runtime.
const recentTokens = new Set<string>();

function generateAuthParams() {
  const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || '').trim();
  if (!privateKey) {
    throw new Error('IMAGEKIT_PRIVATE_KEY is missing in environment variables.');
  }

  const token = crypto.randomUUID();
  // expire = current time in seconds + 30 minutes
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return { token, expire, signature };
}

async function handleAuth() {
  try {
    let attempts = 0;
    let authParameters: { token: string; signature: string; expire: number } | null = null;

    while (attempts < 6) {
      const candidate = generateAuthParams();
      if (!recentTokens.has(candidate.token)) {
        authParameters = candidate;
        recentTokens.add(candidate.token);
        // Remove token after 90 seconds to avoid memory growth
        setTimeout(() => recentTokens.delete(candidate.token), 90 * 1000);
        break;
      }
      attempts += 1;
      console.warn('Duplicate ImageKit token detected, retrying (attempt', attempts + 1, ')');
    }

    if (!authParameters) {
      throw new Error('Failed to generate a unique ImageKit auth token after several attempts.');
    }

    console.debug('Issuing ImageKit auth token:', authParameters.token);
    return NextResponse.json(authParameters, { headers: noStoreHeaders });
  } catch (error: any) {
    console.error('ImageKit auth error:', error);
    const status = String(error?.message || '').includes('missing') ? 503 : 500;
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
