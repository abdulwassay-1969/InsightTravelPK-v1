import Link from "next/link";
import { SavedTripsGrid } from "./saved-trips-grid";

export const metadata = {
  title: "Saved trip ideas | InsightTravelPK",
  description:
    "Curated Pakistan itineraries you can open in the Smart Planner with one click.",
};

export default function SavedTripsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50/40">
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#30638E]">
            Inspiration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#003D5B] md:text-4xl">
            Saved trip ideas
          </h1>
          <p className="mt-3 text-muted-foreground md:text-lg">
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
