"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  GeoJSON,
  LayersControl,
  MapContainer,
  Polyline,
  Popup,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import L from "leaflet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import nationalBoundary from "@/data/national_boundary.json";
import provincialBoundary from "@/data/provincial_boundary.json";
import punjabSpots from "@/data/punjab.json";
import sindhSpots from "@/data/sindh.json";
import kpSpots from "@/data/kp.json";
import balochistanSpots from "@/data/balochistan.json";
import gilgitBaltistanSpots from "@/data/gilgit_baltistan.json";
import azadKashmirSpots from "@/data/azad_kashmir.json";
import capitalSpots from "@/data/capital.json";

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
};

const ROUTE_SEGMENT_COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function getSpotKey(spot: SpotFeature, idx: number) {
  return `${spot.properties._key ?? "spot"}-${idx}`;
}

function getCategoryColor(category?: string | null) {
  if (!category) return "#2563eb";
  return CATEGORY_COLORS[category] ?? "#2563eb";
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

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#00798C_0%,#30638E_55%,#003D5B_100%)] pt-24 md:pt-28 pb-8 md:pb-10">
      <div className="container mx-auto px-4 space-y-6">
        <div className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pakistan Map Explorer</h1>
          <p className="mt-2 text-muted-foreground">
            Select a province to view tourism spots. Click any marker to open details for that area.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent className="z-[1200]">
                {PROVINCE_OPTIONS.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="z-[1200]">
                <SelectItem value="all">All Districts</SelectItem>
                {districtOptions
                  .filter((district) => district !== "all")
                  .map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{selectedSpots.length}</span> spots
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <MapContainer
              center={[30.3753, 69.3451]}
              zoom={6}
              scrollWheelZoom
              className="h-[56vh] md:h-[70vh] w-full"
            >
              <LayersControl position="topleft">
                <LayersControl.BaseLayer checked name="Street (OSM)">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    crossOrigin="anonymous"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Topographic">
                  <TileLayer
                    attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Tiles: <a href="https://opentopomap.org">OpenTopoMap</a>'
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

                <LayersControl.Overlay checked name="Terrain / Hillshade (3D-like)">
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

              <GeoJSON
                data={nationalBoundary as GeoJSON.GeoJsonObject}
                style={{ color: "#0f172a", weight: 2.2, opacity: 0.9, fillOpacity: 0.04 }}
              />
              <GeoJSON
                data={provincialBoundary as GeoJSON.GeoJsonObject}
                style={{ color: "#1e40af", weight: 1.2, opacity: 0.8, fillOpacity: 0 }}
              />

              {selectedSpots.map((spot, idx) => {
                const spotKey = getSpotKey(spot, idx);
                const isActive = selectedSpotKey === spotKey;
                const coords = getSpotLatLng(spot);
                const isRouteStop = routeSpotSet.has(spot);
                if (isActive || !coords || (isRouteMode && isRouteStop)) return null;

                const p = spot.properties;
                const categoryColor = getCategoryColor(p.category);
                const [lat, lng] = coords;

                return (
                  <CircleMarker
                    key={spotKey}
                    center={[lat, lng]}
                    radius={isRouteMode ? 5 : 7}
                    eventHandlers={{
                      click: () => setSelectedSpotKey(spotKey),
                    }}
                    pathOptions={{
                      color: isRouteMode ? "#94a3b8" : categoryColor,
                      fillColor: isRouteMode ? "#94a3b8" : categoryColor,
                      fillOpacity: isRouteMode ? 0.2 : 0.85,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{p._key ?? "Tourist Spot"}</p>
                        {p.category && <p><strong>Category:</strong> {p.category}</p>}
                        {p.district && <p><strong>District:</strong> {p.district}</p>}
                        {p.tehsil && <p><strong>Tehsil:</strong> {p.tehsil}</p>}
                        {p.province && <p><strong>Province:</strong> {p.province}</p>}
                        {p.Desc && <p className="text-sm">{p.Desc}</p>}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {selectedSpots.map((spot, idx) => {
                const spotKey = getSpotKey(spot, idx);
                const isActive = selectedSpotKey === spotKey;
                const coords = getSpotLatLng(spot);
                const isRouteStop = routeSpotSet.has(spot);
                if (!isActive || !coords || (isRouteMode && isRouteStop)) return null;

                const p = spot.properties;
                const categoryColor = getCategoryColor(p.category);
                const [lat, lng] = coords;

                return (
                  <CircleMarker
                    key={`${spotKey}-active`}
                    center={[lat, lng]}
                    radius={12}
                    eventHandlers={{
                      click: () => setSelectedSpotKey(spotKey),
                    }}
                    pathOptions={{
                      color: "#111827",
                      fillColor: categoryColor,
                      fillOpacity: 1,
                      weight: 3,
                    }}
                  >
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{p._key ?? "Tourist Spot"}</p>
                        {p.category && <p><strong>Category:</strong> {p.category}</p>}
                        {p.district && <p><strong>District:</strong> {p.district}</p>}
                        {p.tehsil && <p><strong>Tehsil:</strong> {p.tehsil}</p>}
                        {p.province && <p><strong>Province:</strong> {p.province}</p>}
                        {p.Desc && <p className="text-sm">{p.Desc}</p>}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {routeStops.map((stop, idx) => {
                const coords = getSpotLatLng(stop.spot);
                if (!coords) return null;
                const [lat, lng] = coords;
                const color = ROUTE_SEGMENT_COLORS[idx % ROUTE_SEGMENT_COLORS.length];

                return (
                  <CircleMarker
                    key={`route-stop-${stop.key}-${idx}`}
                    center={[lat, lng]}
                    radius={11}
                    pathOptions={{
                      color: "#0f172a",
                      fillColor: color,
                      fillOpacity: 1,
                      weight: 3,
                    }}
                  >
                    <Tooltip permanent direction="top" offset={[0, -8]}>
                      {stop.role}
                    </Tooltip>
                    <Popup>
                      <div className="space-y-1">
                        <p className="font-semibold">{stop.role}</p>
                        <p>{stop.spot.properties._key ?? "Tourist Spot"}</p>
                        {stop.spot.properties.province && (
                          <p><strong>Province:</strong> {stop.spot.properties.province}</p>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {routeInfo?.path && (
                <Polyline
                  positions={routeInfo.path}
                  pathOptions={{
                    color: "#dc2626",
                    weight: 5,
                    opacity: 0.9,
                  }}
                />
              )}

              {routeSegments.map((segment, idx) => (
                <Polyline
                  key={`direct-segment-${idx}`}
                  positions={segment}
                  pathOptions={{
                    color: ROUTE_SEGMENT_COLORS[idx % ROUTE_SEGMENT_COLORS.length],
                    weight: 3,
                    opacity: 0.8,
                    dashArray: "10 8",
                  }}
                />
              ))}

              {pickedPoint && (
                <CircleMarker
                  center={[pickedPoint.lat, pickedPoint.lng]}
                  radius={9}
                  pathOptions={{ color: "#0f172a", fillColor: "#22c55e", fillOpacity: 0.95, weight: 2 }}
                >
                  <Popup>
                    <div className="space-y-1">
                      <p className="font-semibold">Selected Coordinates</p>
                      <p><strong>Lat:</strong> {pickedPoint.lat.toFixed(6)}</p>
                      <p><strong>Lng:</strong> {pickedPoint.lng.toFixed(6)}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {showLegend && (
                <div className="absolute z-[1200] right-3 bottom-3 rounded-lg border bg-white/95 p-3 text-[11px] shadow max-w-[230px]">
                  <p className="font-semibold mb-1">Legend</p>
                  <p>- Dashed multicolor: route segments</p>
                  <p>- Solid red line: road route</p>
                  <p>- Highlighted circle: selected point</p>
                </div>
              )}

              <FitToSpots spots={selectedSpots} />
              <FocusSelectedSpot spot={selectedSpot} />
            </MapContainer>
          </div>

          <aside className="rounded-2xl border bg-card p-3 md:p-4 shadow-sm">
            <Accordion
              type="multiple"
              className="w-full"
            >
              <AccordionItem value="spot-details">
                <AccordionTrigger className="py-2 text-base font-semibold hover:no-underline">
                  Spot Details
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click a marker or a card to sync selection.
                  </p>

                  <div className="mt-4 max-h-[38vh] md:max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                    {selectedSpots.map((spot, idx) => {
                      const p = spot.properties;
                      const spotKey = getSpotKey(spot, idx);
                      const isActive = selectedSpotKey === spotKey;
                      const color = getCategoryColor(p.category);

                      return (
                        <button
                          type="button"
                          key={spotKey}
                          onClick={() => setSelectedSpotKey(spotKey)}
                          className={`w-full rounded-xl border p-3 text-left transition ${
                            isActive ? "border-primary bg-primary/5" : "hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium leading-snug">{p._key ?? "Tourist Spot"}</p>
                            <span
                              className="mt-1 inline-block h-3 w-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {p.category ?? "General"} {p.district ? `• ${p.district}` : ""}
                          </p>
                          {p.Desc && (
                            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{p.Desc}</p>
                          )}
                        </button>
                      );
                    })}
                    {!selectedSpots.length && (
                      <p className="rounded-lg border p-3 text-sm text-muted-foreground">
                        No spots found for this filter.
                      </p>
                    )}
                  </div>

                  {selectedSpot && (
                    <div className="mt-4 rounded-xl border bg-muted/40 p-3">
                      <p className="text-sm font-semibold">Selected:</p>
                      <p className="text-sm">{selectedSpot.properties._key ?? "Tourist Spot"}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="distance-path">
                <AccordionTrigger className="py-2 text-base font-semibold hover:no-underline">
                  Distance & Path
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pick points across any province and build multi-stop routes.
                  </p>

                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">1st Spot (Start)</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Select value={fromProvinceKey} onValueChange={(value) => {
                        setFromProvinceKey(value);
                        setFromSpotKey("none");
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="From province" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="all">All Provinces</SelectItem>
                          {provinceOptions.map((province) => (
                            <SelectItem key={`from-province-${province}`} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={fromSpotKey} onValueChange={setFromSpotKey}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="From spot" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="none">From spot</SelectItem>
                          {fromSpotOptions.map((option) => (
                            <SelectItem key={`from-${option.key}`} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">2nd Stop (Optional)</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Select value={via1ProvinceKey} onValueChange={(value) => {
                        setVia1ProvinceKey(value);
                        setViaSpot1Key("none");
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Stop 1 province (optional)" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="all">All Provinces</SelectItem>
                          {provinceOptions.map((province) => (
                            <SelectItem key={`via1-province-${province}`} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={viaSpot1Key} onValueChange={setViaSpot1Key}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Via stop 1 (optional)" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="none">Via stop 1 (optional)</SelectItem>
                          {via1SpotOptions.map((option) => (
                            <SelectItem key={`via1-${option.key}`} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">3rd Stop (Optional)</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Select value={via2ProvinceKey} onValueChange={(value) => {
                        setVia2ProvinceKey(value);
                        setViaSpot2Key("none");
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Stop 2 province (optional)" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="all">All Provinces</SelectItem>
                          {provinceOptions.map((province) => (
                            <SelectItem key={`via2-province-${province}`} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={viaSpot2Key} onValueChange={setViaSpot2Key}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Via stop 2 (optional)" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="none">Via stop 2 (optional)</SelectItem>
                          {via2SpotOptions.map((option) => (
                            <SelectItem key={`via2-${option.key}`} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                    {extraStops.map((extraStop, idx) => {
                      const rowLabel = `${idx + 4}th Stop (Optional)`;
                      const options = filterSpotsByProvince(extraStop.provinceKey);
                      return (
                        <div key={`extra-stop-row-${extraStop.id}`}>
                          <div className="mb-1 flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">{rowLabel}</p>
                            <button
                              type="button"
                              onClick={() =>
                                setExtraStops((prev) => prev.filter((item) => item.id !== extraStop.id))
                              }
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid gap-2 md:grid-cols-2">
                            <Select
                              value={extraStop.provinceKey}
                              onValueChange={(value) =>
                                setExtraStops((prev) =>
                                  prev.map((item) =>
                                    item.id === extraStop.id
                                      ? { ...item, provinceKey: value, spotKey: "none" }
                                      : item
                                  )
                                )
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={`${rowLabel} province`} />
                              </SelectTrigger>
                              <SelectContent className="z-[1200]">
                                <SelectItem value="all">All Provinces</SelectItem>
                                {provinceOptions.map((province) => (
                                  <SelectItem key={`extra-${extraStop.id}-province-${province}`} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={extraStop.spotKey}
                              onValueChange={(value) =>
                                setExtraStops((prev) =>
                                  prev.map((item) =>
                                    item.id === extraStop.id ? { ...item, spotKey: value } : item
                                  )
                                )
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={rowLabel} />
                              </SelectTrigger>
                              <SelectContent className="z-[1200]">
                                <SelectItem value="none">{rowLabel}</SelectItem>
                                {options.map((option) => (
                                  <SelectItem key={`extra-${extraStop.id}-${option.key}`} value={option.key}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setExtraStops((prev) => [
                          ...prev,
                          { id: nextExtraStopId, provinceKey: "all", spotKey: "none" },
                        ]);
                        setNextExtraStopId((prev) => prev + 1);
                      }}
                    >
                      Add more stop
                    </Button>

                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Final Destination</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Select value={toProvinceKey} onValueChange={(value) => {
                        setToProvinceKey(value);
                        setToSpotKey("none");
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Destination province" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="all">All Provinces</SelectItem>
                          {provinceOptions.map((province) => (
                            <SelectItem key={`to-province-${province}`} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={toSpotKey} onValueChange={setToSpotKey}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="To spot" />
                        </SelectTrigger>
                        <SelectContent className="z-[1200]">
                          <SelectItem value="none">To spot</SelectItem>
                          {toSpotOptions.map((option) => (
                            <SelectItem key={`to-${option.key}`} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md bg-muted/50 p-2 space-y-1">
                    {routeDistanceKm !== null ? (
                      <p className="text-sm">
                        Straight-line distance:{" "}
                        <span className="font-semibold">{routeDistanceKm.toFixed(2)} km</span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Select both points to calculate distance.
                      </p>
                    )}

                    {routeLoading && <p className="text-xs text-muted-foreground">Fetching road route...</p>}
                    {routeInfo && !routeLoading && (
                      <>
                        <p className="text-sm">
                          Road distance: <span className="font-semibold">{routeInfo.distanceKm.toFixed(2)} km</span>
                        </p>
                        <p className="text-sm">
                          Estimated drive time:{" "}
                          <span className="font-semibold">{formatDuration(routeInfo.durationMin)}</span>
                        </p>
                      </>
                    )}
                    {routeError && !routeLoading && (
                      <p className="text-xs text-red-600">
                        Road route unavailable ({routeError}). Showing straight-line path.
                      </p>
                    )}
                    {routeStops.length > 0 && (
                      <div className="mt-2 space-y-1 border-t pt-2">
                        {routeStops.map((stop, idx) => (
                          <p key={`route-stop-label-${stop.key}-${idx}`} className="text-xs text-muted-foreground">
                            <span className="font-semibold">{stop.role}:</span>{" "}
                            {stop.spot.properties._key ?? "Tourist Spot"}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>
        </div>
      </div>
    </div>
  );
}
