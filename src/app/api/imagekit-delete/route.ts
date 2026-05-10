import { NextRequest, NextResponse } from "next/server";
import { getImageKit } from "@/lib/imagekit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fileId = String(body?.fileId || "").trim();

    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId." }, { status: 400 });
    }

      await (getImageKit() as any).deleteFile(fileId);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete file from ImageKit." },
      { status: 500 }
    );
  }
}
