import { provinces } from "@/lib/data";
import type { Region, Supplier } from "@/lib/pro/types";

export function regionToProvinceSlug(region: Region): string {
  if (region === "Islamabad Capital Territory") return "islamabad-capital-territory";
  if (region === "Khyber Pakhtunkhwa") return "khyber-pakhtunkhwa";
  if (region === "Gilgit-Baltistan") return "gilgit-baltistan";
  if (region === "Azad Kashmir") return "azad-kashmir";
  if (region === "Lahore") return "punjab";
  return region.toLowerCase().replace(/\s+/g, "-");
}

export function getDistrictOptionsForRegion(region: Region): string[] {
  const province = provinces.find((item) => item.slug === regionToProvinceSlug(region));
  return province?.districts.map((district) => district.name) ?? [];
}

export function isPublicPartner(supplier: Supplier): boolean {
  return supplier.verified && supplier.listedPublicly;
}
