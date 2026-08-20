"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchProfessionalCategories,
  fetchProfessionals,
  type ProfessionalCategory,
  type ResidentRow,
} from "@/lib/api";

export default function ProfessionalsPage() {
  const [categories, setCategories] = useState<ProfessionalCategory[]>([]);
  const [rows, setRows] = useState<ResidentRow[]>([]);
  const [categoryKey, setCategoryKey] = useState("");
  const [mentoring, setMentoring] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfessionalCategories()
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProfessionals(undefined, {
      categoryKey: categoryKey || undefined,
      mentoring: mentoring || undefined,
      q: q || undefined,
    })
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
  }, [categoryKey, mentoring, q]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Professionals</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Talent directory</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Discover mentors, trades, clinicians, and operators already living in the society—permissioned
          for community opportunity, not a public scrape.
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
          placeholder="Search professionals…"
          className="min-w-[220px] flex-1 rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cos-teal)]/30"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mentoring} onChange={(e) => setMentoring(e.target.checked)} />
          Mentors only
        </label>
        <span className="text-xs text-[var(--cos-ink)]/55">{rows.length} professionals</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading professionals…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            No professionals match.
          </div>
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={`/residents/${row.id}`}
              className="cos-card block p-5 transition hover:-translate-y-0.5"
            >
              <p className="font-display text-xl text-ink">{row.fullName}</p>
              <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
                {row.primaryProfession ?? row.headline}
              </p>
              <p className="mt-3 text-xs text-[var(--cos-ink)]/55">
                {row.geoAreaName ?? "Society"} · {row.employmentStatus.replaceAll("_", " ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="cos-pill bg-[var(--cos-sand)] text-teal">
                    {skill}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
