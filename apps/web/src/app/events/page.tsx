"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchEvents, type EventRow } from "@/lib/api";

function formatEventWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchEvents()
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
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Events</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Upcoming gatherings</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
            Health camps, volunteer days, clinics, and youth meetups—with RSVP counts and map
            locations.
          </p>
        </div>
        <Link href="/map" className="text-sm font-semibold text-teal">
          View on map →
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-ink)]/50">
            Loading events…
          </div>
        ) : error ? (
          <div className="cos-card col-span-full p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                {formatEventWhen(row.startsAt)}
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{row.title}</h2>
              <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
                {row.summary}
              </p>
              <p className="mt-3 text-xs text-[var(--cos-ink)]/55">
                {[row.locationName, row.hostName ? `Hosted by ${row.hostName}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="cos-pill bg-emerald-100 text-emerald-800">
                  {row.goingCount} going
                </span>
                <span className="cos-pill bg-sky-100 text-sky-900">
                  {row.interestedCount} interested
                </span>
                {row.capacity ? (
                  <span className="cos-pill bg-white text-[var(--cos-ink)]/70">
                    Cap {row.capacity}
                  </span>
                ) : null}
                {row.hostId ? (
                  <Link href={`/residents/${row.hostId}`} className="cos-pill bg-[var(--cos-sand)] text-teal">
                    Host profile
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
