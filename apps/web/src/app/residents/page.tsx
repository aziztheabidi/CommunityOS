"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchResidents, type ResidentRow } from "@/lib/api";

export default function ResidentsPage() {
  const [rows, setRows] = useState<ResidentRow[]>([]);
  const [q, setQ] = useState("");
  const [mentoring, setMentoring] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [lookingForWork, setLookingForWork] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchResidents(undefined, {
      q: q || undefined,
      mentoring: mentoring || undefined,
      hiring: hiring || undefined,
      lookingForWork: lookingForWork || undefined,
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
  }, [q, mentoring, hiring, lookingForWork]);

  const summary = useMemo(
    () => ({
      mentors: rows.filter((row) => row.openToMentoring).length,
      hiring: rows.filter((row) => row.hiring).length,
      looking: rows.filter((row) => row.lookingForWork).length,
    }),
    [rows],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Residents</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Community members</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
            Household-linked resident profiles with professional signals. Sensitive contact fields
            stay restricted by privacy settings.
          </p>
        </div>
        <Link href="/households" className="text-sm font-semibold text-teal">
          View households →
        </Link>
      </header>

      <div className="cos-card flex flex-wrap items-center gap-3 p-4">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search name, headline, skill…"
          className="min-w-[220px] flex-1 rounded-xl border border-[var(--cos-border)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--cos-teal)]/30"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mentoring} onChange={(e) => setMentoring(e.target.checked)} />
          Mentors
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hiring} onChange={(e) => setHiring(e.target.checked)} />
          Hiring
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={lookingForWork}
            onChange={(e) => setLookingForWork(e.target.checked)}
          />
          Looking for work
        </label>
        <div className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
          {rows.length} shown · {summary.mentors} mentors · {summary.hiring} hiring · {summary.looking}{" "}
          seeking
          {source ? ` · ${source}` : ""}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading residents…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            No residents match your filters.
          </div>
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={`/residents/${row.id}`}
              className="cos-card block p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--cos-shadow)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-ink">{row.fullName}</p>
                  <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
                    {row.headline ?? row.primaryProfession ?? "Resident"}
                  </p>
                </div>
                <span className="cos-pill bg-[var(--cos-sand)] text-teal">
                  {row.geoAreaName ?? "Society"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {row.openToMentoring ? (
                  <span className="cos-pill bg-[var(--cos-teal-soft)] text-teal">Mentor</span>
                ) : null}
                {row.hiring ? (
                  <span className="cos-pill bg-[var(--cos-sand)] text-ink">Hiring</span>
                ) : null}
                {row.lookingForWork ? (
                  <span className="cos-pill bg-[var(--cos-sand)] text-ink">Open to roles</span>
                ) : null}
                {row.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="cos-pill bg-white text-[var(--cos-ink)]/70">
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
