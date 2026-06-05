import { NextRequest, NextResponse } from 'next/server';
import { generateTourismChat, TourismChatInputSchema } from '@/ai/flows/tourism-chat-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = TourismChatInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid chat request.',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const response = await generateTourismChat(parsed.data);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Tourism Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate a tourism chat response.' },
      { status: 500 }
    );
  }
}