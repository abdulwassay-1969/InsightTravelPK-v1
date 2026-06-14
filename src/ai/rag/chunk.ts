/**
 * @fileOverview Splits knowledge documents into retrievable chunks and tokenizes
 * them. Most InsightTravelPK documents are short (a contact entry, a district
 * guide) and become a single chunk; long ones (blog articles) are split with a
 * small overlap so context is not lost at boundaries.
 */

import type { KnowledgeChunk, KnowledgeDocument } from './types';

const DEFAULT_MAX_CHARS = 1100;
const DEFAULT_OVERLAP = 150;

/** Lower-cases, strips punctuation, and splits text into word tokens. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9؀-ۿ\s]/g, ' ') // keep latin, digits, and Arabic/Urdu script
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

/** Splits a single string into overlapping windows, breaking on sentence/space boundaries. */
function splitText(text: string, maxChars: number, overlap: number): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) {
    return [clean];
  }

  const parts: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = Math.min(start + maxChars, clean.length);

    if (end < clean.length) {
      // Prefer to break at a sentence end, then at a space, within the window.
      const slice = clean.slice(start, end);
      const sentenceBreak = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('; '));
      const spaceBreak = slice.lastIndexOf(' ');
      const breakAt = sentenceBreak > maxChars * 0.5 ? sentenceBreak + 1 : spaceBreak > 0 ? spaceBreak : slice.length;
      end = start + breakAt;
    }

    parts.push(clean.slice(start, end).trim());

    if (end >= clean.length) {
      break;
    }
    start = Math.max(end - overlap, start + 1);
  }

  return parts.filter(Boolean);
}

export function chunkDocuments(
  documents: KnowledgeDocument[],
  options: { maxChars?: number; overlap?: number } = {}
): KnowledgeChunk[] {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const overlap = options.overlap ?? DEFAULT_OVERLAP;

  const chunks: KnowledgeChunk[] = [];

  for (const doc of documents) {
    const pieces = splitText(doc.text, maxChars, overlap);

    pieces.forEach((piece, index) => {
      // Title + keywords are folded into the token set so they boost matching,
      // but only the body text is shown to the model.
      const tokenSource = `${doc.title} ${doc.section} ${(doc.keywords ?? []).join(' ')} ${piece}`;

      chunks.push({
        id: `${doc.id}#${index}`,
        docId: doc.id,
        title: doc.title,
        url: doc.url,
        section: doc.section,
        text: piece,
        tokens: tokenize(tokenSource),
      });
    });
  }

  return chunks;
}
