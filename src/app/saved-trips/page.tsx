import { MyTrips } from "./my-trips";

export const metadata = {
  title: "Saved Plans | InsightTravelPK",
  description:
    "Access your saved AI-generated travel itineraries and curated Pakistan trip ideas.",
};

export default function SavedTripsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50/40 pb-20">
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#30638E]">
            Your Collection
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#003D5B] md:text-4xl">
            Saved Plans
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Open your saved AI itineraries here.
          </p>
        </div>

        <MyTrips />
      </div>
    </div>
  );
}
