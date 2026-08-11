"use client";

import { useState, useCallback, useMemo } from "react";
import { haversineDistance, getUserCoordinates } from "@/lib/distance";

// ─── Pricing Config ────────────────────────────────────────────────────────────
const BASE_PRICE_PER_M2 = 2_000;   // ₺ per m²
const FEATURE_EXTRAS: Record<string, number> = {
  "Motorized Roof":       8_500,
  "LED Lighting":         3_200,
  "Zip Screen / Glass Side": 12_000,
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type Feature = "Motorized Roof" | "LED Lighting" | "Zip Screen / Glass Side";
const ALL_FEATURES: Feature[] = [
  "Motorized Roof",
  "LED Lighting",
  "Zip Screen / Glass Side",
];

interface CompanyOffer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  baseDistanceKm: number;      // fallback when no GPS
  /** Multiplier applied on top of the calculated price (e.g. 1.05 = 5% premium) */
  priceMultiplier: number;
  features: Feature[];         // features this company supports
  lat: number;
  lon: number;
}

// ─── Mock companies — prices are now computed from user inputs ─────────────────
const COMPANIES: CompanyOffer[] = [
  {
    id: "a",
    name: "Elite Pergola Design",
    rating: 4.9,
    reviewCount: 120,
    baseDistanceKm: 2.4,
    priceMultiplier: 1.05,    // 5% premium
    features: ["Motorized Roof", "LED Lighting"],
    lat: 41.025,
    lon: 28.974,
  },
  {
    id: "b",
    name: "Modern Outdoor Solutions",
    rating: 4.7,
    reviewCount: 85,
    baseDistanceKm: 5.1,
    priceMultiplier: 1.0,     // base price
    features: ["LED Lighting", "Zip Screen / Glass Side"],
    lat: 41.032,
    lon: 29.01,
  },
  {
    id: "c",
    name: "Skyline Pergola Pro",
    rating: 4.5,
    reviewCount: 62,
    baseDistanceKm: 8.3,
    priceMultiplier: 0.95,    // 5% discount
    features: ["Motorized Roof", "Zip Screen / Glass Side"],
    lat: 41.012,
    lon: 28.95,
  },
];

// ─── Price Calculation ─────────────────────────────────────────────────────────
function calculatePrice(
  area: number,
  selectedFeatures: Set<Feature>,
  multiplier: number
): number {
  const base = BASE_PRICE_PER_M2 * area;
  const extras = [...selectedFeatures].reduce(
    (sum, f) => sum + (FEATURE_EXTRAS[f] ?? 0),
    0
  );
  return Math.round((base + extras) * multiplier);
}

// ─── OfferCard ─────────────────────────────────────────────────────────────────
function OfferCard({
  company,
  price,
  distanceKm,
  isVisible,
}: {
  company: CompanyOffer;
  price: number;
  distanceKm: number;
  isVisible: boolean;          // hidden when outside search distance
}) {
  if (!isVisible) return null;

  return (
    <article className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant/20 flex flex-col gap-3 transition-all duration-300">
      <div className="flex justify-between items-start gap-3">
        {/* Left: name + meta */}
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-on-surface truncate">
            {company.name}
          </h4>
          <div className="flex flex-wrap items-center gap-1 mt-1 text-on-surface-variant text-xs">
            <span
              className="material-symbols-outlined text-base text-yellow-400"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 15 }}
            >
              star
            </span>
            <span className="font-semibold text-yellow-400">
              {company.rating}
            </span>
            <span>({company.reviewCount})</span>
            <span className="mx-1 text-outline">•</span>
            <span
              className="material-symbols-outlined text-outline"
              style={{ fontSize: 14 }}
            >
              location_on
            </span>
            <span className="tabular-nums">{distanceKm.toFixed(1)} km</span>
          </div>
        </div>

        {/* Right: live price */}
        <div className="text-right shrink-0">
          <span className="block text-xl font-bold text-primary tabular-nums transition-all duration-200">
            ₺{price.toLocaleString("tr-TR")}
          </span>
          {company.priceMultiplier !== 1 && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                company.priceMultiplier > 1
                  ? "bg-secondary/10 text-secondary"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {company.priceMultiplier > 1 ? "Üst Segment" : "En Uygun"}
            </span>
          )}
        </div>
      </div>

      {/* Feature chips */}
      <div className="flex gap-2 flex-wrap">
        {company.features.map((f) => (
          <span
            key={f}
            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[11px] font-semibold"
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="w-full h-10 mt-1 border border-primary text-primary text-sm font-semibold rounded-2xl hover:bg-primary/5 active:scale-[0.98] transition-all">
        Get Quote / Teklif Al
      </button>
    </article>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UserPage() {
  // ── Dimension ──────────────────────────────────────────────────────────────
  const [width, setWidth] = useState<number>(4);
  const [length, setLength] = useState<number>(5);
  const totalArea = useMemo(
    () => Math.max(0, width) * Math.max(0, length),
    [width, length]
  );

  // ── Feature toggles ────────────────────────────────────────────────────────
  const [motorized, setMotorized] = useState(true);
  const [led, setLed] = useState(false);
  const [zipScreen, setZipScreen] = useState(false);

  const selectedFeatures = useMemo<Set<Feature>>(() => {
    const s = new Set<Feature>();
    if (motorized) s.add("Motorized Roof");
    if (led) s.add("LED Lighting");
    if (zipScreen) s.add("Zip Screen / Glass Side");
    return s;
  }, [motorized, led, zipScreen]);

  const featureToggles: { label: Feature; value: boolean; set: (v: boolean) => void }[] = [
    { label: "Motorized Roof",           value: motorized,  set: setMotorized },
    { label: "LED Lighting",             value: led,        set: setLed },
    { label: "Zip Screen / Glass Side",  value: zipScreen,  set: setZipScreen },
  ];

  // ── Distance ───────────────────────────────────────────────────────────────
  const [distance, setDistance] = useState(25);

  // ── Geolocation ────────────────────────────────────────────────────────────
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");

  const handleUseLocation = useCallback(async () => {
    setLocationStatus("loading");
    const coords = await getUserCoordinates();
    if (coords) {
      setUserCoords(coords);
      setLocationStatus("granted");
    } else {
      setLocationStatus("denied");
    }
  }, []);

  // ── Live price + distance per company ─────────────────────────────────────
  const computedOffers = useMemo(
    () =>
      COMPANIES.map((c) => {
        const distKm = userCoords
          ? haversineDistance(
              userCoords.lat,
              userCoords.lon,
              c.lat,
              c.lon
            )
          : c.baseDistanceKm;
        const price = calculatePrice(totalArea, selectedFeatures, c.priceMultiplier);
        const visible = distKm <= distance;
        return { company: c, distKm, price, visible };
      }),
    [userCoords, totalArea, selectedFeatures, distance]
  );

  const visibleCount = computedOffers.filter((o) => o.visible).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-surface text-on-surface pb-[100px] min-h-screen">

      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky bg-surface shadow-sm z-40">
        <div className="flex justify-between items-center px-4 py-2 w-full max-w-[1280px] mx-auto">
          <button
            aria-label="Konum"
            className="text-primary hover:opacity-90 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">location_on</span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-primary">
            PergolaPazarı
          </h1>

          <button
            aria-label="Hesap"
            className="text-primary hover:opacity-90 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="px-4 pt-6 pb-8 max-w-[1280px] mx-auto space-y-6">

        {/* ── Search Card ──────────────────────────────────────────────────── */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,52,65,0.07)] border border-outline-variant/30 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-primary/[0.03] pointer-events-none rounded-2xl"
          />

          <h2 className="text-xl font-bold text-primary mb-4 relative z-10">
            Find Your Perfect Pergola
          </h2>

          <div className="space-y-4 relative z-10">
            {/* ── Dimensions ─────────────────────────────────────────────── */}
            <div className="flex gap-3">
              {/* Width */}
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="width"
                  className="text-xs font-semibold text-on-surface-variant"
                >
                  Width / En (m)
                </label>
                <input
                  id="width"
                  type="number"
                  min={0}
                  step={0.5}
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 px-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-on-surface text-sm transition-all outline-none tabular-nums"
                />
              </div>

              {/* Length */}
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="length"
                  className="text-xs font-semibold text-on-surface-variant"
                >
                  Length / Boy (m)
                </label>
                <input
                  id="length"
                  type="number"
                  min={0}
                  step={0.5}
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 px-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white text-on-surface text-sm transition-all outline-none tabular-nums"
                />
              </div>
            </div>

            {/* ── Live Area + Base Price indicator ───────────────────────── */}
            <div className="flex items-center justify-between bg-primary/5 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">square_foot</span>
                <span className="text-sm font-bold tabular-nums">
                  {totalArea.toFixed(1)} m²
                </span>
                <span className="text-xs text-on-surface-variant font-normal">
                  alan
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant">Baz fiyat:</span>
                <span className="ml-1 text-sm font-bold text-primary tabular-nums">
                  ₺{(BASE_PRICE_PER_M2 * totalArea).toLocaleString("tr-TR")}
                </span>
              </div>
            </div>

            {/* ── Feature Chips ───────────────────────────────────────────── */}
            <div>
              <p className="text-xs font-semibold text-on-surface-variant mb-2">
                Features / Özellikler
              </p>
              <div className="flex flex-wrap gap-2">
                {featureToggles.map(({ label, value, set }) => (
                  <button
                    key={label}
                    onClick={() => set(!value)}
                    aria-pressed={value}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 ${
                      value
                        ? "border-primary bg-primary text-on-primary shadow-sm"
                        : "border-outline-variant bg-white text-on-surface-variant hover:bg-surface-variant"
                    }`}
                  >
                    {value && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    )}
                    {label}
                    {value && (
                      <span className="ml-1 text-[10px] opacity-75">
                        +₺{FEATURE_EXTRAS[label].toLocaleString("tr-TR")}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected extras summary */}
              {selectedFeatures.size > 0 && (
                <p className="text-xs text-on-surface-variant mt-2">
                  Ek ücret:{" "}
                  <span className="font-bold text-secondary tabular-nums">
                    +₺
                    {[...selectedFeatures]
                      .reduce((s, f) => s + FEATURE_EXTRAS[f], 0)
                      .toLocaleString("tr-TR")}
                  </span>
                </p>
              )}
            </div>

            {/* ── Location & Distance ─────────────────────────────────────── */}
            <div className="border-t border-outline-variant/30 pt-4 space-y-3">
              {/* Geolocation button */}
              <button
                onClick={handleUseLocation}
                disabled={locationStatus === "loading"}
                className={`w-full flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60 ${
                  locationStatus === "granted"
                    ? "border-green-500 text-green-600 bg-green-50"
                    : locationStatus === "denied"
                    ? "border-error text-error bg-error/5"
                    : "border-primary text-primary hover:bg-primary/5"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  {locationStatus === "granted"
                    ? "check_circle"
                    : locationStatus === "denied"
                    ? "location_disabled"
                    : "my_location"}
                </span>
                {locationStatus === "loading"
                  ? "Konum alınıyor…"
                  : locationStatus === "granted"
                  ? "Konum alındı — mesafeler güncellendi"
                  : locationStatus === "denied"
                  ? "İzin reddedildi — tarayıcı izinlerini kontrol et"
                  : "Use My Location"}
              </button>

              {/* Distance slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
                  <label htmlFor="distance">Search Distance / Arama Mesafesi</label>
                  <span className="tabular-nums text-primary">{distance} km</span>
                </div>
                <input
                  id="distance"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-surface-variant rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>5 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </div>

            {/* ── CTA ────────────────────────────────────────────────────── */}
            <button className="w-full h-12 bg-secondary-container text-on-secondary-container font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined">search</span>
              Fiyatları Karşılaştır{" "}
              {visibleCount > 0 && (
                <span className="bg-on-secondary-container/20 text-xs px-1.5 py-0.5 rounded-full">
                  {visibleCount} firma
                </span>
              )}
            </button>
          </div>
        </section>

        {/* ── Results ────────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">
              Best Offers Near You
            </h3>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
              {visibleCount === 0
                ? "Sonuç yok"
                : `${visibleCount} firma • ${distance} km içinde`}
            </span>
          </div>

          {/* Live price note */}
          <p className="text-xs text-on-surface-variant bg-primary/5 rounded-lg px-3 py-2 flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            Fiyatlar girilen m² ve seçilen özellikler ile anlık hesaplanmaktadır.
          </p>

          {visibleCount === 0 ? (
            <div className="py-12 flex flex-col items-center gap-3 border-2 border-dashed border-outline-variant/40 rounded-2xl">
              <span
                className="material-symbols-outlined text-outline-variant"
                style={{ fontSize: 40 }}
              >
                location_off
              </span>
              <p className="text-sm font-semibold text-on-surface-variant">
                Bu mesafe içinde firma bulunamadı
              </p>
              <button
                onClick={() => setDistance(Math.min(distance + 25, 100))}
                className="text-xs text-primary font-semibold underline"
              >
                Mesafeyi artır
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {computedOffers.map(({ company, distKm, price, visible }) => (
                <OfferCard
                  key={company.id}
                  company={company}
                  price={price}
                  distanceKm={distKm}
                  isVisible={visible}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Bottom Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface shadow-[0_-4px_20px_rgba(0,52,65,0.05)] rounded-t-xl border-t border-outline-variant/20">
        <button className="flex flex-col items-center gap-0.5 bg-secondary-container text-on-secondary-container rounded-full px-5 py-1.5 active:scale-95 transition-transform">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
          >
            search
          </span>
          <span className="text-[11px] font-semibold text-primary">Search</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-on-surface-variant px-5 py-1.5 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            request_quote
          </span>
          <span className="text-[11px] font-semibold">My Quotes</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-on-surface-variant px-5 py-1.5 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            person
          </span>
          <span className="text-[11px] font-semibold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
