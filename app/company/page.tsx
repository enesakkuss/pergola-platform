"use client";

import { useState, useCallback, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type QuoteStatus = "new" | "contacted" | "messaged" | "declined";

interface Quote {
  id: string;
  title: string;
  features: string[];
  distanceKm: number;
  estimatedPrice: number;
  receivedAgo: string;
  status: QuoteStatus;
}

interface Coords { lat: number; lon: number }

// ─── Mock Quotes ───────────────────────────────────────────────────────────────
const INITIAL_QUOTES: Quote[] = [
  {
    id: "q1",
    title: "20 m² Custom Pergola",
    features: ["Motorized", "LED"],
    distanceKm: 12,
    estimatedPrice: 48_000,
    receivedAgo: "2 saat önce",
    status: "new",
  },
  {
    id: "q2",
    title: "15 m² Standard Build",
    features: ["Zip Screen"],
    distanceKm: 5,
    estimatedPrice: 32_500,
    receivedAgo: "5 saat önce",
    status: "new",
  },
  {
    id: "q3",
    title: "25 m² Premium Pergola",
    features: ["Motorized", "LED", "Zip Screen"],
    distanceKm: 18,
    estimatedPrice: 74_200,
    receivedAgo: "1 gün önce",
    status: "new",
  },
];

// ─── Status helpers ────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<QuoteStatus, string> = {
  new: "Yeni",
  contacted: "İletişime Geçildi ✓",
  messaged: "Mesaj Gönderildi ✓",
  declined: "Reddedildi",
};
const STATUS_COLOR: Record<QuoteStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-green-100 text-green-700",
  messaged: "bg-blue-100 text-blue-700",
  declined: "bg-error/10 text-error",
};

// ─── Quote Card ────────────────────────────────────────────────────────────────
function QuoteCard({
  quote,
  onContact,
  onMessage,
}: {
  quote: Quote;
  onContact: (id: string) => void;
  onMessage: (id: string) => void;
}) {
  const isNew = quote.status === "new";

  return (
    <article
      className={`bg-surface rounded-xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,52,65,0.05)] hover:shadow-[0_8px_30px_rgba(0,52,65,0.10)] transition-shadow duration-300 relative overflow-hidden group ${
        isNew
          ? "border-outline-variant/30"
          : "border-outline-variant/20 opacity-80"
      }`}
    >
      {/* Accent bar — always visible for new, hover for rest */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-secondary transition-opacity duration-300 ${
          isNew ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        }`}
      />

      <div className="flex-1 pl-2">
        {/* Feature + distance chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {quote.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold"
            >
              {f}
            </span>
          ))}
          <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
              route
            </span>
            {quote.distanceKm} km
          </span>
          {/* Status badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[quote.status]}`}>
            {STATUS_LABEL[quote.status]}
          </span>
        </div>

        <h3 className="font-semibold text-on-surface mb-1">{quote.title}</h3>

        <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            schedule
          </span>
          {quote.receivedAgo}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">Tahmini:</span>
          <span className="text-xl font-bold text-secondary tracking-tight tabular-nums">
            ₺{quote.estimatedPrice.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:min-w-[180px]">
        <button
          onClick={() => onContact(quote.id)}
          disabled={quote.status !== "new"}
          className="flex-1 bg-primary text-on-primary text-sm font-semibold h-11 rounded-full px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            call
          </span>
          İletişime Geç
        </button>
        <button
          onClick={() => onMessage(quote.id)}
          disabled={quote.status !== "new"}
          className="flex-1 bg-transparent border border-primary text-primary text-sm font-semibold h-11 rounded-full px-4 hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            chat
          </span>
          Mesaj Gönder
        </button>
      </div>
    </article>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-on-surface text-surface text-sm font-semibold px-5 py-3 rounded-full shadow-lg animate-[fadeInUp_0.3s_ease]">
      <span
        className="material-symbols-outlined text-green-400"
        style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
      >
        check_circle
      </span>
      {message}
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          close
        </span>
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  // ── Pricing ────────────────────────────────────────────────────────────────
  const [basePrice, setBasePrice] = useState(2000);
  const [motorizedExtra, setMotorizedExtra] = useState(8500);
  const [ledExtra, setLedExtra] = useState(3200);
  const [glassExtra, setGlassExtra] = useState(12000);
  const [maxDistance, setMaxDistance] = useState(100);
  const [pricingSaved, setPricingSaved] = useState(false);

  const handleUpdatePricing = () => {
    console.log("[CompanyPage] Pricing rules →", {
      basePrice,
      motorizedExtra,
      ledExtra,
      glassExtra,
      maxDistance,
    });
    // TODO: supabase.from("product_rules").upsert(...)
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 3000);
  };

  // ── Location ───────────────────────────────────────────────────────────────
  const [coords, setCoords] = useState<Coords>({ lat: 41.0082, lon: 28.9784 });
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

  // ── Quotes ─────────────────────────────────────────────────────────────────
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [toast, setToast] = useState<string | null>(null);

  const newCount = useMemo(
    () => quotes.filter((q) => q.status === "new").length,
    [quotes]
  );

  const updateQuoteStatus = (id: string, status: QuoteStatus, msg: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ── Nav tab ────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"dashboard" | "quotes" | "settings">(
    "dashboard"
  );

  return (
    <div className="bg-background text-on-background min-h-screen pb-28 md:bg-surface-container-low">
      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky bg-surface shadow-[0_2px_8px_rgba(0,52,65,0.04)] z-40">
        <div className="flex justify-between items-center px-4 py-2.5 w-full max-w-[1280px] mx-auto md:px-6">
          <div className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 26 }}
            >
              location_on
            </span>
            <div>
              <h1 className="text-xl font-bold text-primary leading-tight">
                Elite Pergola Design
              </h1>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-emerald-500"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 13 }}
                >
                  verified
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Onaylı Firma
                </span>
              </div>
            </div>
          </div>

          <button
            aria-label="Profil"
            className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center hover:opacity-90 active:scale-95 transition-transform"
          >
            <span
              className="material-symbols-outlined text-on-primary-container"
              style={{ fontSize: 20 }}
            >
              person
            </span>
          </button>
        </div>
      </header>

      {/* ── Desktop Side Nav ───────────────────────────────────────────────── */}
      <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 w-14 bg-surface flex-col items-center py-6 gap-6 shadow-[0_4px_20px_rgba(0,52,65,0.06)] rounded-r-xl border-r border-outline-variant/20 z-50">
        {(
          [
            { tab: "dashboard", icon: "dashboard" },
            { tab: "quotes", icon: "request_quote" },
            { tab: "settings", icon: "settings" },
          ] as const
        ).map(({ tab, icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              activeTab === tab
                ? "bg-secondary-container text-on-secondary-container shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings:
                  activeTab === tab ? "'FILL' 1" : "'FILL' 0",
                fontSize: 20,
              }}
            >
              {icon}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto w-full pt-4 px-4 md:px-6 md:pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">

          {/* ── Left Column ──────────────────────────────────────────────── */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4 md:gap-5">

            {/* Pricing Card */}
            <section className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,52,65,0.06)] p-5 border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
                >
                  calculate
                </span>
                <h2 className="text-lg font-bold text-primary">
                  Otomatik Fiyat Motoru
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {/* Base Price */}
                {[
                  { id: "basePrice", label: "Base Price per m² (₺/m²)", value: basePrice, set: setBasePrice },
                  { id: "motorized", label: "Motorized Roof Extra (₺)", value: motorizedExtra, set: setMotorizedExtra },
                  { id: "led", label: "LED Lighting Extra (₺)", value: ledExtra, set: setLedExtra },
                  { id: "glass", label: "Glass/Zip Extra (₺)", value: glassExtra, set: setGlassExtra },
                ].map(({ id, label, value, set }) => (
                  <div key={id} className="flex flex-col gap-1">
                    <label
                      htmlFor={id}
                      className="text-xs font-semibold text-on-surface-variant"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold text-sm">
                        ₺
                      </span>
                      <input
                        id={id}
                        type="number"
                        min={0}
                        value={value}
                        onChange={(e) => set(Number(e.target.value))}
                        className="w-full border border-outline-variant rounded-xl bg-white h-11 pl-7 pr-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-on-surface text-sm shadow-sm outline-none tabular-nums"
                      />
                    </div>
                  </div>
                ))}

                {/* Distance Slider */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between">
                    <label
                      htmlFor="distSlider"
                      className="text-xs font-semibold text-on-surface-variant"
                    >
                      Max Service Distance
                    </label>
                    <span className="text-xs font-bold text-primary bg-surface-container-low px-2 py-0.5 rounded-full tabular-nums">
                      {maxDistance} km
                    </span>
                  </div>
                  <input
                    id="distSlider"
                    type="range"
                    min={0}
                    max={200}
                    step={5}
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-surface-variant rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant">
                    <span>0 km</span>
                    <span>200 km</span>
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="button"
                  onClick={handleUpdatePricing}
                  className={`w-full h-11 rounded-full mt-1 font-semibold text-sm transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 ${
                    pricingSaved
                      ? "bg-green-500 text-white"
                      : "bg-secondary text-on-secondary hover:opacity-90"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 18,
                      fontVariationSettings: pricingSaved ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {pricingSaved ? "check_circle" : "save"}
                  </span>
                  {pricingSaved
                    ? "Kaydedildi!"
                    : "Update Pricing Rules / Güncelle"}
                </button>
              </div>
            </section>

            {/* Location Card */}
            <section className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,52,65,0.06)] p-5 border border-outline-variant/30 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(#0f4c5c 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
                  >
                    my_location
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-on-surface-variant mb-1">
                    Hizmet Çıkış Noktası
                  </p>
                  <p className="font-mono text-sm text-primary bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20 tabular-nums">
                    {coords.lat.toFixed(4)}° N,{" "}
                    {coords.lon.toFixed(4)}° E
                  </p>
                </div>

                {locationStatus === "denied" && (
                  <p className="text-xs text-error bg-error/5 px-3 py-2 rounded-lg">
                    Konum izni reddedildi. Tarayıcı izinlerini kontrol edin.
                  </p>
                )}

                <button
                  onClick={handlePickLocation}
                  disabled={locationStatus === "loading"}
                  className={`w-full h-11 rounded-full font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 ${
                    locationStatus === "granted"
                      ? "bg-green-50 border-2 border-green-500 text-green-700"
                      : "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    {locationStatus === "loading"
                      ? "autorenew"
                      : locationStatus === "granted"
                      ? "check_circle"
                      : "map"}
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
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
                >
                  forum
                </span>
                <h2 className="text-lg font-bold text-primary">
                  Gelen Talepler
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {newCount > 0 && (
                  <span className="bg-error text-on-error text-xs font-bold px-2 py-0.5 rounded-full">
                    {newCount} Yeni
                  </span>
                )}
                <span className="text-xs text-on-surface-variant">
                  {quotes.length} toplam
                </span>
              </div>
            </div>

            {/* Quote cards */}
            <div className="flex flex-col gap-3">
              {quotes.map((q) => (
                <QuoteCard
                  key={q.id}
                  quote={q}
                  onContact={(id) =>
                    updateQuoteStatus(
                      id,
                      "contacted",
                      "İletişime geçildi — müşteri bildirildi"
                    )
                  }
                  onMessage={(id) =>
                    updateQuoteStatus(
                      id,
                      "messaged",
                      "Mesaj gönderildi — müşteri bildirildi"
                    )
                  }
                />
              ))}
            </div>

            {/* Empty / all handled */}
            {newCount === 0 && (
              <div className="w-full py-10 flex flex-col items-center gap-2 border-2 border-dashed border-outline-variant/40 rounded-2xl opacity-60 mt-2">
                <span
                  className="material-symbols-outlined text-outline"
                  style={{ fontSize: 36 }}
                >
                  inbox
                </span>
                <p className="text-sm font-semibold text-outline">
                  Tüm talepler yanıtlandı
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,52,65,0.05)] md:hidden rounded-t-2xl">
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
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full transition-all active:scale-95 ${
              activeTab === tab
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 22,
                fontVariationSettings:
                  activeTab === tab ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {icon}
            </span>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
