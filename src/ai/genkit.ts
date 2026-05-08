import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

/** Same env vars as @genkit-ai/google-genai (see https://genkit.dev/docs/plugins/google-genai/) */
function googleGenAiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY
  );
}

/** Default model; override with GEMINI_MODEL e.g. googleai/gemini-2.5-flash */
const defaultGeminiModel =
  process.env.GEMINI_MODEL ?? "googleai/gemini-1.5-flash";

export const ai = genkit({
  plugins: [googleAI({ 
    apiKey: googleGenAiApiKey(),
    apiVersion: 'v1'
  })],
  model: defaultGeminiModel,
});
