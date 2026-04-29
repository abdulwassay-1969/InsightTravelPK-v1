export type AgencyPlan = "starter" | "pro" | "enterprise";

export type SupplierStatus = "verified" | "pending";
export type SupplierType =
  | "hotel"
  | "guesthouse"
  | "restaurant"
  | "cafe"
  | "guide"
  | "transport"
  | "activity"
  | "city-tours"
  | "trekking-operator";

export type RouteStatus = "open" | "restricted" | "closed" | "seasonal";

export type Region =
  | "Islamabad Capital Territory"
  | "Punjab"
  | "Sindh"
  | "Khyber Pakhtunkhwa"
  | "Balochistan"
  | "Gilgit-Baltistan"
  | "Azad Kashmir"
  | "Lahore";

export type Agency = {
  id: string;
  name: string;
  country: string;
  plan: AgencyPlan;
  createdAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  type: SupplierType;
  region: Region;
  district: string;
  location: string;
  verified: boolean;
  status: SupplierStatus;
  contactPublic: string;
  contactPrivate: string;
  languages: string[];
  pricingTier: "budget" | "mid" | "premium";
  description: string;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  listedPublicly: boolean;
  applicationSource: "admin" | "partner";
  submittedAt: string;
};

export type RouteCondition = {
  id: string;
  name: string;
  from: string;
  to: string;
  status: RouteStatus;
  lastUpdated: string;
  notes: string;
};

export type Permit = {
  id: string;
  name: string;
  region: Region;
  issuingBody: string;
  processingDays: string;
  cost: string;
  requiredFor: string;
  notes?: string;
};

export type PackageItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

export type ProPackage = {
  id: string;
  agencyId: string;
  title: string;
  destination: Region;
  duration: number;
  itinerary: PackageItineraryDay[];
  createdAt: string;
};
