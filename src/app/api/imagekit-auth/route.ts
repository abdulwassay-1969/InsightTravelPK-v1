import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ik = getImageKit();

    const authParameters = ik.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error: any) {
    console.error('ImageKit auth error:', error);
    const status = String(error?.message || "").includes("missing") ? 503 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to generate auth' }, 
      { status }
    );
  }
}
