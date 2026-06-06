/**
 * @fileOverview InsightTravelPK tourism assistant flow.
 *
 * - generateTourismChat - Generates a Pakistan tourism-only chat response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AssistantLanguageSchema = z.enum(['english', 'urdu', 'roman-urdu']);

const AssistantConversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const TourismAssistantContextSchema = z.object({
  locationName: z.string().optional(),
  provinceName: z.string().optional(),
  pageType: z.enum(['general', 'province', 'district', 'weather', 'planner']).default('general'),
  bestTimeToVisit: z.string().optional(),
  attractions: z.array(z.string()).default([]),
  emergencySummary: z.string().optional(),
  weatherSummary: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const TourismChatInputSchema = z.object({
  message: z.string().min(1),
  language: AssistantLanguageSchema,
  conversation: z.array(AssistantConversationMessageSchema).max(12).default([]),
  context: TourismAssistantContextSchema.optional(),
});

export type TourismChatInput = z.infer<typeof TourismChatInputSchema>;

const TourismChatOutputSchema = z.object({
  reply: z.string().min(1),
  quickReplies: z.array(z.string()).max(4).default([]),
  safetyNote: z.string().optional(),
  suggestedFollowUp: z.string().optional(),
});

export type TourismChatOutput = z.infer<typeof TourismChatOutputSchema>;

const TourismChatPromptInputSchema = z.object({
  userMessage: z.string().min(1),
  language: AssistantLanguageSchema,
  conversationSummary: z.string(),
  contextSummary: z.string(),
});

function buildConversationSummary(conversation: TourismChatInput['conversation']) {
  if (!conversation.length) {
    return 'No prior conversation yet.';
  }

  return conversation
    .map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`)
    .join('\n');
}

function buildContextSummary(context?: TourismChatInput['context']) {
  if (!context) {
    return 'No location context. The user is asking generally about Pakistan tourism.';
  }

  const contextParts: string[] = [];

  if (context.locationName) {
    contextParts.push(`Location: ${context.locationName}`);
  }

  if (context.provinceName) {
    contextParts.push(`Province: ${context.provinceName}`);
  }

  contextParts.push(`Page type: ${context.pageType}`);

  if (context.bestTimeToVisit) {
    contextParts.push(`Best time to visit: ${context.bestTimeToVisit}`);
  }

  if (context.attractions?.length) {
    contextParts.push(`Top attractions: ${context.attractions.join(', ')}`);
  }

  if (context.weatherSummary) {
    contextParts.push(`Live weather: ${context.weatherSummary}`);
  }

  if (context.emergencySummary) {
    contextParts.push(`Emergency and tourism contacts: ${context.emergencySummary}`);
  }

  if (context.sourceUrl) {
    contextParts.push(`Source page: ${context.sourceUrl}`);
  }

  return contextParts.join('\n');
}

const tourismChatPrompt = ai.definePrompt({
  name: 'tourismChatPrompt',
  input: { schema: TourismChatPromptInputSchema },
  output: { schema: TourismChatOutputSchema },
  prompt: `You are InsightTravelPK Assistant, a smart Pakistan tourism chatbot for a travel portal.

Hard rules:
- Only answer Pakistan tourism and travel questions.
- If the user asks about something outside tourism, politely redirect them back to travel, places, routes, weather, safety, budgets, hotels, transport, or emergency travel contacts in Pakistan.
- Always stay practical, trustworthy, and concise.
- Never invent emergency phone numbers or official contacts. Use the provided context when available.
- If the selected language is Urdu or Roman Urdu, reply fully in that language. If English is selected, reply in English.
- Prefer short paragraphs or bullets when it makes the answer clearer.
- Safety first: mention road conditions, season, altitude, and local travel caution whenever relevant.

Selected language: {{{language}}}

Conversation summary:
{{{conversationSummary}}}

Context summary:
{{{contextSummary}}}

User message:
{{{userMessage}}}

Return a JSON object with:
- reply: a helpful tourism-only answer
- quickReplies: 3 to 4 short follow-up prompts the user can tap next
- safetyNote: a brief caution when relevant, otherwise omit it
- suggestedFollowUp: one optional sentence suggesting the next most useful question
`,
});

const TOURISM_CHAT_MODEL_FALLBACKS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.0-flash',
  'googleai/gemini-3-flash-preview',
  'googleai/gemini-flash-latest',
] as const;

function isTransientGeminiError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('503') ||
    message.includes('429') ||
    message.includes('UNAVAILABLE') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    /high demand|temporarily|try again|overloaded|Service Unavailable/i.test(message)
  );
}

async function sleep(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function runTourismChatPrompt(input: TourismChatInput) {
  const promptInput = {
    userMessage: input.message,
    language: input.language,
    conversationSummary: buildConversationSummary(input.conversation),
    contextSummary: buildContextSummary(input.context),
  };

  let lastError: unknown;

  for (const model of TOURISM_CHAT_MODEL_FALLBACKS) {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        const result = await tourismChatPrompt(promptInput, { model });
        if (result.output) {
          return result;
        }

        lastError = new Error('Failed to generate a tourism assistant response.');
      } catch (error) {
        lastError = error;

        if (!isTransientGeminiError(error)) {
          throw error;
        }

        if (attempt < 3) {
          await sleep(1000 * 2 ** attempt);
        }
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Gemini is temporarily unavailable. Please try again in a minute.');
}

const tourismChatFlow = ai.defineFlow(
  {
    name: 'tourismChatFlow',
    inputSchema: TourismChatInputSchema,
    outputSchema: TourismChatOutputSchema,
  },
  async (input) => {
    const { output } = await runTourismChatPrompt(input);

    if (!output) {
      throw new Error('Failed to generate a tourism assistant response.');
    }

    return output;
  }
);

export async function generateTourismChat(input: TourismChatInput): Promise<TourismChatOutput> {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY
  );

  if (!hasKey) {
    throw new Error(
      'Gemini API key is not set. Add GEMINI_API_KEY (or GOOGLE_API_KEY) to .env.local, restart the dev server, then try again.'
    );
  }

  return tourismChatFlow(input);
}

export { TourismChatInputSchema, TourismChatOutputSchema, TourismAssistantContextSchema };