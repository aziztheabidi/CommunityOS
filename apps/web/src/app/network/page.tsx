"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchConnections, type ConnectionRow } from "@/lib/api";

export default function NetworkPage() {
  const [rows, setRows] = useState<ConnectionRow[]>([]);
  const [status, setStatus] = useState("accepted");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchConnections(undefined, status || undefined)
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
  }, [status]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Network</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Community graph</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Accepted connections and pending requests between residents—mentoring, trades referrals,
          and household partnerships.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "accepted", label: "Connected" },
          { key: "pending", label: "Pending" },
          { key: "", label: "All" },
        ].map((item) => (
          <button
            key={item.key || "all"}
            type="button"
            onClick={() => setStatus(item.key)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              status === item.key
                ? "bg-[var(--cos-teal)] text-white"
                : "border border-[var(--cos-border)] bg-white/80"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="cos-card p-8 text-center text-[var(--cos-ink)]/50">Loading network…</div>
        ) : error ? (
          <div className="cos-card p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : rows.length === 0 ? (
          <div className="cos-card p-8 text-center text-[var(--cos-ink)]/50">No connections.</div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-[180px] flex-1">
                <Link href={`/residents/${row.from.id}`} className="font-semibold text-ink hover:text-teal">
                  {row.from.fullName}
                </Link>
                <p className="text-xs text-[var(--cos-ink)]/55">{row.from.headline}</p>
              </div>
              <span className="cos-pill capitalize bg-[var(--cos-sand)] text-teal">{row.status}</span>
              <div className="min-w-[180px] flex-1 text-right sm:text-left">
                <Link href={`/residents/${row.to.id}`} className="font-semibold text-ink hover:text-teal">
                  {row.to.fullName}
                </Link>
                <p className="text-xs text-[var(--cos-ink)]/55">{row.to.headline}</p>
              </div>
              {row.message ? (
                <p className="w-full text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
                  {row.message}
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
