import { NextRequest } from 'next/server';
import { generateTourismChat, TourismChatInputSchema } from '@/ai/flows/tourism-chat-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = TourismChatInputSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid chat request.', issues: parsed.error.flatten() }), { status: 400 });
    }

    const output = await generateTourismChat(parsed.data);
    const text = output.reply ?? '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chunkSize = 1024;
          for (let i = 0; i < text.length; i += chunkSize) {
            const chunk = text.slice(i, i + chunkSize);
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (err) {
          controller.enqueue(new TextEncoder().encode(String(err)));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Stream assistant error', error);
    return new Response(JSON.stringify({ error: error?.message || 'Failed to stream response.' }), { status: 500 });
  }
}
