"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchBusinessCategories,
  fetchBusinesses,
  type BusinessCategory,
  type BusinessRow,
} from "@/lib/api";

export default function BusinessesPage() {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [rows, setRows] = useState<BusinessRow[]>([]);
  const [categoryKey, setCategoryKey] = useState("");
  const [hiring, setHiring] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState("");

  useEffect(() => {
    fetchBusinessCategories()
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBusinesses(undefined, {
      categoryKey: categoryKey || undefined,
      hiring: hiring || undefined,
      q: q || undefined,
    })
      .then((response) => {
        if (!cancelled) {
          setRows(response.data);
          setSource(response.source ?? "");
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
  }, [categoryKey, hiring, q]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Businesses</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Local economy</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Resident-owned shops, clinics, and services—discoverable by category, hiring status, and
          society location.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryKey("")}
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
            !categoryKey
              ? "bg-[var(--cos-teal)] text-white"
              : "border border-[var(--cos-border)] bg-white/80 text-ink"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryKey(category.key)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              categoryKey === category.key
                ? "bg-[var(--cos-teal)] text-white"
                : "border border-[var(--cos-border)] bg-white/80 text-ink"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="cos-card flex flex-wrap items-center gap-3 p-4">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search businesses or services…"
          className="min-w-[220px] flex-1 rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cos-teal)]/30"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hiring} onChange={(e) => setHiring(e.target.checked)} />
          Hiring now
        </label>
        <span className="text-xs text-[var(--cos-ink)]/55">
          {rows.length} businesses{source ? ` · ${source}` : ""}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading businesses…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            No businesses match.
          </div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                    {row.categoryLabel}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ink">{row.name}</h2>
                  <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
                    {row.summary}
                  </p>
                </div>
                <span className="cos-pill capitalize bg-[var(--cos-sand)] text-teal">
                  {row.verification}
                </span>
              </div>
              <p className="mt-3 text-xs text-[var(--cos-ink)]/55">
                {[row.geoAreaName, row.addressLine].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {row.isResidentOwned ? (
                  <span className="cos-pill bg-emerald-100 text-emerald-800">Resident-owned</span>
                ) : null}
                {row.isHiring ? (
                  <span className="cos-pill bg-amber-100 text-amber-900">Hiring</span>
                ) : null}
                {row.offersResidentDiscount ? (
                  <span className="cos-pill bg-sky-100 text-sky-900">Resident discount</span>
                ) : null}
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Owners</p>
                <ul className="mt-2 space-y-1">
                  {row.owners.map((owner) => (
                    <li key={owner.residentId}>
                      <Link
                        href={`/residents/${owner.residentId}`}
                        className="text-sm font-semibold text-teal hover:underline"
                      >
                        {owner.fullName}
                        {owner.title ? ` · ${owner.title}` : ""}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {row.services.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {row.services.map((service) => (
                    <span key={service} className="cos-pill bg-white text-[var(--cos-ink)]/70">
                      {service}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
