import { redirect } from "next/navigation";

export default function MyTripsRedirectPage() {
  redirect("/saved-trips");
}
