# InsightTravelPK

InsightTravelPK is a Next.js 15 travel platform focused on Pakistan tourism.

It includes:

- A public tourism portal with provinces, districts, maps, gallery, weather, planner, and content pages
- A Pro workspace for agency users
- A separate Admin portal for platform management
- A partner onboarding flow for hotels, guesthouses, restaurants, cafes, guides, and other tourism businesses

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI / shadcn-style UI components
- Firebase / Firestore
- ImageKit
- Supabase-backed Pro data layer with mock fallbacks

## Main App Areas

- `/` public tourism homepage
- `/pro/*` agency workspace
- `/admin/*` platform admin portal
- `/partners` vendor application page

## Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run typecheck:

```bash
npm run typecheck
```

Build for production:

```bash
npm run build
```

## Notes

- Pro and Admin routes are protected by middleware using demo cookie-based auth.
- Public partner applications feed into the admin review flow and can be published into both Pro supplier data and public province listings.
- Some features rely on environment variables for Firebase, ImageKit, and optional Supabase integration.
