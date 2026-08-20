export default function AdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Admin</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Operations desk</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Milestones 1–9 are demo-wired. Prefer Supabase SQL Editor scripts under
          packages/database/prisma/manual.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "M1 Geography",
            body: "bootstrap.sql + seed-jaffar-e-tayyar.sql for map, sectors, and properties.",
          },
          {
            title: "M2–M3 People",
            body: "m2-m3-bootstrap.sql + seed-residents-professionals.sql for households, residents, professions.",
          },
          {
            title: "M4 Businesses",
            body: "m4-bootstrap.sql + seed-businesses.sql for the local economy directory.",
          },
          {
            title: "M5–M9 Community life",
            body: "m5-m9-bootstrap.sql + seed-community-life.sql for network, feed, events, and opportunities.",
          },
        ].map((card) => (
          <article key={card.title} className="cos-card p-5">
            <h2 className="font-display text-2xl text-ink">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
