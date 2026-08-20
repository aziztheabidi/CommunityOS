import { Button, StatCard } from "@communityos/ui";

const navPreview = [
  "Residents",
  "Map",
  "Professionals",
  "Businesses",
  "Network",
  "Events",
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="cos-card overflow-hidden p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Milestone 0 foundation
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl">
          CommunityOS is ready for geography, households, and intelligence.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
          Architecture, permissions, PostGIS-ready schema, API shell, and design system are in
          place. Feature modules start with Society Geography & Properties.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button>Open command palette soon</Button>
          <Button variant="secondary">View architecture docs</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Residents" value="—" hint="Connected after Milestone 2" />
        <StatCard label="Households" value="—" hint="Occupancy history model ready" />
        <StatCard label="Professionals" value="—" hint="Taxonomies in Milestone 3" />
        <StatCard label="Businesses" value="—" hint="Directory in Milestone 4" />
      </section>

      <section className="cos-card p-6">
        <h2 className="font-display text-2xl text-ink">Product shell preview</h2>
        <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
          Navigation destinations are scaffolded for later milestones.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {navPreview.map((item) => (
            <span
              key={item}
              className="cos-pill bg-[var(--cos-teal-soft)] text-[var(--cos-ink)]"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
