"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchHouseholds, type HouseholdRow } from "@/lib/api";

export default function HouseholdsPage() {
  const [rows, setRows] = useState<HouseholdRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchHouseholds()
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
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Households</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Occupancy graph</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Households linked to properties and resident members. Occupancy history stays intact when
          people move.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading households…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-ink">{row.label ?? "Household"}</h2>
                  <p className="mt-1 text-xs text-[var(--cos-ink)]/55">
                    Size {row.householdSize}
                    {row.propertyId ? ` · ${row.propertyId.replaceAll("_", " ")}` : ""}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {row.members.map((member) => (
                  <li key={member.id}>
                    <Link
                      href={`/residents/${member.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[var(--cos-sand)]/60 px-3 py-2 transition hover:bg-white"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">{member.fullName}</p>
                        <p className="text-xs text-[var(--cos-ink)]/55">
                          {member.headline ?? member.role}
                        </p>
                      </div>
                      <span className="cos-pill bg-white capitalize text-teal">{member.role}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
