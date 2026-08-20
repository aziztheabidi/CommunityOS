# Supabase setup (simple guide)

You already added the keys you know (`SUPABASE_URL`, anon, service role, JWT). Those are enough for **Auth / client**.

`DATABASE_URL` / `DIRECT_URL` are only needed if we want Prisma (or any tool) to talk to Postgres **directly** from your laptop — for migrations and seeding.

You do **not** need them if you prefer the workflow you used before: paste SQL in the Supabase SQL Editor.

---

## Option A — Same as your previous projects (recommended for now)

1. Open Supabase → **SQL Editor** → New query  
2. Paste the full contents of:

   `packages/database/prisma/manual/supabase-sql-editor-bootstrap.sql`

3. Click **Run**  
4. Tell me when it succeeds — demo data can keep running in-app, or we seed next

This creates all CommunityOS tables + enables PostGIS.

---

## Option B — Where to find Database URL / Direct URL

In Supabase dashboard:

1. Open your project  
2. Click **Project Settings** (gear)  
3. Open **Database**  
4. Scroll to **Connection string** / **Connection parameters**

You will see modes like:

| What you copy | Use for |
|---------------|---------|
| **URI** (often Transaction or Session pooler, port `6543`) | `DATABASE_URL` |
| **Direct connection** (host `db.<project-ref>.supabase.co`, port `5432`) | `DIRECT_URL` |

Typical shapes (password is the one you set when creating the project — reset under Database settings if forgotten):

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-….pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

Notes:

- Replace `[YOUR-PASSWORD]` — URL-encode special characters (`@` → `%40`, etc.)  
- Prisma wants **both**: pooled URL for queries, direct URL for migrations  
- You can leave them as localhost placeholders and still use Option A

---

## What each `.env` key is for

| Key | Purpose |
|-----|---------|
| `SUPABASE_URL` | Project API URL |
| `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_…` | Browser-safe client access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged API (never expose to browser) |
| `SUPABASE_JWT_SECRET` | Verify auth tokens in our Fastify API |
| `DATABASE_URL` | Optional — Prisma → Postgres (pooler) |
| `DIRECT_URL` | Optional — Prisma migrations (direct) |

Right now the app UI works with the **demo dataset** even without Database URLs. Auth keys unlock Supabase Auth later.

### After tables exist — seed demo rows

Run these in order in the **CommunityOS** Supabase SQL Editor:

1. `packages/database/prisma/manual/supabase-sql-editor-bootstrap.sql` — M0/M1 tables (if not already)
2. `packages/database/prisma/manual/supabase-sql-editor-seed-jaffar-e-tayyar.sql` — geography & properties
3. `packages/database/prisma/manual/supabase-sql-editor-m2-m3-bootstrap.sql` — residents/households/professions tables
4. `packages/database/prisma/manual/supabase-sql-editor-seed-residents-professionals.sql` — people seed
5. `packages/database/prisma/manual/supabase-sql-editor-m4-bootstrap.sql` — businesses tables
6. `packages/database/prisma/manual/supabase-sql-editor-seed-businesses.sql` — business directory seed
7. `packages/database/prisma/manual/supabase-sql-editor-m5-m9-bootstrap.sql` — network/feed/events/opportunities tables
8. `packages/database/prisma/manual/supabase-sql-editor-seed-community-life.sql` — community life seed

Then refresh the app. The API prefers Supabase when `SUPABASE_URL` + service role are set; otherwise it falls back to in-memory demo data.
