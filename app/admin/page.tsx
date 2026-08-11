"use client";

import { useState, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type CompanyStatus = "approved" | "pending" | "suspended";

interface Company {
  id: string;
  name: string;
  phone: string;
  status: CompanyStatus;
  lat: number | null;
  lon: number | null;
  addedAt: string;
}

// ─── Mock initial companies ────────────────────────────────────────────────────
const INITIAL_COMPANIES: Company[] = [
  {
    id: "c1",
    name: "Elite Pergola Design",
    phone: "+90 532 111 1111",
    status: "approved",
    lat: 41.0082,
    lon: 28.9784,
    addedAt: "2024-03-01",
  },
  {
    id: "c2",
    name: "Modern Outdoor Solutions",
    phone: "+90 532 222 2222",
    status: "approved",
    lat: 41.032,
    lon: 29.01,
    addedAt: "2024-03-05",
  },
  {
    id: "c3",
    name: "Skyline Pergola Systems",
    phone: "+90 532 333 3333",
    status: "pending",
    lat: null,
    lon: null,
    addedAt: "2024-04-10",
  },
];

const TOTAL_QUOTES_MOCK = 1420;

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CompanyStatus }) {
  const cfg = {
    approved: {
      icon: "check_circle",
      label: "Onaylı",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    pending: {
      icon: "schedule",
      label: "Bekliyor",
      cls: "bg-secondary-fixed text-secondary border-secondary/20",
    },
    suspended: {
      icon: "block",
      label: "Askıda",
      cls: "bg-error/10 text-error border-error/20",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}
      >
        {cfg.icon}
      </span>
      {cfg.label}
    </span>
  );
}

// ─── Company Row ────────────────────────────────────────────────────────────────
function CompanyRow({
  company,
  onApprove,
  onSuspend,
}: {
  company: Company;
  onApprove: (id: string) => void;
  onSuspend: (id: string) => void;
}) {
  const isPending = company.status === "pending";
  const isSuspended = company.status === "suspended";
  const isApproved = company.status === "approved";

  return (
    <div
      className={`bg-surface p-4 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border transition-all ${
        isPending
          ? "border-l-4 border-l-secondary-container border-outline-variant/40"
          : isSuspended
          ? "border-l-4 border-l-error border-outline-variant/30 opacity-70"
          : "border-outline-variant/30"
      }`}
    >
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="font-bold text-on-surface truncate">{company.name}</h3>
        <p className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            phone
          </span>
          {company.phone}
          {company.lat && (
            <>
              <span className="mx-1 text-outline">•</span>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                location_on
              </span>
              <span className="tabular-nums">
                {company.lat.toFixed(2)}, {company.lon?.toFixed(2)}
              </span>
            </>
          )}
        </p>
        <StatusBadge status={company.status} />
      </div>

      <div className="flex gap-2 w-full md:w-auto shrink-0">
        {(isPending || isSuspended) && (
          <button
            onClick={() => onApprove(company.id)}
            className="flex-1 md:flex-none px-4 py-2 bg-secondary-container text-on-secondary text-sm font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            Onayla
          </button>
        )}

        <button className="flex-1 md:flex-none px-4 py-2 border border-primary-container text-primary-container text-sm font-semibold rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            edit
          </span>
          Düzenle
        </button>

        {isApproved && (
          <button
            onClick={() => onSuspend(company.id)}
            className="flex-1 md:flex-none px-4 py-2 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-xl hover:bg-error-container hover:text-on-error-container hover:border-error-container transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              pause_circle
            </span>
            Askıya Al
          </button>
        )}
      </div>
    </div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-surface p-5 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border flex flex-col gap-2 ${
        accent
          ? "border-l-4 border-l-secondary-container border-outline-variant/30"
          : "border-outline-variant/30"
      }`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-on-surface-variant">{label}</p>
        <span
          className={`material-symbols-outlined ${
            accent ? "text-secondary-container" : "text-primary-container"
          }`}
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 22 }}
        >
          {icon}
        </span>
      </div>
      <p
        className={`text-2xl font-bold tabular-nums ${
          accent ? "text-secondary-container" : "text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  // ── Company list ───────────────────────────────────────────────────────────
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [totalQuotes] = useState(TOTAL_QUOTES_MOCK);

  // ── Derived KPIs ───────────────────────────────────────────────────────────
  const activeCount = useMemo(
    () => companies.filter((c) => c.status === "approved").length,
    [companies]
  );
  const pendingCount = useMemo(
    () => companies.filter((c) => c.status === "pending").length,
    [companies]
  );

  // ── Status handlers ────────────────────────────────────────────────────────
  const handleApprove = (id: string) =>
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );

  const handleSuspend = (id: string) =>
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "suspended" } : c))
    );

  // ── Add Company form ───────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    phone: "",
    lat: "",
    lng: "",
  });
  const [formError, setFormError] = useState("");

  const setField =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setFormError("");
    };

  const handleAddCompany = () => {
    if (!form.name.trim()) {
      setFormError("Firma adı zorunludur.");
      return;
    }
    const newCompany: Company = {
      id: `c-${Date.now()}`,
      name: form.name.trim(),
      phone: form.phone.trim() || "—",
      status: "pending",
      lat: form.lat ? parseFloat(form.lat) : null,
      lon: form.lng ? parseFloat(form.lng) : null,
      addedAt: new Date().toISOString().split("T")[0],
    };
    setCompanies((prev) => [...prev, newCompany]);
    setForm({ name: "", phone: "", lat: "", lng: "" });
    console.log("[AdminPage] Firma eklendi:", newCompany);
    // TODO: supabase.from("companies").insert(newCompany)
  };

  // ── Search / filter ────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const filteredCompanies = useMemo(
    () =>
      companies.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [companies, search]
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background min-h-screen pb-28">

      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky bg-surface shadow-sm z-40">
        <div className="flex justify-between items-center px-4 py-2.5 w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              shield_person
            </span>
            <div>
              <h1 className="text-xl font-bold text-primary leading-tight">
                PergolaPazarı
              </h1>
              <span className="text-xs font-semibold text-secondary-container">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Bildirimler"
              className="relative hover:opacity-80 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error rounded-full text-[9px] font-bold text-on-error flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-surface-variant"
                style={{ fontSize: 20 }}
              >
                manage_accounts
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1280px] mx-auto px-4 py-6 flex flex-col gap-6">

        {/* ── KPI Bento Grid ───────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            label="Aktif Firma"
            value={`${activeCount} Onaylı`}
            icon="store"
          />
          <KpiCard
            label="Onay Bekleyen"
            value={`${pendingCount} Bekliyor`}
            icon="pending_actions"
            accent
          />
          <KpiCard
            label="Toplam Teklif"
            value={`${totalQuotes.toLocaleString("tr-TR")} Talep`}
            icon="request_quote"
          />
        </section>

        {/* ── Add Company Form ─────────────────────────────────────────────── */}
        <section className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant/30 p-5">
          <h2 className="text-lg font-bold text-primary border-b border-surface-container pb-2.5 mb-4">
            Yeni Firma Ekle
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Company Name */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                htmlFor="cName"
                className="text-xs font-semibold text-on-surface-variant"
              >
                Firma Adı *
              </label>
              <input
                id="cName"
                type="text"
                placeholder="Firma adı girin"
                value={form.name}
                onChange={setField("name")}
                className="w-full border border-outline-variant rounded-xl bg-white h-11 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm"
              />
              {formError && (
                <p className="text-xs text-error mt-0.5">{formError}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cPhone"
                className="text-xs font-semibold text-on-surface-variant"
              >
                Yetkili Telefonu
              </label>
              <input
                id="cPhone"
                type="tel"
                placeholder="+90 555 555 5555"
                value={form.phone}
                onChange={setField("phone")}
                className="w-full border border-outline-variant rounded-xl bg-white h-11 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm"
              />
            </div>

            {/* Lat + Lng */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="cLat"
                  className="text-xs font-semibold text-on-surface-variant"
                >
                  Enlem
                </label>
                <input
                  id="cLat"
                  type="text"
                  placeholder="41.0082"
                  value={form.lat}
                  onChange={setField("lat")}
                  className="w-full border border-outline-variant rounded-xl bg-white h-11 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm tabular-nums"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="cLng"
                  className="text-xs font-semibold text-on-surface-variant"
                >
                  Boylam
                </label>
                <input
                  id="cLng"
                  type="text"
                  placeholder="28.9784"
                  value={form.lng}
                  onChange={setField("lng")}
                  className="w-full border border-outline-variant rounded-xl bg-white h-11 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm tabular-nums"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleAddCompany}
                disabled={!form.name.trim()}
                className="w-full bg-secondary-container text-on-secondary h-11 rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  add_circle
                </span>
                Firma Ekle &amp; Sisteme Al
              </button>
            </div>
          </div>
        </section>

        {/* ── Vendor Management ────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-primary">
              Firma Yönetimi
            </h2>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                style={{ fontSize: 18 }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Firma ara…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 h-10 border border-outline-variant rounded-xl bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
              />
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-2">
            {filteredCompanies.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 border-2 border-dashed border-outline-variant/40 rounded-2xl opacity-60">
                <span
                  className="material-symbols-outlined text-outline"
                  style={{ fontSize: 36 }}
                >
                  search_off
                </span>
                <p className="text-sm font-semibold text-outline">
                  Eşleşen firma bulunamadı
                </p>
              </div>
            ) : (
              filteredCompanies.map((c) => (
                <CompanyRow
                  key={c.id}
                  company={c}
                  onApprove={handleApprove}
                  onSuspend={handleSuspend}
                />
              ))
            )}
          </div>

          {/* Summary footer */}
          <p className="text-xs text-on-surface-variant text-right mt-1">
            {activeCount} onaylı · {pendingCount} bekleyen ·{" "}
            {companies.filter((c) => c.status === "suspended").length} askıda
          </p>
        </section>
      </main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,52,65,0.05)] rounded-t-xl">
        <button className="flex flex-col items-center gap-0.5 text-on-surface-variant px-4 py-1.5 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            search
          </span>
          <span className="text-[10px] font-semibold">Ara</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-on-surface-variant px-4 py-1.5 rounded-full hover:bg-surface-container-high active:scale-95 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            request_quote
          </span>
          <span className="text-[10px] font-semibold">Teklifler</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full active:scale-95 transition-all">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className="text-[10px] font-semibold">Profil</span>
        </button>
      </nav>
    </div>
  );
}
