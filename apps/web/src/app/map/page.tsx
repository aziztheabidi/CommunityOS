"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapSelection } from "@/components/society-map";
import { fetchMapIntelligence, type MapIntelligence } from "@/lib/api";

const SocietyMap = dynamic(
  () => import("@/components/society-map").then((mod) => mod.SocietyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,640px)] items-center justify-center rounded-2xl bg-[var(--cos-sand)] text-sm">
        Loading Society Map…
      </div>
    ),
  },
);

export default function MapPage() {
  const [selection, setSelection] = useState<MapSelection>(null);
  const [intel, setIntel] = useState<MapIntelligence | null>(null);

  const areaId =
    selection && ["phase", "sector", "block", "area"].includes(selection.kind)
      ? selection.id
      : undefined;

  useEffect(() => {
    let cancelled = false;
    fetchMapIntelligence(undefined, areaId)
      .then((response) => {
        if (!cancelled) setIntel(response.data);
      })
      .catch(() => {
        if (!cancelled) setIntel(null);
      });
    return () => {
      cancelled = true;
    };
  }, [areaId]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">
            Society Intelligence Map
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">Interactive geography</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
            Toggle layers, inspect sectors, and see resident / business / event intelligence for the
            selected area.
          </p>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="cos-card p-4 md:p-5">
          <SocietyMap onSelect={setSelection} />
        </div>

        <aside className="cos-card flex flex-col gap-5 p-5">
          <div>
            <h2 className="font-display text-2xl text-ink">Inspector</h2>
            <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)]">
              Click a sector, amenity, business, or event.
            </p>
          </div>

          {selection ? (
            <div className="space-y-3">
              <p className="cos-pill bg-[var(--cos-teal-soft)] text-[var(--cos-ink)]">
                {selection.kind}
              </p>
              <h3 className="font-display text-3xl text-ink">{selection.name}</h3>
              {selection.kind === "businesses" ? (
                <Link href="/businesses" className="text-sm font-semibold text-teal">
                  Open business directory →
                </Link>
              ) : null}
              {selection.kind === "events" ? (
                <Link href="/events" className="text-sm font-semibold text-teal">
                  Open events →
                </Link>
              ) : null}
              <dl className="space-y-2 text-sm">
                {Object.entries(selection.details)
                  .filter(([key]) => !["id", "name", "layer"].includes(key))
                  .slice(0, 8)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start justify-between gap-3 border-b border-[var(--cos-border)] py-2"
                    >
                      <dt className="text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
                        {key}
                      </dt>
                      <dd className="max-w-[60%] text-right font-medium text-ink">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--cos-sand)]/70 p-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
              Select an area to filter the intelligence panel. Turn on <strong>Events</strong> or{" "}
              <strong>Businesses</strong> for map pins.
            </div>
          )}

          {intel ? (
            <div className="space-y-4 border-t border-[var(--cos-border)] pt-4">
              <h3 className="font-display text-xl text-ink">
                {areaId ? "Area intelligence" : "Society intelligence"}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-[var(--cos-sand)]/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Residents</p>
                  <p className="font-display text-2xl">{intel.residents}</p>
                </div>
                <div className="rounded-xl bg-[var(--cos-sand)]/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Mentors</p>
                  <p className="font-display text-2xl">{intel.mentors}</p>
                </div>
                <div className="rounded-xl bg-[var(--cos-sand)]/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Businesses</p>
                  <p className="font-display text-2xl">{intel.businesses}</p>
                </div>
                <div className="rounded-xl bg-[var(--cos-sand)]/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Events</p>
                  <p className="font-display text-2xl">{intel.upcomingEvents}</p>
                </div>
              </div>
              {intel.professions.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cos-ink)]/50">
                    Top professions
                  </p>
                  <ul className="mt-2 space-y-1">
                    {intel.professions.slice(0, 5).map((row) => (
                      <li key={row.label} className="flex justify-between text-sm">
                        <span>{row.label}</span>
                        <span className="font-semibold">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {intel.sampleResidents.length ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cos-ink)]/50">
                    People here
                  </p>
                  <ul className="mt-2 space-y-1">
                    {intel.sampleResidents.map((row) => (
                      <li key={row.id}>
                        <Link href={`/residents/${row.id}`} className="text-sm font-semibold text-teal">
                          {row.fullName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto rounded-2xl bg-[linear-gradient(145deg,#0b1f24,#0f6b6b)] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.14em] text-white/60">Privacy note</p>
            <p className="mt-2 text-sm text-white/85">
              Exact household coordinates are permission-gated. Aggregates use minimum bucket
              thresholds so small groups cannot be singled out.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
