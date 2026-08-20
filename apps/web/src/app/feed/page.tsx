"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchPosts, type PostRow } from "@/lib/api";

function formatWhen(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function FeedPage() {
  const [rows, setRows] = useState<PostRow[]>([]);
  const [kind, setKind] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPosts(undefined, kind || undefined)
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
  }, [kind]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Feed</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Society pulse</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Announcements, questions, and opportunity shares from residents—not an unrestricted public
          social network.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "", label: "All" },
          { key: "announcement", label: "Announcements" },
          { key: "question", label: "Questions" },
          { key: "update", label: "Updates" },
          { key: "opportunity_share", label: "Opportunities" },
        ].map((item) => (
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

      <div className="mx-auto max-w-3xl space-y-4">
        {loading ? (
          <div className="cos-card p-8 text-center text-[var(--cos-ink)]/50">Loading feed…</div>
        ) : error ? (
          <div className="cos-card p-8 text-center text-[var(--cos-danger)]">{error}</div>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="cos-card p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/residents/${row.authorId}`}
                  className="font-semibold text-ink hover:text-teal"
                >
                  {row.authorName}
                </Link>
                <span className="cos-pill capitalize bg-[var(--cos-sand)] text-teal">
                  {row.kind.replaceAll("_", " ")}
                </span>
                {row.isPinned ? (
                  <span className="cos-pill bg-amber-100 text-amber-900">Pinned</span>
                ) : null}
                <span className="ml-auto text-xs text-[var(--cos-ink)]/50">
                  {formatWhen(row.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_78%,transparent)]">
                {row.body}
              </p>
              <div className="mt-4 flex gap-4 text-xs font-semibold text-[var(--cos-ink)]/55">
                <span>{row.reactionCount} reactions</span>
                <span>{row.commentCount} comments</span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
