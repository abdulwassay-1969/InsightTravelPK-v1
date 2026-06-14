/**
 * @fileOverview Embedding adapter for the knowledge base. Uses the same Genkit
 * Google GenAI plugin (and the same API key) that already powers the chatbot, so
 * RAG adds no new dependency or credential.
 *
 * Model resolution is resilient: not every API key has access to the same
 * embedding models (e.g. `text-embedding-004` was retired for newer keys, which
 * return 404). On first use we probe a list of candidate models once and cache
 * the first one that works for this key. If none work, embeddings are disabled
 * and retrieval falls back to lexical search — without spamming failed requests.
 *
 * Override the model explicitly with the GEMINI_EMBEDDING_MODEL env var.
 */

import { googleAI } from '@genkit-ai/google-genai';

import { ai } from '@/ai/genkit';

// 768 dims keeps the in-memory index and /tmp cache small; supported via MRL.
const EMBED_OUTPUT_DIM = 768;
// Google's batch embed endpoint accepts up to ~100 inputs per call.
const EMBED_BATCH_SIZE = 100;

/** Candidate embedding models, best first. Env override wins when set. */
function embeddingModelCandidates(): string[] {
  const override = process.env.GEMINI_EMBEDDING_MODEL?.trim();
  if (override) {
    return [override.replace(/^models\//, '')];
  }
  return ['gemini-embedding-001', 'gemini-embedding-2', 'text-embedding-004'];
}

/** True when an embedding-capable Gemini/Google API key is configured. */
export function hasEmbeddingKey(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY
  );
}

function makeEmbedder(model: string, taskType: 'RETRIEVAL_QUERY' | 'RETRIEVAL_DOCUMENT') {
  return googleAI.embedder(model, { taskType, outputDimensionality: EMBED_OUTPUT_DIM });
}

// undefined = not resolved yet, string = working model, null = none available.
let resolvedModel: string | null | undefined;
let resolvePromise: Promise<string | null> | null = null;

/** Probes candidate models once and caches the first that works for this key. */
async function resolveEmbeddingModel(): Promise<string | null> {
  if (resolvedModel !== undefined) {
    return resolvedModel;
  }
  if (resolvePromise) {
    return resolvePromise;
  }

  resolvePromise = (async () => {
    for (const model of embeddingModelCandidates()) {
      try {
        const probe = await ai.embed({
          embedder: makeEmbedder(model, 'RETRIEVAL_QUERY'),
          content: 'ping',
        });
        if (probe?.[0]?.embedding?.length) {
          resolvedModel = model;
          return model;
        }
      } catch {
        // Model unavailable for this key — try the next candidate.
      }
    }
    resolvedModel = null;
    return null;
  })();

  return resolvePromise;
}

class EmbeddingsUnavailableError extends Error {
  constructor() {
    super('No Gemini embedding model is available for this API key.');
    this.name = 'EmbeddingsUnavailableError';
  }
}

/** Embeds the user's query (optimized as a retrieval query). */
export async function embedQuery(text: string): Promise<number[]> {
  const model = await resolveEmbeddingModel();
  if (!model) {
    throw new EmbeddingsUnavailableError();
  }
  const result = await ai.embed({ embedder: makeEmbedder(model, 'RETRIEVAL_QUERY'), content: text });
  return result[0].embedding;
}

/** Embeds many document chunks (optimized as retrieval documents), batched. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const model = await resolveEmbeddingModel();
  if (!model) {
    throw new EmbeddingsUnavailableError();
  }

  const embedder = makeEmbedder(model, 'RETRIEVAL_DOCUMENT');
  const vectors: number[][] = [];

  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const batch = texts.slice(i, i + EMBED_BATCH_SIZE);
    const result = await ai.embedMany({ embedder, content: batch });
    for (const item of result) {
      vectors.push(item.embedding);
    }
  }

  return vectors;
}
