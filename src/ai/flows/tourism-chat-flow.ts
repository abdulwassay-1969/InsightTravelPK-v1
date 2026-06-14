/**
 * @fileOverview InsightTravelPK tourism assistant flow.
 *
 * - generateTourismChat - Generates a Pakistan tourism-only chat response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getRelevantKnowledge } from '@/ai/rag';

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
  knowledgeContext: z.string().default(''),
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
  prompt: `You are InsightTravelPK Assistant, the smart assistant for the InsightTravelPK Pakistan travel portal.

You help with two things:
1. Pakistan travel and tourism — destinations, routes, best time to visit, weather, safety, budgets, hotels, transport, and emergency or tourism contacts.
2. The InsightTravelPK website itself — what it offers, its pages and features, how to use them, and the contacts, destinations, and information it publishes.

Hard rules:
- Stay within those two areas. If the user asks about something clearly unrelated, politely redirect them back to Pakistan travel or to how the website can help.
- A "Website knowledge base" section may be provided below with authoritative, up-to-date content taken directly from this website. Treat it as the source of truth for any question about the site, its pages, contacts, destinations, or features. When it is relevant, use it and point the user to the matching page (for example, the Contacts page at /contact). Never claim you cannot access the website's contact details or sections when the answer is present in the knowledge base.
- Never invent emergency phone numbers, official contacts, or website details. Only state contacts and facts that appear in the Website knowledge base or the context; if something genuinely is not there, say so honestly and suggest the closest page that can help.
- Always stay practical, trustworthy, and concise.
- If the selected language is Urdu or Roman Urdu, reply fully in that language. If English is selected, reply in English.
- Safety first: mention road conditions, season, altitude, and local travel caution whenever relevant.

Formatting rules (very important — the chat shows your reply as plain text):
- Write in clean, plain, conversational text only. Do NOT use any HTML tags (such as <ul>, <li>, <b>, <p>, <br>) and do NOT use any Markdown syntax (no **bold**, __, ##, backticks, or [text](link) links).
- To emphasize something, just phrase it in plain words — never with symbols or tags.
- When you list options or steps, put each item on its own line beginning with "• " (a bullet then a space), and leave a blank line before the list.
- Never add citation markers, footnotes, or bracketed numbers such as [1] or [2, 5]. If you refer to a page, simply write its path in parentheses, for example (/planner).
- Keep paragraphs short and easy to read.

Selected language: {{{language}}}

Conversation summary:
{{{conversationSummary}}}

Context summary:
{{{contextSummary}}}

Website knowledge base (authoritative InsightTravelPK content; cite the relevant page when you use it):
{{{knowledgeContext}}}

User message:
{{{userMessage}}}

Return a JSON object with:
- reply: a helpful answer, grounded in the Website knowledge base and context whenever they are relevant
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

function buildRetrievalQuery(input: TourismChatInput): string {
  // Bias retrieval toward the page's location, then the user's question.
  return [input.context?.locationName, input.context?.provinceName, input.message]
    .filter(Boolean)
    .join(' ')
    .trim();
}

const EMPTY_KNOWLEDGE_NOTE =
  'No specific website content was retrieved for this question. Answer from general Pakistan travel knowledge and, when relevant, point the user to the most appropriate InsightTravelPK page.';

async function runTourismChatPrompt(input: TourismChatInput) {
  // Retrieve relevant InsightTravelPK content (never throws; degrades gracefully).
  const knowledge = await getRelevantKnowledge(buildRetrievalQuery(input));

  const promptInput = {
    userMessage: input.message,
    language: input.language,
    conversationSummary: buildConversationSummary(input.conversation),
    contextSummary: buildContextSummary(input.context),
    knowledgeContext: knowledge.context || EMPTY_KNOWLEDGE_NOTE,
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

/**
 * Cleans assistant text so the chat UI (which renders plain text) never shows
 * raw HTML tags, Markdown symbols, or bracketed citation markers. This is a
 * permanent safety net: even if the model ignores the formatting rules, the user
 * always sees clean, professional text.
 */
function sanitizeAssistantText(value: string): string {
  if (!value) {
    return value;
  }

  let text = value;

  // 1) Convert structural HTML to line breaks / bullets, then drop other tags.
  text = text
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '\n• ')
    .replace(/<\/\s*(p|div|li|ul|ol|h[1-6]|tr)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  // 2) Decode the most common HTML entities.
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&apos;/gi, "'");

  // 3) Strip Markdown markup but keep the inner text.
  text = text
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '$1 ($2)');

  // 4) Remove bracketed numeric citation markers like [1] or [2, 5].
  text = text.replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, '');

  // 5) Normalize bullets and whitespace for a clean, professional layout.
  text = text
    .replace(/^[ \t]*[-*•]\s+/gm, '• ')
    .replace(/\n{2,}(•)/g, '\n$1')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return text;
}

function sanitizeTourismChatOutput(output: TourismChatOutput): TourismChatOutput {
  return {
    ...output,
    reply: sanitizeAssistantText(output.reply) || output.reply,
    quickReplies: (output.quickReplies ?? [])
      .map((reply) => sanitizeAssistantText(reply))
      .filter((reply) => reply.length > 0)
      .slice(0, 4),
    safetyNote: output.safetyNote ? sanitizeAssistantText(output.safetyNote) : output.safetyNote,
    suggestedFollowUp: output.suggestedFollowUp
      ? sanitizeAssistantText(output.suggestedFollowUp)
      : output.suggestedFollowUp,
  };
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

    return sanitizeTourismChatOutput(output);
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