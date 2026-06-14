/**
 * @fileOverview Shared types for the InsightTravelPK website knowledge base (RAG).
 *
 * The knowledge base is derived at runtime from the same content modules that
 * render the website (contacts, provinces, district guides, blog, virtual tours)
 * plus a hand-authored site-info registry. Because it reads the live app modules,
 * it stays automatically in sync with every deploy — no separate index to rebuild.
 */

/** A single logical piece of website content (one page, one district, one contact, ...). */
export type KnowledgeDocument = {
  /** Stable unique id, e.g. `contact-punjab` or `district-hunza`. */
  id: string;
  /** Human-friendly title used when citing the source. */
  title: string;
  /** Site path this content lives on, e.g. `/contact` or `/districts/hunza`. */
  url: string;
  /** Category label used for grouping/citation, e.g. `Contacts`, `District guide`. */
  section: string;
  /** The full natural-language text that will be embedded and retrieved. */
  text: string;
  /** Optional extra terms that improve lexical (keyword) matching. */
  keywords?: string[];
};

/** A retrievable slice of a document (long documents are split into several chunks). */
export type KnowledgeChunk = {
  /** `${docId}#${chunkIndex}`. */
  id: string;
  docId: string;
  title: string;
  url: string;
  section: string;
  text: string;
  /** Lower-cased token list, precomputed once for the lexical fallback. */
  tokens: string[];
};

/** A chunk paired with a relevance score from a retriever. */
export type ScoredChunk = KnowledgeChunk & { score: number };

/** Result of a knowledge lookup, ready to be injected into the chat prompt. */
export type KnowledgeResult = {
  /** Formatted, numbered context block (empty string when nothing was found). */
  context: string;
  /** De-duplicated list of the pages the context was drawn from. */
  sources: Array<{ title: string; url: string }>;
  /** Which retriever produced the result — useful for logging/debugging. */
  strategy: 'semantic' | 'lexical' | 'none';
};
