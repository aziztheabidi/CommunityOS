"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProperties, type PropertyRow } from "@/lib/api";

const statusStyles: Record<string, string> = {
  occupied: "bg-emerald-100 text-emerald-800",
  vacant: "bg-amber-100 text-amber-900",
  under_construction: "bg-sky-100 text-sky-900",
  unknown: "bg-stone-100 text-stone-700",
};

export default function PropertiesPage() {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProperties(undefined, { q: q || undefined, status: status || undefined })
      .then((response) => {
        if (!cancelled) {
          setRows(response.data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, status]);

  const counts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.status] = (acc[row.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [rows]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Properties</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Property register</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Structured property records linked to sectors and blocks for{" "}
          Jaffar-e-Tayyar Society.
        </p>
      </header>

      <div className="cos-card flex flex-wrap items-center gap-3 p-4">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search label or address…"
          className="min-w-[220px] flex-1 rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cos-teal)]/30"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="occupied">Occupied</option>
          <option value="vacant">Vacant</option>
          <option value="under_construction">Under construction</option>
        </select>
        <div className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
          {Object.entries(counts)
            .map(([key, value]) => `${value} ${key.replaceAll("_", " ")}`)
            .join(" · ") || "No matches"}
        </div>
      </div>

      <div className="cos-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--cos-sand)]/80 text-xs uppercase tracking-wide text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--cos-ink)]/50">
                    Loading properties…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--cos-danger)]">
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--cos-ink)]/50">
                    No properties match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--cos-border)] hover:bg-white/60">
                    <td className="px-4 py-3 font-semibold text-ink">{row.label}</td>
                    <td className="px-4 py-3 text-[color-mix(in_oklab,var(--cos-ink)_75%,transparent)]">
                      {row.addressLine}
                    </td>
                    <td className="px-4 py-3 capitalize">{row.propertyType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`cos-pill capitalize ${statusStyles[row.status] ?? statusStyles.unknown}`}
                      >
                        {row.status.replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
