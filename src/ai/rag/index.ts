/**
 * @fileOverview Public entry point for the InsightTravelPK website knowledge base.
 *
 * `getRelevantKnowledge` is the single function the chat flow calls. It returns a
 * formatted, prompt-ready context block grounded in the website's own content, or
 * an empty result if nothing relevant is found or anything fails. It never throws.
 */

import { retrieve } from './store';
import type { KnowledgeResult } from './types';

export type { KnowledgeResult } from './types';
export { getCorpusSize } from './store';

const MAX_CHUNK_CHARS = 700;

export type GetKnowledgeOptions = {
  /** Max number of chunks to include (default 6). */
  limit?: number;
};

/**
 * Retrieves website knowledge relevant to `query` and formats it for the prompt.
 *
 * @param query A natural-language query — typically the user's latest message,
 *   optionally prefixed with the page's location for better targeting.
 */
export async function getRelevantKnowledge(
  query: string,
  options: GetKnowledgeOptions = {}
): Promise<KnowledgeResult> {
  try {
    const { chunks, strategy } = await retrieve(query, options.limit ?? 6);

    if (chunks.length === 0) {
      return { context: '', sources: [], strategy: 'none' };
    }

    const context = chunks
      .map((chunk) => {
        const body = chunk.text.length > MAX_CHUNK_CHARS ? `${chunk.text.slice(0, MAX_CHUNK_CHARS)}…` : chunk.text;
        return `- ${chunk.section} (page ${chunk.url}): ${body}`;
      })
      .join('\n\n');

    const seen = new Set<string>();
    const sources: Array<{ title: string; url: string }> = [];
    for (const chunk of chunks) {
      const key = `${chunk.title}|${chunk.url}`;
      if (!seen.has(key)) {
        seen.add(key);
        sources.push({ title: chunk.title, url: chunk.url });
      }
    }

    return { context, sources, strategy };
  } catch {
    return { context: '', sources: [], strategy: 'none' };
  }
}
