"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Compass, Sparkles, Search, MapPin, Filter, ArrowRight, Info, Eye, Fuel } from "lucide-react";
import { LatLngBoundsExpression } from "leaflet";

function MapResizer({ isOpen }: { isOpen: boolean }) {
  const map = useMap();
  useEffect(() => {
    // Small timeout to allow container size to settle
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [isOpen, map]);
  return null;
}
import L from "leaflet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateAiTourGuide } from '@/app/actions/ai-guide';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import nationalBoundary from "@/data/national_boundary.json";
import provincialBoundary from "@/data/provincial_boundary.json";
import punjabSpots from "@/data/punjab.json";
import sindhSpots from "@/data/sindh.json";
import kpSpots from "@/data/kp.json";
import balochistanSpots from "@/data/balochistan.json";
import gilgitBaltistanSpots from "@/data/gilgit_baltistan.json";
import azadKashmirSpots from "@/data/azad_kashmir.json";
import capitalSpots from "@/data/capital.json";
import petrolPumps from "@/data/petrol_pumps.json";

type SpotProperties = {
  _key?: string;
  Desc?: string;
  category?: string;
  tehsil?: string | null;
  district?: string | null;
  division?: string | null;
  province?: string | null;
  Country?: string | null;
  latitude?: number;
  longitude?: number;
};

type SpotFeature = {
  type: string;
  properties: SpotProperties;
  geometry: {
    type: string;
    coordinates: number[];
  };
};

type RouteInfo = {
  path: [number, number][];
  distanceKm: number;
  durationMin: number;
};

type RouteStop = {
  key: string;
  spot: SpotFeature;
  label: string;
  role: string;
};

type ExtraStopSelection = {
  id: number;
  provinceKey: string;
  spotKey: string;
};

const PROVINCE_DATA: Record<string, { type?: string; features?: SpotFeature[] }> = {
  all: {
    type: "FeatureCollection",
    features: [
      ...punjabSpots.features,
      ...sindhSpots.features,
      ...kpSpots.features,
      ...balochistanSpots.features,
      ...gilgitBaltistanSpots.features,
      ...azadKashmirSpots.features,
      ...capitalSpots.features,
    ],
  },
  punjab: punjabSpots,
  sindh: sindhSpots,
  kp: kpSpots,
  balochistan: balochistanSpots,
  gilgit_baltistan: gilgitBaltistanSpots,
  azad_kashmir: azadKashmirSpots,
  capital: capitalSpots,
};

const PROVINCE_OPTIONS = [
  { value: "all", label: "All Provinces" },
  { value: "punjab", label: "Punjab" },
  { value: "sindh", label: "Sindh" },
  { value: "kp", label: "Khyber Pakhtunkhwa" },
  { value: "balochistan", label: "Balochistan" },
  { value: "gilgit_baltistan", label: "Gilgit-Baltistan" },
  { value: "azad_kashmir", label: "Azad Jammu & Kashmir" },
  { value: "capital", label: "Islamabad Capital Territory" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Waterfall: "#0ea5e9",
  Mosque: "#16a34a",
  Fort: "#b45309",
  Museum: "#7c3aed",
  Monument: "#db2777",
  "Hill Station": "#0f766e",
  Resort: "#0891b2",
  Mountainous: "#334155",
  Desert: "#d97706",
  Tower: "#4338ca",
  Temple: "#ea580c",
  Mine: "#52525b",
  "Petrol Pump": "#ef4444",
};

const ROUTE_SEGMENT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function getSpotKey(spot: SpotFeature, idx: number) {
  return `${spot.properties._key ?? "spot"}-${idx}`;
}

function getCategoryColor(category?: string | null) {
  if (!category) return "#2563eb";
  return CATEGORY_COLORS[category] ?? "#2563eb";
}

function createCustomIcon(category: string, isActive: boolean) {
  const color = getCategoryColor(category);
  
  if (category === "Petrol Pump") {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: ${isActive ? '28px' : '22px'}; 
          height: ${isActive ? '28px' : '22px'}; 
          background-color: #ef4444; 
          border: 2px solid white; 
          border-radius: 8px; 
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="${isActive ? '16' : '12'}" height="${isActive ? '16' : '12'}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22L15 22"/><path d="M4 9L14 9"/><path d="M14 22L14 4.5C14 3.12 12.88 2 11.5 2H6.5C5.12 2 4 3.12 4 4.5V22"/><path d="M18 22V17C18 15.89 18.9 15 20 15V15C21.1 15 22 15.89 22 17V22"/><path d="M14 13L18 17"/><circle cx="9" cy="9" r="2"/></svg>
        </div>
      `,
      iconSize: [isActive ? 28 : 22, isActive ? 28 : 22],
      iconAnchor: [isActive ? 14 : 11, isActive ? 14 : 11],
    });
  }

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${isActive ? '24px' : '16px'}; 
        height: ${isActive ? '24px' : '16px'}; 
        background-color: ${color}; 
        border: 2px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [isActive ? 24 : 16, isActive ? 24 : 16],
    iconAnchor: [isActive ? 12 : 8, isActive ? 12 : 8],
  });
}

function getSpotLatLng(spot: SpotFeature): [number, number] | null {
  const [lng, lat] = spot.geometry.coordinates;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return [lat, lng];
}

function haversineKm(a: [number, number], b: [number, number]) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return 6371 * y;
}

function formatDuration(totalMinutes: number) {
  const rounded = Math.max(0, Math.round(totalMinutes));
  const days = Math.floor(rounded / (24 * 60));
  const hours = Math.floor((rounded % (24 * 60)) / 60);
  const minutes = rounded % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours > 0 || days > 0) parts.push(`${hours} hr${hours === 1 ? "" : "s"}`);
  parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
  return parts.join(" ");
}

function FitToSpots({ spots }: { spots: SpotFeature[] }) {
  const map = useMap();

  useEffect(() => {
    if (!spots.length) return;
    const bounds: LatLngBoundsExpression = spots.map((spot) => [
      spot.geometry.coordinates[1],
      spot.geometry.coordinates[0],
    ]);
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 9 });
  }, [map, spots]);

  return null;
}

function FocusSelectedSpot({ spot }: { spot: SpotFeature | null }) {
  const map = useMap();

  useEffect(() => {
    if (!spot) return;
    const [lng, lat] = spot.geometry.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 8), { duration: 0.6 });
  }, [map, spot]);

  return null;
}

function LocateControl() {
  const map = useMap();

  const locateUser = () => {
    map.locate({ setView: true, maxZoom: 11, enableHighAccuracy: true });
  };

  return (
    <button
      type="button"
      onClick={locateUser}
      className="absolute z-[1200] right-2 top-2 rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:right-3 md:top-3 md:px-3 md:py-2 md:text-xs"
      title="Locate me"
    >
      Locate Me
    </button>
  );
}

function MapTools({
  onPickedPoint,
  onToggleLegend,
  showLegend,
  onExportPng,
  onPrintMap,
}: {
  onPickedPoint: (coords: { lat: number; lng: number } | null) => void;
  onToggleLegend: () => void;
  showLegend: boolean;
  onExportPng: () => void;
  onPrintMap: () => void;
}) {
  const map = useMap();
  const [mouseLatLng, setMouseLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const handleMove = (e: L.LeafletMouseEvent) => {
      setMouseLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    const handleClick = (e: L.LeafletMouseEvent) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      onPickedPoint(coords);
    };

    map.on("mousemove", handleMove);
    map.on("click", handleClick);
    return () => {
      map.off("mousemove", handleMove);
      map.off("click", handleClick);
    };
  }, [map, onPickedPoint]);

  const resetPakistanView = () => {
    map.setView([30.3753, 69.3451], 6);
  };

  const toggleFullscreen = async () => {
    const container = map.getContainer();
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <>
      <div className="absolute z-[1200] right-2 top-11 flex max-w-[160px] flex-wrap justify-end gap-1.5 md:right-3 md:top-14 md:max-w-none md:flex-col md:gap-2">
        <button
          type="button"
          onClick={resetPakistanView}
          className="rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:px-3 md:py-2 md:text-xs"
          title="Reset map view"
        >
          Reset View
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:px-3 md:py-2 md:text-xs"
          title="Toggle fullscreen"
        >
          Fullscreen
        </button>
        <button
          type="button"
          onClick={onToggleLegend}
          className="rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:px-3 md:py-2 md:text-xs"
          title="Toggle legend panel"
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>
        <button
          type="button"
          onClick={onExportPng}
          className="rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:px-3 md:py-2 md:text-xs"
          title="Export map as PNG"
        >
          Export PNG
        </button>
        <button
          type="button"
          onClick={onPrintMap}
          className="rounded-md border bg-white/95 px-2 py-1.5 text-[11px] font-semibold shadow hover:bg-white md:px-3 md:py-2 md:text-xs"
          title="Print map snapshot"
        >
          Print Map
        </button>
      </div>

      <div className="pointer-events-none absolute z-[1200] left-12 bottom-3 hidden rounded-md border bg-white/95 px-2 py-1 text-[11px] text-slate-700 shadow md:block">
        {mouseLatLng
          ? `Lat ${mouseLatLng.lat.toFixed(5)} | Lng ${mouseLatLng.lng.toFixed(5)}`
          : "Move cursor on map"}
      </div>
    </>
  );
}

import { VirtualTourPanel } from "./virtual-tour-panel";
import { VIRTUAL_TOUR_LOCATIONS } from "@/data/virtual-tours";

export default function PakistanMap() {
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSpotKey, setSelectedSpotKey] = useState<string | null>(null);
  const [fromSpotKey, setFromSpotKey] = useState<string>("none");
  const [viaSpot1Key, setViaSpot1Key] = useState<string>("none");
  const [viaSpot2Key, setViaSpot2Key] = useState<string>("none");
  const [toSpotKey, setToSpotKey] = useState<string>("none");
  const [fromProvinceKey, setFromProvinceKey] = useState<string>("all");
  const [via1ProvinceKey, setVia1ProvinceKey] = useState<string>("all");
  const [via2ProvinceKey, setVia2ProvinceKey] = useState<string>("all");
  const [toProvinceKey, setToProvinceKey] = useState<string>("all");
  const [extraStops, setExtraStops] = useState<ExtraStopSelection[]>([]);
  const [nextExtraStopId, setNextExtraStopId] = useState(1);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [pickedPoint, setPickedPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Sidebar / Accordion State
  const [expandedAccordion, setExpandedAccordion] = useState<string[]>(["spot-details", "spots-list"]);
  const [isTourPanelOpen, setIsTourPanelOpen] = useState(false);
  const [tourLocation, setTourLocation] = useState<{
    name: string;
    coordinates: { lat: number; lng: number };
    province: string;
    imageUrl: string;
    youtubeId?: string;
    description?: string;
    category?: string;
  } | null>(null);

  const handleSpotClick = (spot: SpotFeature, key: string) => {
    setSelectedSpotKey(key);
    
    // Try to find a featured tour spot with better fuzzy matching
    const searchName = spot.properties._key?.toLowerCase() || "";
    const tourSpot = VIRTUAL_TOUR_LOCATIONS.find(loc => {
      const locName = loc.name.toLowerCase();
      return locName.includes(searchName) || searchName.includes(locName) || 
             (searchName.includes("faisal") && locName.includes("faisal"));
    });

    const latLng = getSpotLatLng(spot);
    const spotName = spot.properties._key || "Unknown Location";
    const category = spot.properties.category?.toLowerCase() || "tourism";
    
    // Dynamic image search term
    const CATEGORY_IMAGES: Record<string, string> = {
      nature: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
      waterfall: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2000&auto=format&fit=crop",
      historical: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2000&auto=format&fit=crop",
      religious: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2000&auto=format&fit=crop",
      adventure: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2000&auto=format&fit=crop",
      cultural: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2000&auto=format&fit=crop",
      park: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop"
    };

    const smartFallback = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["nature"];

    setTourLocation({
      name: spotName,
      coordinates: tourSpot ? tourSpot.coordinates : (latLng ? { lat: latLng[0], lng: latLng[1] } : { lat: 30, lng: 70 }),
      province: spot.properties.province || tourSpot?.province || "Pakistan",
      imageUrl: tourSpot?.imageUrl || smartFallback,
      youtubeId: tourSpot?.youtubeId,
      description: spot.properties.Desc || tourSpot?.description,
      category: spot.properties.category || tourSpot?.category
    });
    
    // Auto-expand spot details and ensure it's open
    setExpandedAccordion(["spot-details"]);
    // setIsTourPanelOpen(true); // Don't auto-open tour panel, show sidebar details instead
  };

  // Sync with search params for virtual tours
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tourId = searchParams.get('tour');
      if (tourId) {
        const tourSpot = VIRTUAL_TOUR_LOCATIONS.find(loc => loc.id === tourId);
        if (tourSpot) {
          setTourLocation({
            name: tourSpot.name,
            coordinates: tourSpot.coordinates,
            province: tourSpot.province,
            imageUrl: tourSpot.imageUrl,
            youtubeId: tourSpot.youtubeId
          });
          setIsTourPanelOpen(true);
        }
      }
    }
  }, []);

  const exportSnapshot = async (printMode: boolean) => {
    try {
      const container = document.querySelector(".leaflet-container") as HTMLElement | null;
      if (!container) {
        toast({
          title: "Map not ready",
          description: "Wait for the map to finish loading, then try again.",
        });
        return;
      }
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/png");

      if (printMode) {
        const w = window.open("", "_blank");
        if (!w) {
          toast({
            variant: "destructive",
            title: "Could not open print window",
            description: "Allow pop-ups for this site, then try Print Map again.",
          });
          return;
        }
        w.document.write(`<img src="${imageData}" style="max-width:100%;display:block;margin:0 auto;" />`);
        w.document.close();
        w.focus();
        w.print();
      } else {
        const a = document.createElement("a");
        a.href = imageData;
        a.download = `insighttravelpk-map-${Date.now()}.png`;
        a.click();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: printMode ? "Print failed" : "Export failed",
        description:
          err instanceof Error
            ? err.message
            : "Could not capture the map. Try again or use a different basemap if tiles block export.",
      });
    }
  };

  const provinceSpots = useMemo(() => {
    const features = PROVINCE_DATA[selectedProvince]?.features ?? [];
    return features.filter((spot) => {
      const coords = spot?.geometry?.coordinates;
      return Array.isArray(coords) && coords.length >= 2;
    });
  }, [selectedProvince]);

  const districtOptions = useMemo(() => {
    const names = provinceSpots
      .map((spot) => spot.properties.district?.trim())
      .filter((district): district is string => Boolean(district));
    return ["all", ...Array.from(new Set(names)).sort((a, b) => a.localeCompare(b))];
  }, [provinceSpots]);

  const selectedSpots = useMemo(() => {
    if (selectedDistrict === "all") return provinceSpots;
    return provinceSpots.filter((spot) => spot.properties.district === selectedDistrict);
  }, [provinceSpots, selectedDistrict]);

  useEffect(() => {
    setSelectedDistrict("all");
    setSelectedSpotKey(null);
    setFromSpotKey("none");
    setViaSpot1Key("none");
    setViaSpot2Key("none");
    setToSpotKey("none");
    setFromProvinceKey("all");
    setVia1ProvinceKey("all");
    setVia2ProvinceKey("all");
    setToProvinceKey("all");
    setExtraStops([]);
    setNextExtraStopId(1);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedSpotKey(null);
    setFromSpotKey("none");
    setViaSpot1Key("none");
    setViaSpot2Key("none");
    setToSpotKey("none");
    setFromProvinceKey("all");
    setVia1ProvinceKey("all");
    setVia2ProvinceKey("all");
    setToProvinceKey("all");
    setExtraStops([]);
    setNextExtraStopId(1);
  }, [selectedDistrict]);

  const selectedSpot = useMemo(() => {
    if (!selectedSpotKey) return null;
    return selectedSpots.find((spot, idx) => getSpotKey(spot, idx) === selectedSpotKey) ?? null;
  }, [selectedSpotKey, selectedSpots]);

  const allSpots = useMemo(() => {
    const features = PROVINCE_DATA.all.features ?? [];
    return features.filter((spot) => Boolean(getSpotLatLng(spot)));
  }, []);

  const spotOptions = useMemo(
    () =>
      allSpots.map((spot, idx) => {
        return {
          key: getSpotKey(spot, idx),
          label: `${spot.properties._key ?? `Spot ${idx + 1}`}`,
          province: spot.properties.province ?? "Other",
          spot,
        };
      }),
    [allSpots]
  );

  const groupedSpotOptions = useMemo(() => {
    const map = new Map<string, typeof spotOptions>();
    spotOptions.forEach((option) => {
      const province = option.province || "Other";
      const list = map.get(province) ?? [];
      list.push(option);
      map.set(province, list);
    });

    return Array.from(map.entries())
      .map(([province, options]) => ({
        province,
        options: options.sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .sort((a, b) => a.province.localeCompare(b.province));
  }, [spotOptions]);

  const provinceOptions = useMemo(
    () => groupedSpotOptions.map((group) => group.province),
    [groupedSpotOptions]
  );

  const spotLookup = useMemo(() => {
    const map = new Map<string, (typeof spotOptions)[number]>();
    spotOptions.forEach((option) => map.set(option.key, option));
    return map;
  }, [spotOptions]);

  const filterSpotsByProvince = (province: string) =>
    spotOptions.filter((option) => province === "all" || option.province === province);

  const fromSpotOptions = useMemo(() => filterSpotsByProvince(fromProvinceKey), [spotOptions, fromProvinceKey]);
  const via1SpotOptions = useMemo(() => filterSpotsByProvince(via1ProvinceKey), [spotOptions, via1ProvinceKey]);
  const via2SpotOptions = useMemo(() => filterSpotsByProvince(via2ProvinceKey), [spotOptions, via2ProvinceKey]);
  const toSpotOptions = useMemo(() => filterSpotsByProvince(toProvinceKey), [spotOptions, toProvinceKey]);

  const fromSpot = useMemo(
    () => spotOptions.find((option) => option.key === fromSpotKey)?.spot ?? null,
    [spotOptions, fromSpotKey]
  );
  const toSpot = useMemo(
    () => spotOptions.find((option) => option.key === toSpotKey)?.spot ?? null,
    [spotOptions, toSpotKey]
  );
  const viaSpot1 = useMemo(
    () => spotOptions.find((option) => option.key === viaSpot1Key)?.spot ?? null,
    [spotOptions, viaSpot1Key]
  );
  const viaSpot2 = useMemo(
    () => spotOptions.find((option) => option.key === viaSpot2Key)?.spot ?? null,
    [spotOptions, viaSpot2Key]
  );

  const routeStops = useMemo<RouteStop[]>(() => {
    const unique = new Set<string>();
    const selected = [
      { key: fromSpotKey, spot: fromSpot, label: "Start" },
      { key: viaSpot1Key, spot: viaSpot1, label: "Stop 1" },
      { key: viaSpot2Key, spot: viaSpot2, label: "Stop 2" },
      ...extraStops.map((extra, idx) => ({
        key: extra.spotKey,
        spot: spotLookup.get(extra.spotKey)?.spot ?? null,
        label: `Stop ${idx + 3}`,
      })),
      { key: toSpotKey, spot: toSpot, label: "Final Destination" },
    ].filter((item) => item.key !== "none" && item.spot);

    const ordered: RouteStop[] = [];
    selected.forEach((item) => {
      if (!item.spot) return;
      if (unique.has(item.key)) return;
      unique.add(item.key);
      ordered.push({
        key: item.key,
        spot: item.spot,
        label: item.label,
        role: item.label,
      });
    });

    if (ordered.length > 1) {
      ordered[0].role = "Start";
      ordered[ordered.length - 1].role = "Final Destination";
      if (ordered.length > 2) {
        for (let i = 1; i < ordered.length - 1; i += 1) {
          ordered[i].role = `Stop ${i}`;
        }
      }
    }

    return ordered;
  }, [
    fromSpotKey,
    fromSpot,
    viaSpot1Key,
    viaSpot1,
    viaSpot2Key,
    viaSpot2,
    extraStops,
    spotLookup,
    toSpotKey,
    toSpot,
  ]);

  const routeLine = useMemo(() => {
    if (routeStops.length < 2) return null;
    const points = routeStops
      .map((stop) => getSpotLatLng(stop.spot))
      .filter(Boolean) as [number, number][];
    if (points.length < 2) return null;
    return points;
  }, [routeStops]);

  const routeSegments = useMemo(() => {
    if (!routeLine || routeLine.length < 2) return [];
    return routeLine.slice(0, -1).map((point, idx) => [point, routeLine[idx + 1]] as [number, number][]);
  }, [routeLine]);

  const isRouteMode = routeStops.length >= 2;
  const routeSpotSet = useMemo(() => new Set(routeStops.map((stop) => stop.spot)), [routeStops]);

  const routeDistanceKm = useMemo(() => {
    if (!routeLine) return null;
    return routeLine.slice(1).reduce((sum, point, idx) => {
      return sum + haversineKm(routeLine[idx], point);
    }, 0);
  }, [routeLine]);

  useEffect(() => {
    setRouteInfo(null);
    setRouteError(null);

    if (!routeLine || routeLine.length < 2) return;

    const controller = new AbortController();
    const coordinatesParam = routeLine.map(([lat, lng]) => `${lng},${lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesParam}?overview=full&geometries=geojson`;

    const fetchRoute = async () => {
      try {
        setRouteLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Routing service unavailable");
        const data = await response.json();
        const route = data?.routes?.[0];
        const coords: [number, number][] =
          route?.geometry?.coordinates?.map((c: number[]) => [c[1], c[0]]) ?? [];
        if (!coords.length) throw new Error("No road path found");

        setRouteInfo({
          path: coords,
          distanceKm: Number(route.distance) / 1000,
          durationMin: Number(route.duration) / 60,
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        setRouteError(error instanceof Error ? error.message : "Failed to fetch route");
      } finally {
        if (!controller.signal.aborted) setRouteLoading(false);
      }
    };

    fetchRoute();
    return () => controller.abort();
  }, [routeLine]);

  const filteredSpots = useMemo(() => {
    if (!searchQuery) return selectedSpots;
    const query = searchQuery.toLowerCase();
    return selectedSpots.filter(spot => 
      spot.properties._key?.toLowerCase().includes(query) ||
      spot.properties.district?.toLowerCase().includes(query) ||
      spot.properties.category?.toLowerCase().includes(query)
    );
  }, [selectedSpots, searchQuery]);

  return (
    <div className="flex flex-col h-screen bg-[#0f2027] overflow-hidden">
      {/* Top Navigation / Filter Bar */}
      <div className="z-[1000] p-4 md:p-6 bg-[#0f2027] border-b border-white/10 shadow-2xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                <Compass className="h-8 w-8 text-teal-400 animate-spin-slow" />
                Pakistan Map Explorer
              </h1>
              <p className="mt-1 text-slate-400 text-sm">
                Discover {selectedSpots.length} curated destinations across the nation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Interactive Guide Ready</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-teal-500">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent className="z-[1200] bg-[#162e39] border-white/10 text-white">
                {PROVINCE_OPTIONS.map((province) => (
                  <SelectItem key={province.value} value={province.value} className="focus:bg-teal-600 focus:text-white">
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 text-white rounded-xl focus:ring-teal-500">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="z-[1200] bg-[#162e39] border-white/10 text-white">
                <SelectItem value="all" className="focus:bg-teal-600 focus:text-white">All Districts</SelectItem>
                {districtOptions
                  .filter((district) => district !== "all")
                  .map((district) => (
                    <SelectItem key={district} value={district} className="focus:bg-teal-600 focus:text-white">
                      {district}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            <div className="hidden lg:flex items-center gap-2 px-4 rounded-xl border border-white/5 bg-white/5">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span className="text-xs text-slate-300">Click any marker for a 360° AI Tour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[30.3753, 69.3451]}
            zoom={6}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              crossOrigin="anonymous"
            />
            
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  crossOrigin="anonymous"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Topo Map">
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  crossOrigin="anonymous"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite">
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  crossOrigin="anonymous"
                />
              </LayersControl.BaseLayer>

              <LayersControl.Overlay name="Petrol Pumps">
                <MarkerClusterGroup>
                  {petrolPumps.features.map((spot, idx) => {
                    const p = spot.properties;
                    const latLng = getSpotLatLng(spot as SpotFeature);
                    if (!latLng) return null;
                    return (
                      <Marker
                        key={`pump-${idx}`}
                        position={latLng}
                        icon={createCustomIcon("Petrol Pump", false)}
                      >
                        <Popup className="custom-popup" minWidth={200}>
                          <div className="p-2 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg">
                            <div className="border-b border-red-100 pb-2">
                              <h3 className="font-bold text-sm text-red-900 leading-tight">{p._key}</h3>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Fuel className="h-2 w-2 text-red-600" />
                                <p className="text-[9px] text-red-700 uppercase font-bold tracking-wider">{p.district}, {p.province}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {p.Desc}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MarkerClusterGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="3D Hillshade">
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
                  opacity={0.35}
                  crossOrigin="anonymous"
                />
              </LayersControl.Overlay>
            </LayersControl>

            <ScaleControl position="bottomleft" />
            <LocateControl />
            <MapTools
              onPickedPoint={setPickedPoint}
              onToggleLegend={() => setShowLegend((v) => !v)}
              showLegend={showLegend}
              onExportPng={() => exportSnapshot(false)}
              onPrintMap={() => exportSnapshot(true)}
            />

            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={50}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
            >
              {selectedSpots.map((spot, idx) => {
                const spotKey = getSpotKey(spot, idx);
                const isActive = selectedSpotKey === spotKey;
                const coords = getSpotLatLng(spot);
                if (!coords) return null;

                const p = spot.properties;
                const [lat, lng] = coords;

                return (
                  <Marker
                    key={`marker-${spotKey}`}
                    position={[lat, lng]}
                    icon={createCustomIcon(p.category || "Tourism", isActive)}
                    eventHandlers={{
                      click: () => handleSpotClick(spot, spotKey),
                    }}
                  >
                    <Popup className="custom-popup" minWidth={220}>
                      <div className="p-2 space-y-3 bg-white/95 backdrop-blur-sm rounded-lg">
                        <div className="border-b border-teal-100 pb-2">
                          <h3 className="font-bold text-sm text-teal-900 leading-tight">{p._key ?? "Tourist Spot"}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="h-2 w-2 text-teal-600" />
                            <p className="text-[9px] text-teal-700 uppercase font-bold tracking-wider">{p.province}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {p.Desc || "Explore this stunning destination and discover its unique beauty."}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full h-9 text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02]"
                          onClick={() => handleSpotClick(spot, spotKey)}
                        >
                          View Details & Tour
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>

            {routeInfo?.path && (
              <Polyline positions={routeInfo.path} pathOptions={{ color: "#dc2626", weight: 5 }} />
            )}

            {showLegend && (
              <div className="absolute z-[1200] right-3 bottom-3 rounded-xl border border-white/10 bg-[#0f2027]/90 p-4 text-[11px] text-white shadow-2xl backdrop-blur-md">
                <p className="font-bold text-teal-400 mb-2 uppercase tracking-widest">Map Legend</p>
                <div className="space-y-1.5 opacity-80">
                  <p>• Colored markers: Attractions</p>
                  <p>• Grouped bubbles: Clusters</p>
                  <p>• Solid Red: Planned Route</p>
                </div>
              </div>
            )}

            <FitToSpots spots={selectedSpots} />
            <FocusSelectedSpot spot={selectedSpot} />
          </MapContainer>
        </div>

        {/* Desktop Information Sidebar */}
        <div className={cn(
          "hidden md:flex flex-col border-l border-white/10 bg-[#071317] transition-all duration-500 overflow-hidden",
          isTourPanelOpen ? "w-0 opacity-0" : "w-[380px] opacity-100"
        )}>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Spot Details Card */}
              <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/10">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-teal-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-white">Spot Details</span>
                  </div>
                  {tourLocation && (
                    <div className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30">
                      <span className="text-[9px] font-bold text-teal-400 uppercase tracking-tighter">{tourLocation.category || "Point of Interest"}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  {tourLocation ? (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                      {tourLocation.imageUrl && (
                        <div className="relative aspect-video rounded-xl overflow-hidden group">
                          <img 
                            src={tourLocation.imageUrl} 
                            alt={tourLocation.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{tourLocation.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="h-3 w-3 text-teal-400" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tourLocation.province}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {tourLocation.description || `${tourLocation.name} is a premier destination located in ${tourLocation.province}. Discover its beauty and history through our interactive guide.`}
                      </p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs h-10 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                          onClick={() => setIsTourPanelOpen(true)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Start VR Tour
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="relative inline-block mb-4">
                        <Compass className="h-12 w-12 text-teal-500/20 animate-spin-slow" />
                        <Search className="h-6 w-6 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Select a Destination</h4>
                      <p className="text-[11px] text-slate-500">Click a marker on the map to view its details and start a virtual tour.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Discover Spots Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-teal-400" />
                    <span className="font-bold text-xs uppercase tracking-widest text-white">Discover Spots</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {filteredSpots.length} Found
                  </span>
                </div>

                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name, category, or district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:bg-white/[0.08] transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {filteredSpots.length > 0 ? (
                    filteredSpots.slice(0, 50).map((spot, idx) => {
                      const spotKey = getSpotKey(spot, idx);
                      const isSelected = selectedSpotKey === spotKey;
                      
                      return (
                        <button
                          key={`list-${spotKey}`}
                          onClick={() => handleSpotClick(spot, spotKey)}
                          className={cn(
                            "w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 group",
                            isSelected 
                              ? "bg-teal-500/10 border-teal-500/30" 
                              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500",
                            isSelected ? "bg-teal-500 text-white scale-110" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-teal-400"
                          )}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <h4 className={cn(
                              "text-sm font-bold transition-colors truncate w-48",
                              isSelected ? "text-teal-400" : "text-white group-hover:text-teal-300"
                            )}>
                              {spot.properties._key}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{spot.properties.district}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-teal-500/70">{spot.properties.category}</span>
                            </div>
                          </div>
                          
                          <ArrowRight className={cn(
                            "h-4 w-4 transition-all duration-500",
                            isSelected ? "text-teal-400 translate-x-0" : "text-slate-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                          )} />
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                      <Filter className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                      <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">No spots found</h4>
                      <p className="text-[10px] text-slate-600 px-6 mt-1">Try adjusting your search query or zoom out to see more results.</p>
                    </div>
                  )}
                  
                  {filteredSpots.length > 50 && (
                    <p className="text-[10px] text-center text-slate-500 italic pt-4">Zoom in to explore {filteredSpots.length - 50} more destinations</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Desktop Virtual Tour Panel Overlay (Sidebar) */}
        <div className={cn(
          "hidden md:block h-full transition-all duration-500 overflow-hidden border-l border-white/10",
          isTourPanelOpen ? "w-[500px]" : "w-0 border-none"
        )}>
          <VirtualTourPanel 
            isOpen={isTourPanelOpen} 
            onClose={() => setIsTourPanelOpen(false)} 
            location={tourLocation} 
          />
        </div>
      </div>

      {/* Mobile Tour Panel (Fixed Overlay) */}
      <div className="md:hidden">
        <VirtualTourPanel 
          isOpen={isTourPanelOpen} 
          onClose={() => setIsTourPanelOpen(false)} 
          location={tourLocation} 
        />
      </div>
    </div>
  );
}
