"use client";

import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type CompanyStatus = "approved" | "pending" | "suspended";

interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  lat: number | null;
  lon: number | null;
  phone: string;
}

// ─── Initial mock data ─────────────────────────────────────────────────────────
const INITIAL_COMPANIES: Company[] = [
  {
    id: "c1",
    name: "Elite Pergola Design",
    status: "approved",
    lat: 41.0082,
    lon: 28.9784,
    phone: "+90 532 111 1111",
  },
  {
    id: "c2",
    name: "Modern Outdoor Solutions",
    status: "approved",
    lat: 41.032,
    lon: 29.01,
    phone: "+90 532 222 2222",
  },
  {
    id: "c3",
    name: "Skyline Pergola Systems",
    status: "pending",
    lat: null,
    lon: null,
    phone: "+90 532 333 3333",
  },
];

const INITIAL_TOTAL_QUOTES = 1420;

// ─── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CompanyStatus }) {
  if (status === "approved")
    return (
      <div className="inline-flex items-center gap-1 bg-surface-dim/30 text-primary-container px-2 py-1 rounded-full w-max">
        <span
          className="material-symbols-outlined text-base"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}
        >
          check_circle
        </span>
        <span className="text-xs leading-4">Approved</span>
      </div>
    );

  if (status === "pending")
    return (
      <div className="inline-flex items-center gap-1 bg-secondary-fixed-dim/30 text-secondary-container px-2 py-1 rounded-full w-max">
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}
        >
          schedule
        </span>
        <span className="text-xs leading-4">Pending</span>
      </div>
    );

  return (
    <div className="inline-flex items-center gap-1 bg-error-container/40 text-error px-2 py-1 rounded-full w-max">
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: "'FILL' 1", fontSize: 16 }}
      >
        block
      </span>
      <span className="text-xs leading-4">Suspended</span>
    </div>
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

  return (
    <div
      className={`bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
        isPending
          ? "border-l-4 border-l-secondary-container border-secondary-container"
          : isSuspended
          ? "border-l-4 border-l-error border-outline-variant opacity-70"
          : "border-outline-variant"
      }`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold leading-7 text-on-surface">
          {company.name}
        </h3>
        <StatusBadge status={company.status} />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        {/* Approve — shown for pending or suspended */}
        {(isPending || isSuspended) && (
          <button
            onClick={() => onApprove(company.id)}
            className="flex-1 md:flex-none px-4 py-2 bg-secondary-container text-on-secondary rounded-2xl text-sm font-semibold leading-5 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          >
            Approve
          </button>
        )}

        {/* Edit — always shown */}
        <button className="flex-1 md:flex-none px-4 py-2 border border-primary-container text-primary-container rounded-2xl text-sm font-semibold leading-5 hover:bg-surface-container transition-colors">
          Edit
        </button>

        {/* Suspend — shown for approved only */}
        {company.status === "approved" && (
          <button
            onClick={() => onSuspend(company.id)}
            className="flex-1 md:flex-none px-4 py-2 border border-outline-variant text-on-surface-variant rounded-2xl text-sm font-semibold leading-5 hover:bg-error-container hover:text-on-error-container hover:border-error-container transition-colors"
          >
            Suspend
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  // ── Company list state ─────────────────────────────────────────────────────
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [totalQuotes] = useState<number>(INITIAL_TOTAL_QUOTES);

  // ── Derived KPI metrics ────────────────────────────────────────────────────
  const activeCount = companies.filter((c) => c.status === "approved").length;
  const pendingCount = companies.filter((c) => c.status === "pending").length;

  // ── Status handlers ────────────────────────────────────────────────────────
  const handleApprove = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
    );
  };

  const handleSuspend = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "suspended" } : c))
    );
  };

  // ── Add Company form state ─────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const handleFormChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleAddCompany = () => {
    const trimmed = form.name.trim();
    if (!trimmed) return;

    const newCompany: Company = {
      id: `c-${Date.now()}`,
      name: trimmed,
      status: "pending",
      phone: form.phone.trim(),
      lat: form.latitude ? parseFloat(form.latitude) : null,
      lon: form.longitude ? parseFloat(form.longitude) : null,
    };

    setCompanies((prev) => [...prev, newCompany]);

    // Reset form
    setForm({ name: "", phone: "", latitude: "", longitude: "" });

    console.log("[AdminPage] New company added:", newCompany);
    // TODO: supabase.from("companies").insert(newCompany)
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background pb-32 font-inter">
      {/* ── TopAppBar ──────────────────────────────────────────────────────── */}
      <header className="w-full top-0 sticky shadow-sm bg-surface z-40">
        <div className="flex justify-between items-center px-4 py-2 w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              shield_person
            </span>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                PergolaPazarı
              </h1>
              <span className="text-sm font-semibold leading-5 text-secondary-container">
                Super Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label="Bildirimler"
              className="relative hover:opacity-90 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-on-surface-variant">
                notifications
              </span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-surface-variant"
                style={{ fontSize: 24 }}
              >
                manage_accounts
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="w-full max-w-[1280px] mx-auto px-4 py-8 flex flex-col gap-8">
        {/* ── KPI Bento Grid ───────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Active Companies */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h2 className="text-base leading-6 text-on-surface-variant">
                Total Companies
              </h2>
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                store
              </span>
            </div>
            <p className="text-2xl font-semibold leading-8 text-primary tabular-nums">
              {activeCount} Active
            </p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant border-l-4 border-l-secondary-container flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h2 className="text-base leading-6 text-on-surface-variant">
                Pending Approvals
              </h2>
              <span
                className="material-symbols-outlined text-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pending_actions
              </span>
            </div>
            <p className="text-2xl font-semibold leading-8 text-secondary-container tabular-nums">
              {pendingCount} Waiting
            </p>
          </div>

          {/* Total Quotes */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h2 className="text-base leading-6 text-on-surface-variant">
                Total Quotes
              </h2>
              <span
                className="material-symbols-outlined text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                request_quote
              </span>
            </div>
            <p className="text-2xl font-semibold leading-8 text-primary tabular-nums">
              {totalQuotes.toLocaleString("tr-TR")} Requests
            </p>
          </div>
        </section>

        {/* ── Add Company Form ─────────────────────────────────────────────── */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,52,65,0.05)] border border-outline-variant p-6 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold leading-8 text-primary border-b border-surface-container pb-2">
            Add New Company
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Company Name */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                htmlFor="companyName"
                className="text-sm font-semibold leading-5 text-on-surface"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                value={form.name}
                onChange={handleFormChange("name")}
                className="w-full border border-outline-variant rounded-2xl bg-surface-container-lowest p-3 focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none text-on-surface"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-semibold leading-5 text-on-surface"
              >
                Authorized Contact Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+90 555 555 5555"
                value={form.phone}
                onChange={handleFormChange("phone")}
                className="w-full border border-outline-variant rounded-2xl bg-surface-container-lowest p-3 focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none text-on-surface"
              />
            </div>

            {/* Lat + Lon */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="latitude"
                  className="text-sm font-semibold leading-5 text-on-surface"
                >
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="text"
                  placeholder="e.g. 41.0082"
                  value={form.latitude}
                  onChange={handleFormChange("latitude")}
                  className="w-full border border-outline-variant rounded-2xl bg-surface-container-lowest p-3 focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="longitude"
                  className="text-sm font-semibold leading-5 text-on-surface"
                >
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="text"
                  placeholder="e.g. 28.9784"
                  value={form.longitude}
                  onChange={handleFormChange("longitude")}
                  className="w-full border border-outline-variant rounded-2xl bg-surface-container-lowest p-3 focus:border-primary-container focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none text-on-surface"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 pt-2">
              <button
                type="button"
                onClick={handleAddCompany}
                disabled={!form.name.trim()}
                className="w-full bg-secondary-container text-on-secondary hover:opacity-90 active:scale-[0.98] transition-all rounded-2xl py-3 px-6 text-sm font-semibold leading-5 flex items-center justify-center gap-2 min-h-[48px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Add &amp; Onboard Company / Firma Ekle
              </button>
            </div>
          </div>
        </section>

        {/* ── Vendor Management List ───────────────────────────────────────── */}
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold leading-8 text-primary">
            Vendor Management
          </h2>

          <div className="flex flex-col gap-1">
            {companies.map((company) => (
              <CompanyRow
                key={company.id}
                company={company}
                onApprove={handleApprove}
                onSuspend={handleSuspend}
              />
            ))}
          </div>

          {companies.length === 0 && (
            <div className="w-full py-12 flex flex-col items-center justify-center opacity-50 border-2 border-dashed border-outline-variant rounded-xl">
              <span
                className="material-symbols-outlined mb-2 text-outline"
                style={{ fontSize: 32 }}
              >
                store
              </span>
              <p className="text-sm font-semibold leading-5 text-outline">
                Henüz firma eklenmedi
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface shadow-[0_-4px_20px_rgba(0,52,65,0.05)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200 px-3 py-1 rounded-full">
          <span className="material-symbols-outlined">search</span>
          <span className="text-sm font-semibold leading-5">Search</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-200 px-3 py-1 rounded-full">
          <span className="material-symbols-outlined">request_quote</span>
          <span className="text-sm font-semibold leading-5">Quotes</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 hover:opacity-90 transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm font-semibold leading-5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
