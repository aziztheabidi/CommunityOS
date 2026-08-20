import Link from "next/link";
import { fetchGeoAreas, fetchSociety } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function GeographyPage() {
  const [{ data: society }, { data: areas }] = await Promise.all([
    fetchSociety(),
    fetchGeoAreas(),
  ]);

  const phases = areas.filter((area) => area.levelKey === "phase");
  const sectors = areas.filter((area) => area.levelKey === "sector");
  const blocks = areas.filter((area) => area.levelKey === "block");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Geography</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Configurable hierarchy</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
            {society.name} uses Phase → Sector → Block. Labels are society-configurable—not hard-coded
            forever.
          </p>
        </div>
        <Link href="/map" className="text-sm font-semibold text-teal">
          View on map →
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Phases", value: phases.length },
          { label: "Sectors", value: sectors.length },
          { label: "Blocks (sample)", value: blocks.length },
        ].map((item) => (
          <div key={item.label} className="cos-card p-5">
            <p className="text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
              {item.label}
            </p>
            <p className="mt-2 font-display text-4xl text-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {phases.map((phase) => {
          const phaseSectors = sectors.filter((sector) => sector.parentId === phase.id);
          return (
            <article key={phase.id} className="cos-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="cos-pill bg-[var(--cos-teal-soft)] text-[var(--cos-ink)]">
                    {phase.code}
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-ink">{phase.name}</h2>
                </div>
                <p className="text-right text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
                  {phase.residentEstimate.toLocaleString()} residents
                  <br />
                  {phase.householdEstimate.toLocaleString()} households
                </p>
              </div>
              <ul className="mt-5 space-y-3">
                {phaseSectors.map((sector) => {
                  const sectorBlocks = blocks.filter((block) => block.parentId === sector.id);
                  return (
                    <li
                      key={sector.id}
                      className="rounded-2xl border border-[var(--cos-border)] bg-white/55 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-ink">
                          {sector.name}{" "}
                          <span className="text-xs font-medium text-[var(--cos-teal)]">
                            {sector.code}
                          </span>
                        </p>
                        <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
                          {sector.residentEstimate.toLocaleString()} people
                        </p>
                      </div>
                      {sectorBlocks.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {sectorBlocks.map((block) => (
                            <span
                              key={block.id}
                              className="rounded-lg bg-[var(--cos-sand)] px-2.5 py-1 text-xs font-medium text-ink"
                            >
                              {block.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-[color-mix(in_oklab,var(--cos-ink)_50%,transparent)]">
                          Block detail available on map layers.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </section>
    </div>
  );
}
