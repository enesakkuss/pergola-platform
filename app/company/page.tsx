"use client";

import { useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PricingRules {
  basePrice: number;
  motorizedExtra: number;
  ledExtra: number;
  glassExtra: number;
  maxDistanceKm: number;
}

interface QuoteRequest {
  id: string;
  title: string;
  features: string[];
  distanceKm: number;
  estimatedPrice: number;
  receivedAgo: string;
  isNew: boolean;
  isPrimary: boolean; // true → filled CTA, false → outline CTA
}

// ─── Mock quote data (replace with Supabase realtime subscription) ─────────────
const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: "q1",
    title: "20 m² Custom Pergola",
    features: ["Motorized", "LED"],
    distanceKm: 12,
    estimatedPrice: 48000,
    receivedAgo: "2 hours ago",
    isNew: true,
    isPrimary: true,
  },
  {
    id: "q2",
    title: "15 m² Standard Build",
    features: ["Zip Screen"],
    distanceKm: 5,
    estimatedPrice: 32500,
    receivedAgo: "5 hours ago",
    isNew: true,
    isPrimary: false,
  },
];

// ─── Quote Card ────────────────────────────────────────────────────────────────
function QuoteCard({ quote }: { quote: QuoteRequest }) {
  return (
    <article className="bg-[--color-surface] rounded-xl p-6 border border-[--color-outline-variant]/30 shadow-[0_4px_20px_rgba(0,52,65,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:shadow-[0_12px_40px_rgba(0,52,65,0.10)] transition-shadow duration-300 relative overflow-hidden group">
      {/* Accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-[--color-secondary] transition-opacity duration-300 ${
          quote.isPrimary ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="flex-1 pl-2">
        {/* Feature + distance chips */}
        <div className="flex flex-wrap gap-2 mb-1">
          {quote.features.map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full bg-[--color-primary]/10 text-[--color-primary] text-xs font-semibold shadow-sm"
            >
              {f}
            </span>
          ))}
          <span className="px-3 py-1 rounded-full bg-[--color-surface-variant] text-[--color-on-surface-variant] text-xs font-semibold flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              route
            </span>
            {quote.distanceKm} km
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-7 text-[--color-on-surface] mb-1">
          {quote.title}
        </h3>

        <p className="text-xs leading-4 text-[--color-on-surface-variant] mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
            schedule
          </span>
          Received {quote.receivedAgo}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold leading-5 text-[--color-on-surface-variant]">
            Est. Quote:
          </span>
          <span className="text-2xl font-bold leading-8 text-[--color-secondary] tracking-tight">
            ₺{quote.estimatedPrice.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full md:w-auto md:min-w-[200px] flex md:justify-end mt-2 md:mt-0">
        {quote.isPrimary ? (
          <button className="w-full md:w-auto bg-[--color-primary] text-[--color-on-primary] text-sm font-semibold h-12 rounded-full px-6 hover:opacity-90 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              call
            </span>
            İletişime Geç
          </button>
        ) : (
          <button className="w-full md:w-auto bg-transparent border border-[--color-primary] text-[--color-primary] text-sm font-semibold h-12 rounded-full px-6 hover:bg-[--color-primary]/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              chat
            </span>
            Mesaj Gönder
          </button>
        )}
      </div>
    </article>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  // ── Pricing state ──────────────────────────────────────────────────────────
  const [pricing, setPricing] = useState<PricingRules>({
    basePrice: 2000,
    motorizedExtra: 8500,
    ledExtra: 3200,
    glassExtra: 12000,
    maxDistanceKm: 100,
  });

  const handlePricingChange =
    (field: keyof PricingRules) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPricing((prev) => ({ ...prev, [field]: Number(e.target.value) }));
    };

  /**
   * Mock handler — Supabase'e kayıt yapılacaksa buraya ekle:
   *   await supabase.from("product_rules").upsert({ company_id, ...pricing })
   */
  const handleUpdatePricing = () => {
    console.log("[CompanyPage] Pricing rules updated:", pricing);
    // TODO: supabase.from("product_rules").upsert(...)
  };

  // ── Location state ─────────────────────────────────────────────────────────
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 41.0082,
    lon: 28.9784,
  });
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");

  const handlePickLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  // ── Quotes state ───────────────────────────────────────────────────────────
  const [quotes] = useState<QuoteRequest[]>(INITIAL_QUOTES);
  const newCount = quotes.filter((q) => q.isNew).length;

  // ── Bottom nav active tab ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "quotes" | "settings"
  >("dashboard");

  return (
    <div className="bg-[--color-background] text-[--color-on-background] min-h-screen pb-24 font-[--font-inter] antialiased md:bg-[--color-surface-container-low]">
      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky bg-[--color-surface] shadow-[0_2px_8px_rgba(0,52,65,0.03)] md:shadow-[0_4px_20px_rgba(0,52,65,0.05)] z-40 transition-shadow duration-300">
        <div className="flex justify-between items-center px-4 py-2 w-full max-w-[1280px] mx-auto md:px-6">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[--color-primary]"
              style={{
                fontVariationSettings: "'FILL' 1",
                fontSize: 28,
              }}
            >
              location_on
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[--color-primary] truncate max-w-[200px] md:max-w-none">
                Elite Pergola Design
              </h1>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="material-symbols-outlined text-emerald-500"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    fontSize: 14,
                  }}
                >
                  verified
                </span>
                <span className="text-xs leading-4 text-emerald-500 font-medium">
                  Approved / Onaylı Firmalara Özel
                </span>
              </div>
            </div>
          </div>

          <button
            aria-label="Profil"
            className="w-10 h-10 rounded-full overflow-hidden border border-[--color-outline-variant] bg-[--color-surface-variant] flex-shrink-0 active:scale-95 transition-transform hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2"
          >
            {/* Placeholder avatar */}
            <div className="w-full h-full bg-[--color-primary-container] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[--color-on-primary-container]"
                style={{ fontSize: 20 }}
              >
                person
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* ── Desktop Side Nav ───────────────────────────────────────────────── */}
      <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 w-16 bg-[--color-surface] flex-col items-center py-6 gap-8 shadow-[0_4px_20px_rgba(0,52,65,0.05)] rounded-r-xl border border-l-0 border-[--color-outline-variant]/30 z-50">
        {(
          [
            { tab: "dashboard", icon: "dashboard", label: "Dashboard" },
            { tab: "quotes", icon: "request_quote", label: "Quotes" },
            { tab: "settings", icon: "settings", label: "Settings" },
          ] as const
        ).map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all group relative ${
              activeTab === tab
                ? "bg-[--color-secondary-container] text-[--color-on-secondary-container] shadow-md"
                : "text-[--color-on-surface-variant] hover:bg-[--color-surface-variant]"
            }`}
            aria-label={label}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  activeTab === tab ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {icon}
            </span>
            <span className="absolute left-14 bg-[--color-surface] px-2 py-1 rounded shadow-md text-[--color-primary] text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-[--color-outline-variant]/20">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto w-full pt-3 px-4 md:px-6 md:pt-8 pb-[100px] md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
          {/* ── Left Column ──────────────────────────────────────────────── */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-3 md:gap-8">
            {/* Pricing Rules Card */}
            <section className="bg-[--color-surface] rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] p-6 border border-[--color-outline-variant]/30">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="material-symbols-outlined text-[--color-secondary]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  calculate
                </span>
                <h2 className="text-2xl font-semibold leading-8 text-[--color-primary]">
                  Otomatik Fiyat Motoru
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {/* Base Price */}
                <div className="flex flex-col">
                  <label
                    htmlFor="basePrice"
                    className="text-sm font-semibold leading-5 text-[--color-on-surface-variant] mb-1"
                  >
                    Base Price per m² (₺/m²)
                  </label>
                  <input
                    id="basePrice"
                    type="number"
                    min={0}
                    value={pricing.basePrice}
                    onChange={handlePricingChange("basePrice")}
                    className="w-full border border-slate-200 rounded-xl bg-white h-12 px-4 focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition-all text-[--color-on-surface] shadow-sm outline-none"
                  />
                </div>

                {/* Motorized Extra */}
                <div className="flex flex-col">
                  <label
                    htmlFor="motorizedExtra"
                    className="text-sm font-semibold leading-5 text-[--color-on-surface-variant] mb-1"
                  >
                    Motorized Roof Extra (₺)
                  </label>
                  <input
                    id="motorizedExtra"
                    type="number"
                    min={0}
                    value={pricing.motorizedExtra}
                    onChange={handlePricingChange("motorizedExtra")}
                    className="w-full border border-slate-200 rounded-xl bg-white h-12 px-4 focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition-all text-[--color-on-surface] shadow-sm outline-none"
                  />
                </div>

                {/* LED Extra */}
                <div className="flex flex-col">
                  <label
                    htmlFor="ledExtra"
                    className="text-sm font-semibold leading-5 text-[--color-on-surface-variant] mb-1"
                  >
                    LED Lighting Extra (₺)
                  </label>
                  <input
                    id="ledExtra"
                    type="number"
                    min={0}
                    value={pricing.ledExtra}
                    onChange={handlePricingChange("ledExtra")}
                    className="w-full border border-slate-200 rounded-xl bg-white h-12 px-4 focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition-all text-[--color-on-surface] shadow-sm outline-none"
                  />
                </div>

                {/* Glass Extra */}
                <div className="flex flex-col">
                  <label
                    htmlFor="glassExtra"
                    className="text-sm font-semibold leading-5 text-[--color-on-surface-variant] mb-1"
                  >
                    Glass/Zip Extra (₺)
                  </label>
                  <input
                    id="glassExtra"
                    type="number"
                    min={0}
                    value={pricing.glassExtra}
                    onChange={handlePricingChange("glassExtra")}
                    className="w-full border border-slate-200 rounded-xl bg-white h-12 px-4 focus:ring-2 focus:ring-[--color-primary] focus:border-[--color-primary] transition-all text-[--color-on-surface] shadow-sm outline-none"
                  />
                </div>

                {/* Distance Slider */}
                <div className="flex flex-col pt-2 pb-2">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="distanceSlider"
                      className="text-sm font-semibold leading-5 text-[--color-on-surface-variant]"
                    >
                      Max Service Distance
                    </label>
                    <span className="text-sm font-semibold leading-5 text-[--color-primary] bg-[--color-surface-container-low] px-2 py-0.5 rounded-full tabular-nums">
                      {pricing.maxDistanceKm} km
                    </span>
                  </div>
                  <input
                    id="distanceSlider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={pricing.maxDistanceKm}
                    onChange={handlePricingChange("maxDistanceKm")}
                    className="w-full h-2 bg-[--color-surface-variant] rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleUpdatePricing}
                  className="w-full bg-[--color-secondary] text-[--color-on-secondary] text-sm font-semibold h-12 rounded-full mt-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                >
                  Update Pricing Rules / Fiyatları Güncelle
                </button>
              </div>
            </section>

            {/* Location Card */}
            <section className="bg-[--color-surface] rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] p-6 border border-[--color-outline-variant]/30 relative overflow-hidden">
              {/* Dot-grid bg */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#0f4c5c 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[--color-surface-container-high] flex items-center justify-center mb-3 text-[--color-primary]">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: "'FILL' 1",
                      fontSize: 24,
                    }}
                  >
                    my_location
                  </span>
                </div>

                <h3 className="text-sm font-semibold leading-5 text-[--color-on-surface-variant] mb-1">
                  Current Service Origin
                </h3>

                <p className="font-mono text-[--color-primary] bg-[--color-surface-container] px-3 py-1 rounded-lg mb-3 shadow-sm border border-[--color-outline-variant]/20 text-sm tabular-nums">
                  {coords.lat.toFixed(4)}° N, {coords.lon.toFixed(4)}° E
                </p>

                {locationStatus === "denied" && (
                  <p className="text-xs text-[--color-error] mb-2">
                    Konum izni reddedildi — lütfen tarayıcı izinlerini kontrol
                    et.
                  </p>
                )}

                <button
                  onClick={handlePickLocation}
                  disabled={locationStatus === "loading"}
                  className="w-full bg-transparent border-2 border-[--color-primary] text-[--color-primary] text-sm font-semibold h-12 rounded-full hover:bg-[--color-primary]/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 20 }}
                  >
                    {locationStatus === "granted" ? "check_circle" : "map"}
                  </span>
                  {locationStatus === "loading"
                    ? "Konum alınıyor…"
                    : locationStatus === "granted"
                    ? "Konum güncellendi ✓"
                    : "Pick Location on Map"}
                </button>
              </div>
            </section>
          </div>

          {/* ── Right Column (Quotes) ─────────────────────────────────────── */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col">
            <section className="flex flex-col gap-3 w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[--color-primary]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    forum
                  </span>
                  <h2 className="text-2xl font-semibold leading-8 text-[--color-primary]">
                    Gelen Talepler
                  </h2>
                </div>
                {newCount > 0 && (
                  <span className="bg-[--color-error] text-[--color-on-error] text-xs font-semibold px-2 py-0.5 rounded-full">
                    {newCount} New
                  </span>
                )}
              </div>

              {/* Quote cards */}
              {quotes.map((q) => (
                <QuoteCard key={q.id} quote={q} />
              ))}

              {/* Empty state */}
              <div className="w-full py-8 flex flex-col items-center justify-center opacity-50 mt-4 border-2 border-dashed border-[--color-outline-variant] rounded-xl bg-[--color-surface-container-low]/50">
                <span
                  className="material-symbols-outlined mb-2 text-[--color-outline]"
                  style={{ fontSize: 32 }}
                >
                  inbox
                </span>
                <p className="text-sm font-semibold leading-5 text-[--color-outline]">
                  No more incoming requests
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[--color-surface] shadow-[0_-4px_20px_rgba(0,52,65,0.05)] md:hidden rounded-t-2xl">
        {(
          [
            { tab: "dashboard", icon: "dashboard", label: "Dashboard" },
            { tab: "quotes", icon: "request_quote", label: "Quotes" },
            { tab: "settings", icon: "settings", label: "Settings" },
          ] as const
        ).map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 px-4 py-1.5 rounded-full ${
              activeTab === tab
                ? "bg-[--color-secondary-container] text-[--color-on-secondary-container]"
                : "text-[--color-on-surface-variant] hover:text-[--color-primary]"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  activeTab === tab ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {icon}
            </span>
            <span className="text-[10px] font-semibold mt-0.5">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
