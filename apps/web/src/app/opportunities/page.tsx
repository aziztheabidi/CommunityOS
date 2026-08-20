"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchOpportunities, type OpportunityRow } from "@/lib/api";

const kinds = [
  { key: "", label: "All" },
  { key: "job", label: "Jobs" },
  { key: "freelance", label: "Freelance" },
  { key: "internship", label: "Internships" },
  { key: "volunteer", label: "Volunteer" },
  { key: "mentorship", label: "Mentorship" },
];

export default function OpportunitiesPage() {
  const [rows, setRows] = useState<OpportunityRow[]>([]);
  const [kind, setKind] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOpportunities(undefined, {
      kind: kind || undefined,
      status: "open",
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
  }, [kind, q]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Opportunities</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Prosperity hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Jobs, freelance work, mentorship, and volunteer roles posted by residents and local
          businesses.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {kinds.map((item) => (
          <button
            key={item.key || "all"}
            type="button"
            onClick={() => setKind(item.key)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              kind === item.key
                ? "bg-[var(--cos-teal)] text-white"
                : "border border-[var(--cos-border)] bg-white/80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="cos-card p-4">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search opportunities…"
          className="w-full rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cos-teal)]/30"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading opportunities…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            No open opportunities match.
          </div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="cos-pill capitalize bg-[var(--cos-sand)] text-teal">{row.kind}</span>
                <span className="text-xs text-[var(--cos-ink)]/50">
                  {row.applicationCount} applicants
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl text-ink">{row.title}</h2>
              <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
                {row.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {row.compensation ? (
                  <span className="cos-pill bg-white text-[var(--cos-ink)]/70">{row.compensation}</span>
                ) : null}
                {row.isRemoteOk ? (
                  <span className="cos-pill bg-sky-100 text-sky-900">Remote OK</span>
                ) : null}
              </div>
              {row.posterId ? (
                <p className="mt-4 text-sm">
                  Posted by{" "}
                  <Link href={`/residents/${row.posterId}`} className="font-semibold text-teal">
                    {row.posterName}
                  </Link>
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
