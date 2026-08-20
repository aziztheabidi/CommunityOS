# UI System & Information Architecture

## Design vision

Clean, modern, premium, interactive. Feels like a technology product—not government software, Bootstrap admin, or spreadsheet pages.

**Inspiration (patterns only):** Linear (density/speed), Notion (structure), Stripe (clarity), Airbnb (trust/identity), LinkedIn (professional graph), modern GIS dashboards (layers/legends).

**Do not copy** branding or layouts from references. Create an original CommunityOS identity.

## Brand direction (initial)

- Name lockup: **CommunityOS** as a clear product signal in the shell  
- Palette: deep teal/ink primary (not generic purple-on-white), warm neutral surfaces with subtle depth (gradients/grid texture—not flat gray only), accent for CTAs and active nav  
- Typography: distinctive sans for UI + refined display for greetings/hero moments (avoid Inter/Roboto/Arial defaults)  
- Radius: medium; shadows: soft and rare  
- Status: green/amber/red pills used sparingly  
- Motion: 2–3 intentional patterns (nav active, panel slide, chart hover)—respect `prefers-reduced-motion`  

Exact tokens live in `packages/ui` during Milestone 0.

## Application shell

**Primary nav (side):** Home · Community · Residents · Map · Professionals · Businesses · Network · Feed · Events · Opportunities · Groups · Messages · Analytics · Admin  

**Top:** Global search · Command palette (`⌘K`) · Notifications · Profile  

**Secondary:** Quick actions contextual to page (Add Event, Invite, Import).

## Information architecture

### Home / Admin Intelligence

Greeting + living stats → interactive map widget → professional composition (clickable) → trends → activity → quick actions. Interconnected widgets.

### Map

Full-viewport map + filter chip bar + layer drawer + detail side panel (sector/resident/business). Mobile: map-first + bottom sheets.

### Directories (Residents / Professionals / Businesses / Resources)

Search · facet chips · progressive advanced filters · grid/list/map toggle · saved searches · quick-view drawer · cursor load more.

### Profile

Story layout: identity → professional summary → intents → skills → business → community (groups/events/mutuals). Render only permitted fields; show thoughtful empty states for hidden sections (no spoiler of private data).

### Feed / Events / Groups / Opportunities / Messages

Familiar modern patterns with optimistic messaging UI, cursor pagination, moderation entry points.

## Component inventory (foundation)

- AppShell, Nav, CommandPalette, SearchBox  
- StatCard (clickable), ChartCard, EmptyState, ErrorState, Skeleton  
- DataTable, FilterBar, FacetChip, StatusPill  
- ProfileHeader, EntityDrawer  
- MapCanvas, LayerToggle, Legend, MapTooltip  
- Forms via shadcn + RHF/Zod  

## Responsiveness

| Breakpoint | Behavior |
|------------|----------|
| Large desktop | Shell + optional right context column |
| Laptop | Collapsible nav |
| Tablet | Icon nav + drawers |
| Mobile | Tab/bottom nav subset; map bottom sheets; no hover-only actions |

## Accessibility

Semantic landmarks, focus visible, dialog focus traps, ARIA for tabs/maps controls, contrast AA, keyboard sortable tables where used.

## Anti-patterns

- Cards everywhere without purpose  
- Hero clutter on app home (stats are OK on dashboards; marketing landing is separate)  
- Purple gradient clichés / glow soup  
- Enormous filter forms on first paint  
- Map without list/table fallback  
