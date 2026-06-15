# InsightTravelPK — Project Flow & Feature Documentation (Code-Based)

> **Scope note**: This document is generated from code inspection of the files opened so far. The repo contains more pages/features than we’ve fully read yet; subsequent sections will be extended as more page/API files are inspected.

## 1) App Shell / Rendering Flow

### Root layout (global wrapper)
**File:** `src/app/layout.tsx`

**What it does (always applied to every page):**
- Loads fonts (Inter + Poppins) and sets global HTML/body classes.
- Wraps the app in `<AuthProvider>`.
- Renders common UI:
  - `<GtagConsent />` (cookie consent + GA activation)
  - `<Header />`
  - `<ConnectivityManager />`
  - `<NavigationProgress />` (inside `<Suspense>`, for route changes)
  - `<Footer />`
  - `<FloatingWidget />` (assistant chat bubble)
  - `<Toaster />` (toast UI)
- Adds `main` wrapper: `<main id="main-content">{children}</main>`.

## 2) Routing Map (Pages currently verified)

### Home
**File:** `src/app/page.tsx`
- Renders homepage sections:
  - HeroSection
  - WeatherBar
  - WhyPakistanSection
  - DistrictsSection
  - FeaturedDestinationsSection
  - TravelTipsSection
  - VisualGallerySection

### Virtual Tour hub
**File:** `src/app/virtual-tour/page.tsx` (client page)
- Shows “Virtual Tour Experience” hero.
- Embeds YouTube playlist(s) via `<iframe>`.
- Shows a grid of more embedded YouTube videos.
- Provides CTAs to:
  - `/map`
  - `/planner`

### Map page
**File:** `src/app/map/page.tsx`
- Renders `PakistanMapClient`.

**Client wrapper:** `src/components/maps/pakistan-map-client.tsx`
- Uses `next/dynamic` to import `@/components/maps/pakistan-map` with `ssr:false`.

### Provinces (dynamic)
**File:** `src/app/provinces/[slug]/page.tsx` (async server page)

**Flow:**
- Uses `generateStaticParams()` from `src/lib/data`’s `provinces` list.
- For requested `slug`:
  - Finds province config from `provinces`.
  - If not found → `notFound()`.
- Renders:
  - Hero image (ImageKit/Unsplash mapping)
  - “Region Overview” text (hardcoded mapping per slug)
  - Embedded map section via `EmbeddedMapClient spots={spots}`.
  - District grid (from `province.districts`).
  - Spot cards (from JSON files imported per region).

### Weather page
**File:** `src/app/weather/page.tsx` (client)

**Flow:**
- Uses `react-hook-form` + zod schema with one field: `city`.
- On initial mount: fetches default weather for `Islamabad`.
- On submit: calls `getWeather({ city })` from `src/app/actions`.
- Renders:
  - Current weather
  - 7-day forecast
  - Error UI + popular quick city buttons

### Gallery page
**File:** `src/app/gallery/page.tsx`
- Uses `VisualGallerySection` (client rendering not inspected yet here).

### Assistant
**File:** `src/app/assistant/page.tsx` (server async)

**Flow:**
- Reads search params:
  - `provinceSlug`, `districtSlug`, and optional `reset`.
- Builds `initialContext`:
  - pageType: general/province/district
  - locationName + provinceName
  - bestTimeToVisit + attractions (district detail)
  - emergencySummary derived from `src/data/contacts`
  - sourceUrl for UI links
- Renders `TourismChatbot` with `initialContext`.

### Auth pages
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`

**Flow:**
- Both pages use `useAuth()` from `src/components/auth-context`.
- After successful login/signup:
  - redirects to `/saved-trips`.

### Planner
**File:** `src/app/planner/page.tsx` (client)

**Flow (3-step wizard):**
- Step 1: destination, departingFrom, startDate, returnDate, duration
- Step 2: adults/children/toddlers, travelStyle, tripPace
- Step 3: budget tier, interests, optional notes

**Plan generation:**
- On submit it builds a `promptString` and calls:
  - `getTravelPlan({ promptString, duration, adults, children, toddlers, budgetTier, destination })`
  - from `src/app/actions`
- Shows results including:
  - summary
  - budget summary + breakdown
  - daily itinerary
  - local tips and safety notes

**Saved trips & PDF export:**
- Saving requires auth (uses `saveTrip` from `src/lib/trips`).
- PDF export opens a new window and writes print-ready HTML then calls `window.print()`.

### Saved Trips
**File:** `src/app/saved-trips/page.tsx`
- Renders `MyTrips`.

### District bookmark (client-only)
**File:** `src/components/district/bookmark-button.tsx`

**Flow:**
- Stores bookmarked district slugs in localStorage key:
  - `insighttravelpk-bookmarks`
- Toggle updates state + shows temporary flash text.

### Contacts
**File:** `src/app/contact/page.tsx`
- Renders province-wise emergency + tourism department contacts from `src/data/contacts`.

## 3) Feature Flow: Tourism Assistant (AI Chat)

### Assistant UI component
**File:** `src/components/assistant/tourism-chatbot.tsx`

**Main client state:**
- language
- context (location/province/district info)
- messages (chat history)

**Persistence:**
- localStorage key: `insighttravelpk-tourism-assistant-v1`

**Message sending flow:**
1. User types/selects quick actions.
2. `sendMessage()` POSTs to `window.location.origin + /api/assistant/chat`.
3. Body includes:
   - message
   - language
   - recent conversation items (last ~12)
   - context (locationName, provinceName, pageType, bestTimeToVisit, attractions, emergencySummary, weatherSummary, sourceUrl)
4. Response JSON is expected with:
   - `reply`
   - `quickReplies`
   - `safetyNote`
   - `suggestedFollowUp`
5. UI appends the assistant message to chat.

### Quick actions
- Weather: first calls `/api/weather?city=...`, formats a short summary, then sends assistant message.
- Contacts: builds emergency summary from `src/data/contacts`.
- Other actions: sends prompt built from action key + current context.

### Assistant floating widget
**File:** `src/components/assistant/floating-widget.tsx`

**Visibility rules:**
- Hidden on `/assistant`, `/login`, `/register`.
- Visible everywhere else.

**UI:**
- A fixed bottom-right button opens a `Sheet`.
- The sheet renders `TourismChatbot` in compact mode.

### Assistant API routes
#### Non-streaming JSON route
**File:** `src/app/api/assistant/chat/route.ts`

**Flow:**
- Validates request body using `TourismChatInputSchema`.
- Calls `generateTourismChat(parsed.data)`.
- Returns JSON response.

#### Streaming route
**File:** `src/app/api/assistant/stream/route.ts`

**Flow:**
- Same generation, but returns `text/plain` streaming output.

> UI currently POSTs to `/api/assistant/chat` (based on inspected code).

## 4) Feature Flow: Weather

### Weather API route
**File:** `src/app/api/weather/route.ts`

**Flow:**
- GET `/api/weather?city=`
- Validates presence of city
- Calls `fetchWeatherData({ city })` from `src/lib/meteoblue.ts`
- Returns JSON.

### Where it’s used
- Assistant quick action “Weather” calls this API.
- Weather page uses `getWeather` from `src/app/actions` (not inspected yet—will be documented once we read `src/app/actions.ts` and relevant action files).

## 5) Feature Flow: 360° Virtual Tour Panel

### Selector section
**File:** `src/components/360/VirtualTourSection.tsx`

**Flow:**
- Uses `VIRTUAL_TOUR_LOCATIONS` from `src/data/virtual-tours`.
- User selects a location → updates `selectedId`.
- “Start 360° Tour” opens `VirtualTourPanel`.

### Virtual tour panel
**File:** `src/components/maps/virtual-tour-panel.tsx`

**Flow:**
- Shows either:
  - YouTube embed if `location.youtubeId` exists
  - or an image fallback otherwise
- Provides “Start AI Audio Guide”:
  - calls `generateAiTourGuide(location.name)` from `src/app/actions/ai-guide`
  - uses Web Speech API (`SpeechSynthesisUtterance`) to read:
    - `aiContent.script`
  - shows “Did you know?” trivia answers.
- Provides footer links:
  - Google Maps search by coordinates
  - `/planner?dest=...` link

## 6) Feature Flow: ImageKit-backed Gallery

### Gallery photos API
**File:** `src/app/api/imagekit-photos/route.ts`

**Flow:**
- Lists ImageKit assets from `/gallery`.
- Parses metadata and filenames into `TravelerPhoto` objects.
- Returns `{ photos: TravelerPhoto[] }` sorted by uploaded time.

### ImageKit auth token API
**File:** `src/app/api/imagekit-auth/route.ts`

**Flow:**
- Requires `IMAGEKIT_PRIVATE_KEY` env var.
- Generates HMAC token with ~30 minutes expiry.
- Returns no-store headers.

## 7) What’s still missing for “FULL document”
To complete the full flow for **every page and every feature**, we must still inspect:
- Remaining pages under `src/app/**/page.tsx` (district details, blog, dashboard, my-trips grids, etc.)
- All actions files:
  - `src/app/actions.ts`
  - `src/app/actions/ai-guide.ts`
- All feature modules under `src/features/*` (bookings, safety, trips, offline, permits, etc.)
- Any remaining API routes:
  - `src/app/api/imagekit-delete/route.ts`
  - `src/app/api/assistant/*` (already partially)

## 8) Suggested documentation output (final)
Once all files are inspected, the final `docs/PROJECT-FLOW.md` will include:
- A route index (every path → what it renders)
- A per-feature flow section:
  - Inputs → API calls → state updates → outputs
- “Working checklist” based on code-level wiring (data sources + API endpoints + expected response shapes)

