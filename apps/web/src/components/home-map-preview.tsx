"use client";

import dynamic from "next/dynamic";

const SocietyMap = dynamic(
  () => import("@/components/society-map").then((mod) => mod.SocietyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center rounded-2xl bg-[var(--cos-sand)] text-sm text-[var(--cos-ink)]/60">
        Loading map…
      </div>
    ),
  },
);

export function HomeMapPreview() {
  return <SocietyMap compact />;
}
