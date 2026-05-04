import type { Metadata } from "next";
import PakistanMapClient from "@/components/maps/pakistan-map-client";

export const metadata: Metadata = {
  title: "Map | InsightTravelPK",
  description: "Explore Pakistan on an interactive map with province-level tourism spots.",
};

export default function MapPage() {
  return <PakistanMapClient />;
}
