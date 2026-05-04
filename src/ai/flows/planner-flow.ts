'use server';
/**
 * @fileOverview InsightTravelPK AI — Expert Pakistan Tourism Planner.
 *
 * - generatePlan - A function that handles generating a travel plan.
 * - TravelPlannerInput - The input type for the generatePlan function.
 * - TravelPlannerOutput - The return type for the generatePlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { computePlannerRouteDistance } from '@/lib/planner-distance';

const TravelPlannerInputSchema = z.object({
  promptString: z.string().describe('The pre-constructed prompt string containing all user preferences.'),
  duration: z.number().describe('The duration of the trip in days.'),
  adults: z.number().describe('Total number of adults.'),
  children: z.number().describe('Total number of children.'),
  toddlers: z.number().describe('Total number of toddlers.'),
  budgetTier: z.string().describe('The budget tier: Economy, Mid-Range, Comfortable, or Luxury.'),
  destination: z.string().describe('The destination for route distance calculation.'),
});
export type TravelPlannerInput = z.infer<typeof TravelPlannerInputSchema>;

const TravelPlannerOutputSchema = z.object({
  tripTitle: z.string().describe('A creative and catchy title for the trip.'),
  destination: z.string().describe('The main destination of the trip.'),
  duration: z.number().describe('The duration of the trip in days.'),
  summary: z.string().describe('2-3 sentence overview of the trip highlighting key experiences and character of the journey.'),
  budgetSummary: z.string().describe('A short budget estimate and spending guidance.'),
  totalBudget: z.number().describe('Grand total budget in PKR (before currency conversion).'),
  budgetBreakdown: z.object({
    currency: z.string().describe('Currency for all totals.'),
    accommodation: z.number().describe('Total accommodation estimate.'),
    food: z.number().describe('Total food estimate.'),
    transport: z.number().describe('Total transport estimate.'),
    activities: z.number().describe('Total activities estimate.'),
    contingency: z.number().describe('Suggested contingency reserve.'),
    total: z.number().describe('Estimated full trip total.'),
    perPersonTotal: z.number().describe('Estimated trip total per traveler.'),
    estimatedRouteKm: z
      .number()
      .optional()
      .describe('Approximate route distance between destination and must-visit stops (km).'),
    routeDistanceMethod: z
      .enum(['osrm', 'haversine', 'none'])
      .optional()
      .describe('How route distance was estimated.'),
  }),
  transportPlan: z.string().describe('How to move between places during the trip.'),
  localTips: z.array(z.string()).describe('Practical local travel tips (clothing, connectivity, etiquette, altitude, permits, etc.).'),
  safetyNotes: z.array(z.string()).describe('Important safety notes for the trip (altitude sickness, road conditions, solo travel, weather, etc.).'),
  dailyPlan: z.array(
    z.object({
      day: z.number().describe('The day number of the itinerary.'),
      title: z.string().describe('A short descriptive title for the day.'),
      details: z
        .string()
        .describe('Full detailed day plan including realistic timings, activities, driving hours, meals, and overnight location.'),
      highlights: z.array(z.string()).describe('2-4 key highlights for the day.'),
      drivingTime: z.string().describe('Approximate driving/travel time for the day, e.g. "Approx 5 hours".'),
      overnight: z.string().describe('The overnight location/hotel area.'),
    })
  ),
});
export type TravelPlannerOutput = z.infer<typeof TravelPlannerOutputSchema>;

const plannerPrompt = ai.definePrompt({
  name: 'plannerPrompt',
  input: { schema: TravelPlannerInputSchema },
  output: { schema: TravelPlannerOutputSchema },
  prompt: `You are InsightTravelPK AI, an expert Pakistan Tourism Planner with deep, up-to-date knowledge of all major tourism destinations in Pakistan in 2026, especially Gilgit-Baltistan, Hunza, Skardu, Naran, Nagar, Swat, Chitral, Fairy Meadows, Deosai, and KPK regions.

Your goal is to create highly realistic, safe, practical, and exciting personalized travel itineraries for users.

CORE PLANNING RULES — follow these without exception:
1. Always be conservative with driving times in mountainous areas. Add realistic buffers for road conditions (KKH, Babusar Top, Deosai), weather delays, landslide-prone sections, military checkposts, and photo stops.
2. Consider season and altitude: warn about altitude sickness above 3000m, recommend acclimatization days in Hunza/Skardu/Khunjerab. Note that Babusar Top and Deosai are typically closed Nov–May.
3. Consider permit requirements: Khunjerab National Park permit, Deosai National Park fee, trekking permits for restricted zones.
4. For solo travelers, highlight safe areas, reputable guesthouses, and recommend check-in with local tour operators.
5. Match the selected trip pace: Relaxed (fewer places, more rest), Balanced (moderate mix), Packed (more destinations, early starts).
6. Provide realistic budget estimates in PKR aligned with the user's budget tier and accommodation type.
7. Balance popular attractions with hidden gems relevant to the user's interests.

TRANSPORT RULES (CRITICAL — must be consistent across all fields):
- road-trip: private or hired car/van on roads only. Describe driving routes, road time, fuel/rest stops. NEVER mention flights.
- public-transport: buses, coaches, NATCO, trains, Daewoo, local wagons. NEVER mention flights unless notes explicitly say so.
- mixed: road + flight segments allowed; reference airports and flights when logical for long legs.

User Request:
{{{promptString}}}

Generate a creative, practical, day-by-day itinerary. For each day provide:
- A short descriptive title
- A fully detailed plan with realistic timings (6 AM–10 PM range), specific place names, driving hours with road name, meal spots, and the overnight location
- 2-4 key highlights (specific landmarks, viewpoints, activities)
- Approximate driving/travel time for that day
- The overnight stay location name

Also provide:
- A creative trip title
- A 2-3 sentence summary overview
- A transport plan paragraph
- 5-7 practical local tips (SIM cards, clothing layers, cash, altitude, local customs, photography permits, etc.)
- 3-5 safety notes (altitude sickness protocol, road hazards, emergency contacts, weather, solo traveler precautions)

The output must be a valid JSON object conforming to the output schema exactly.`,
});

const PLANNER_MODEL_FALLBACKS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-2.0-flash',
  'googleai/gemini-3-flash-preview',
  'googleai/gemini-flash-latest',
] as const;

function isTransientGeminiError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    /high demand|temporarily|try again|overloaded|Service Unavailable/i.test(msg)
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function runPlannerPrompt(input: TravelPlannerInput) {
  let lastErr: unknown;
  for (const model of PLANNER_MODEL_FALLBACKS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await plannerPrompt(input, { model });
        if (res.output) return res;
        lastErr = new Error('Failed to generate a travel plan.');
      } catch (e) {
        lastErr = e;
        if (!isTransientGeminiError(e)) throw e;
        if (attempt < 3) {
          await sleep(1000 * 2 ** attempt);
        }
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(
        'Gemini is temporarily unavailable. Please wait a minute and try again.'
      );
}

const plannerFlow = ai.defineFlow(
  {
    name: 'plannerFlow',
    inputSchema: TravelPlannerInputSchema,
    outputSchema: TravelPlannerOutputSchema,
  },
  async (input) => {
    const { output } = await runPlannerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a travel plan.');
    }

    const nights = Math.max(1, input.duration - 1);
    const travelers = Math.max(1, input.adults + input.children); // toddlers are often free, but let's just use adults + children for cost

    const budgetBases: Record<string, { acc: number, food: number, transport: number, activities: number }> = {
      'Economy': { acc: 4000, food: 1500, transport: 2000, activities: 1000 },
      'Mid-Range': { acc: 8000, food: 3000, transport: 4000, activities: 2000 },
      'Comfortable': { acc: 15000, food: 5000, transport: 8000, activities: 4000 },
      'Luxury': { acc: 30000, food: 10000, transport: 15000, activities: 8000 },
    };

    // Default to Mid-Range if not found
    const bases = budgetBases[input.budgetTier] || budgetBases['Mid-Range'];

    const accBase = bases.acc;
    const foodPerPerson = bases.food;
    const activitiesPerPerson = bases.activities;
    const transportPerDay = bases.transport;

    const routeDist = await computePlannerRouteDistance(input.destination, []);
    const effectiveKm =
      routeDist.waypoints.length >= 2
        ? routeDist.roadKm ?? routeDist.straightLineKm
        : 0;
    const pk = 28; // Defaulting to road-trip per km cost
    const baseTransport = transportPerDay * input.duration;
    let transportTotal: number;
    if (effectiveKm < 1 || routeDist.waypoints.length < 2) {
      transportTotal = Math.round(baseTransport);
    } else {
      const kmComponent = effectiveKm * pk;
      transportTotal = Math.round(baseTransport * 0.22 + kmComponent);
      transportTotal = Math.max(transportTotal, Math.round(baseTransport * 0.45));
    }

    const accommodationTotal = Math.round(accBase * nights);
    const foodTotal = Math.round(foodPerPerson * travelers * input.duration);
    const activitiesTotal = Math.round(activitiesPerPerson * travelers * input.duration);
    const subtotal = accommodationTotal + foodTotal + activitiesTotal + transportTotal;
    const contingency = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + contingency;
    const perPersonTotal = Math.round(grandTotal / travelers);

    const currency = "PKR"; // Fixed to PKR for now based on prompt, or can be dynamic if we added it back to schema. Let's keep it PKR.
    const fx = 1;
    const convert = (value: number) => Math.round(value * fx);
    const formatMoney = (value: number) => value.toLocaleString('en-PK');

    const accommodationConverted = convert(accommodationTotal);
    const foodConverted = convert(foodTotal);
    const transportConverted = convert(transportTotal);
    const activitiesConverted = convert(activitiesTotal);
    const contingencyConverted = convert(contingency);
    const grandTotalConverted = convert(grandTotal);
    const perPersonConverted = convert(perPersonTotal);

    const distNote =
      routeDist.waypoints.length >= 2 && effectiveKm >= 1
        ? ` Route distance ~${Math.round(effectiveKm)} km (${routeDist.method === 'osrm' ? 'road' : routeDist.method === 'haversine' ? 'straight-line' : 'n/a'}).`
        : '';
    const budgetSummary =
      `Estimated ${currency} ${formatMoney(grandTotalConverted)} total for ${travelers} traveler(s) ` +
      `(${currency} ${formatMoney(perPersonConverted)} per person), including 10% contingency.` +
      distNote;

    return {
      ...output,
      budgetSummary,
      totalBudget: grandTotalConverted,
      budgetBreakdown: {
        currency,
        accommodation: accommodationConverted,
        food: foodConverted,
        transport: transportConverted,
        activities: activitiesConverted,
        contingency: contingencyConverted,
        total: grandTotalConverted,
        perPersonTotal: perPersonConverted,
        estimatedRouteKm:
          routeDist.waypoints.length >= 2 && effectiveKm >= 1
            ? Math.round(effectiveKm)
            : undefined,
        routeDistanceMethod:
          routeDist.waypoints.length >= 2 && effectiveKm >= 1
            ? routeDist.method
            : 'none',
      },
    };
  }
);

export async function generatePlan(
  input: TravelPlannerInput
): Promise<TravelPlannerOutput> {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY
  );
  if (!hasKey) {
    throw new Error(
      'Gemini API key is not set. Add GEMINI_API_KEY (or GOOGLE_API_KEY) to .env.local in the project root, restart the dev server, then try again. Create a key: https://aistudio.google.com/apikey'
    );
  }
  return plannerFlow(input);
}
