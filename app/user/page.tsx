"use client";

import { useState, useCallback } from "react";
import { haversineDistance, getUserCoordinates } from "@/lib/distance";

// ─── Types ────────────────────────────────────────────────────────────────────
type Feature = "Motorized Roof" | "LED Lighting" | "Zip Screen / Glass Side";

interface Offer {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  price: number;
  features: string[];
  lat: number;
  lon: number;
}

// ─── Mock data (replace with Supabase query) ──────────────────────────────────
const MOCK_OFFERS: Offer[] = [
  {
    id: "a",
    name: "Elite Pergola Design",
    rating: 4.9,
    reviewCount: 120,
    distanceKm: 2.4,
    price: 45000,
    features: ["Motorized", "LED"],
    lat: 41.025,
    lon: 28.974,
  },
  {
    id: "b",
    name: "Modern Outdoor Solutions",
    rating: 4.7,
    reviewCount: 85,
    distanceKm: 5.1,
    price: 42000,
    features: ["LED", "Zip Screen"],
    lat: 41.032,
    lon: 29.01,
  },
];

const ALL_FEATURES: Feature[] = [
  "Motorized Roof",
  "LED Lighting",
  "Zip Screen / Glass Side",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StarIcon({ className }: { className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{ fontVariationSettings: "'FILL' 1" }}
    >
      star
    </span>
  );
}

function OfferCard({
  offer,
  userCoords,
}: {
  offer: Offer;
  userCoords: { lat: number; lon: number } | null;
}) {
  const dist = userCoords
    ? haversineDistance(userCoords.lat, userCoords.lon, offer.lat, offer.lon)
    : offer.distanceKm;

  return (
    <article className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant/20 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold leading-7 text-on-surface">
            {offer.name}
          </h4>
          <div className="flex items-center gap-1 mt-1 text-on-surface-variant text-xs leading-4">
            <StarIcon className="text-base text-[#FBBF24]" />
            <span className="font-semibold text-sm text-[#FBBF24]">
              {offer.rating}
            </span>
            <span>({offer.reviewCount} reviews)</span>
            <span className="mx-1">•</span>
            <span className="material-symbols-outlined text-sm">
              location_on
            </span>
            <span>{dist.toFixed(1)} km away</span>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-semibold leading-8 text-primary">
            ₺{offer.price.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {offer.features.map((f) => (
          <span
            key={f}
            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs leading-4"
          >
            {f}
          </span>
        ))}
      </div>

      <button className="w-full h-10 mt-2 border border-primary text-primary text-sm font-semibold leading-5 rounded-2xl hover:bg-primary/5 active:scale-[0.98] transition-all">
        Get Quote / Teklif Al
      </button>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserPage() {
  // Dimension state
  const [width, setWidth] = useState<string>("4");
  const [length, setLength] = useState<string>("5");

  // Derived area
  const area = (parseFloat(width) || 0) * (parseFloat(length) || 0);

  // Distance slider
  const [distance, setDistance] = useState<number>(25);

  // Feature chips
  const [selectedFeatures, setSelectedFeatures] = useState<Set<Feature>>(
    new Set(["Motorized Roof"])
  );

  const toggleFeature = (f: Feature) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  // Geolocation
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

  return (
    <div className="bg-surface font-inter text-on-surface pb-[100px]">
      {/* ── TopAppBar ────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky shadow-sm bg-surface z-40">
        <div className="flex justify-between items-center px-4 py-2 w-full max-w-[1280px] mx-auto">
          <button
            aria-label="Konum"
            className="text-primary hover:opacity-90 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">
              location_on
            </span>
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            PergolaPazarı
          </h1>
          <button
            aria-label="Hesap"
            className="text-primary hover:opacity-90 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">
              account_circle
            </span>
          </button>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="px-4 pt-8 pb-8 max-w-[1280px] mx-auto space-y-8">
        {/* Search Card */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant/30 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-primary/5 pointer-events-none rounded-xl"
          />

          <h2 className="text-2xl font-semibold leading-8 text-primary mb-3 relative z-10">
            Find Your Perfect Pergola
          </h2>

          <div className="space-y-3 relative z-10">
            {/* Dimensions */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="width"
                  className="text-sm font-semibold leading-5 text-on-surface-variant"
                >
                  Width / En (m)
                </label>
                <input
                  id="width"
                  type="number"
                  min={0}
                  step={0.5}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest text-on-surface transition-all outline-none"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label
                  htmlFor="length"
                  className="text-sm font-semibold leading-5 text-on-surface-variant"
                >
                  Length / Boy (m)
                </label>
                <input
                  id="length"
                  type="number"
                  min={0}
                  step={0.5}
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-container-lowest text-on-surface transition-all outline-none"
                />
              </div>
            </div>

            {/* Dynamic Area Badge */}
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-xl">
                square_foot
              </span>
              <span className="text-sm font-semibold leading-5">
                Total Area:{" "}
                <span className="tabular-nums">{area.toFixed(1)}</span> m²
              </span>
            </div>

            {/* Feature Chips */}
            <div className="pt-2">
              <p className="text-sm font-semibold leading-5 text-on-surface-variant mb-2">
                Features
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_FEATURES.map((f) => {
                  const active = selectedFeatures.has(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      aria-pressed={active}
                      className={`px-4 py-2 rounded-full border text-sm font-semibold leading-5 transition-colors ${
                        active
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-variant"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location & Distance */}
            <div className="pt-4 border-t border-outline-variant/30 space-y-4">
              <button
                onClick={handleUseLocation}
                disabled={locationStatus === "loading"}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-primary text-primary text-sm font-semibold leading-5 hover:bg-primary/5 transition-colors disabled:opacity-60"
              >
                <span className="material-symbols-outlined">
                  {locationStatus === "granted"
                    ? "check_circle"
                    : locationStatus === "denied"
                    ? "location_disabled"
                    : "my_location"}
                </span>
                {locationStatus === "loading"
                  ? "Konum alınıyor…"
                  : locationStatus === "granted"
                  ? "Konum alındı ✓"
                  : locationStatus === "denied"
                  ? "Konum izni reddedildi"
                  : "Use My Location"}
              </button>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold leading-5 text-on-surface-variant">
                  <label htmlFor="distance">Search Distance</label>
                  <span>
                    <span className="tabular-nums">{distance}</span> km
                  </span>
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
              </div>
            </div>

            {/* CTA */}
            <button className="w-full h-12 mt-4 bg-secondary-container text-on-secondary-container text-lg font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined">search</span>
              Find Pergola Deals / Fiyatları Karşılaştır
            </button>
          </div>
        </section>

        {/* Results */}
        <section className="space-y-3">
          <h3 className="text-2xl font-semibold leading-8 text-primary">
            Best Offers Near You
          </h3>
          <div className="space-y-4">
            {MOCK_OFFERS.map((offer) => (
              <OfferCard key={offer.id} offer={offer} userCoords={userCoords} />
            ))}
          </div>
        </section>
      </main>

      {/* ── BottomNavBar ─────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface shadow-[0_-4px_20px_rgba(0,52,65,0.05)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
          <span
            className="material-symbols-outlined text-sm font-semibold text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            search
          </span>
          <span className="text-sm font-semibold leading-5 text-primary mt-1">
            Search
          </span>
        </button>

        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200 px-4 py-1 rounded-full">
          <span className="material-symbols-outlined text-sm font-semibold">
            request_quote
          </span>
          <span className="text-sm font-semibold leading-5 mt-1">
            My Quotes
          </span>
        </button>

        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200 px-4 py-1 rounded-full">
          <span className="material-symbols-outlined text-sm font-semibold">
            person
          </span>
          <span className="text-sm font-semibold leading-5 mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
