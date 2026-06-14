/**
 * @fileOverview Tiny, dependency-free vector helpers for in-memory similarity
 * search over the knowledge-base embeddings.
 */

export function dot(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

export function magnitude(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

/** Cosine similarity in [-1, 1]; returns 0 when either vector is degenerate. */
export function cosineSimilarity(a: number[], b: number[]): number {
  const denom = magnitude(a) * magnitude(b);
  if (denom === 0) {
    return 0;
  }
  return dot(a, b) / denom;
}
