import type { Metadata } from "next";
import { PhoneCall, ShieldAlert, Building2 } from "lucide-react";
import { CONTACTS } from "@/data/contacts";

export const metadata: Metadata = {
  title: "Contacts | InsightTravelPK",
  description: "Emergency and tourism department contacts for all provinces and regions of Pakistan.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-lime-50 pt-24 md:pt-28 pb-10 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border bg-card p-4 md:p-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Emergency & Tourism Contacts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Province-wise contacts for emergency support and tourism departments across Pakistan.
          </p>
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            Please verify numbers before travel. Official departments may update contact details over time.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CONTACTS.map((item) => (
            <article key={item.province} className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{item.province}</h2>

              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  Emergency Numbers
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Police:</span> {item.emergency.police}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Ambulance:</span> {item.emergency.ambulance}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Fire Brigade:</span> {item.emergency.fire}
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Motorway Police:</span>{" "}
                    {item.emergency.motorway}
                  </li>
                </ul>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4 text-primary" />
                  Tourism Department
                </div>
                <p className="text-sm">{item.tourism.department}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneCall className="h-3.5 w-3.5" />
                  {item.tourism.phone}
                </p>
                {item.tourism.website && (
                  <a
                    href={item.tourism.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Official website
                  </a>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Source: {item.tourism.source} • Last verified: {item.tourism.lastVerified}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
