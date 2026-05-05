import Link from "next/link";
import { SavedTripsGrid } from "./saved-trips-grid";
import { MyTrips } from "./my-trips";

export const metadata = {
  title: "My Saved Trips | InsightTravelPK",
  description:
    "Access your personalized AI-generated travel itineraries and curated Pakistan trip ideas.",
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
            My Saved Trips
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Manage your custom AI-generated itineraries or pick from our curated inspiration below.
          </p>
        </div>

        {/* User Saved Trips */}
        <MyTrips />

        {/* Separator */}
        <div className="mt-20 mb-12 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-slate-200" />
          <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest text-sm">Trip Inspiration</h2>
          <div className="h-[1px] flex-1 bg-slate-200" />
        </div>

        {/* Curated Presets */}
        <div className="text-center mb-10">
          <p className="text-muted-foreground">
            Pick a curated route mix—north, south, coast, and culture. Each opens in the{" "}
            <Link href="/planner" className="font-medium text-[#00798C] underline-offset-4 hover:underline">
              Smart Planner
            </Link>{" "}
            with fields pre-filled so you can edit and generate your plan.
          </p>
        </div>
        <SavedTripsGrid />
      </div>
    </div>
  );
}
