/**
 * @fileOverview Lexical (keyword) retriever used as a zero-dependency, no-API
 * fallback when embeddings are unavailable (missing API key, network error, or
 * before the embedding index has finished building). It scores chunks by
 * TF-style overlap with the query, weighting rarer terms more (IDF). The chunks'
 * titles/keywords are already folded into `chunk.tokens`, so matches on a page
 * name or destination still rank well.
 */

import { tokenize } from './chunk';
import type { KnowledgeChunk, ScoredChunk } from './types';

export type LexicalIndex = {
  chunks: KnowledgeChunk[];
  /** token -> number of chunks containing it. */
  documentFrequency: Map<string, number>;
};

export function buildLexicalIndex(chunks: KnowledgeChunk[]): LexicalIndex {
  const documentFrequency = new Map<string, number>();

  for (const chunk of chunks) {
    const unique = new Set(chunk.tokens);
    for (const token of unique) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  return { chunks, documentFrequency };
}

export function lexicalSearch(index: LexicalIndex, query: string, limit: number): ScoredChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  const queryCounts = new Map<string, number>();
  for (const token of queryTokens) {
    queryCounts.set(token, (queryCounts.get(token) ?? 0) + 1);
  }

  const totalDocs = index.chunks.length || 1;

  const scored: ScoredChunk[] = index.chunks.map((chunk) => {
    const termCounts = new Map<string, number>();
    for (const token of chunk.tokens) {
      termCounts.set(token, (termCounts.get(token) ?? 0) + 1);
    }

    let score = 0;
    for (const [token] of queryCounts) {
      const tf = termCounts.get(token);
      if (!tf) {
        continue;
      }
      const df = index.documentFrequency.get(token) ?? 1;
      const idf = Math.log(1 + totalDocs / df);
      // Sub-linear term frequency dampening keeps long chunks from dominating.
      score += (1 + Math.log(tf)) * idf;
    }

    return { ...chunk, score };
  });

  return scored
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
