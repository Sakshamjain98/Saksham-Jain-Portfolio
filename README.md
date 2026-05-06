# Saksham Jain — Portfolio Platform

A senior-engineer portfolio + content platform at **[sakshamjain.codes](https://sakshamjain.codes)**.
Eight live sub-products are showcased here:

| Project | Live |
| --- | --- |
| AutoGrad | https://auto-grad.sakshamjain.codes |
| Bodh | https://bodh.sakshamjain.codes |
| Karunya Trust | https://chtrust.sakshamjain.codes |
| Gallera | https://gallera.sakshamjain.codes |
| KBG | https://kbg.sakshamjain.codes |
| OSA | https://osa.sakshamjain.codes |
| SYTA | https://syta.sakshamjain.codes |
| Uddeshya | https://uddeshya.sakshamjain.codes |

This is not a static portfolio — it's a CMS-backed platform with an admin
panel, lead-management, MDX blog, and resume hosting.

---

## Stack

- **Framework**: Next.js 14 App Router (React Server Components, server actions)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS, custom design tokens
- **Animation**: Framer Motion, Three.js / react-three-fiber (3D globe), GSAP-style canvas effects
- **Database**: MongoDB (Atlas) via Mongoose *(wired in Phase B)*
- **Auth**: NextAuth — credentials + email magic link *(wired in Phase B)*
- **Content**: MDX blog stored in MongoDB, rendered with `next-mdx-remote`
- **Hosting**: Vercel (edge-ready)

---

## Getting started

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Edit .env.local — fill in:
#   MONGODB_URI      = mongodb+srv://...
#   NEXTAUTH_SECRET  = $(openssl rand -base64 32)
#   NEXTAUTH_URL     = http://localhost:3000   # or your prod URL
#   ADMIN_EMAIL      = your-admin@email
#   ADMIN_PASSWORD   = a strong password (min 12 chars recommended)
#   ADMIN_NAME       = "Saksham Jain"
# Optional (magic-link sign-in):
#   EMAIL_SERVER     = smtp://user:pass@host:587
#   EMAIL_FROM       = "Saksham Jain <noreply@your-domain>"

# 3. Seed admin user
npm run seed:admin                       # creates user from .env
npm run seed:admin -- --force            # rotate the password hash

# 4. (optional) Seed projects + experience from data/index.ts into MongoDB
npm run seed:projects
npm run seed:experience

# 5. Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site,
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the CMS.

---

## Environment variables

See [`.env.example`](./.env.example). All secrets live in `.env.local`
(gitignored). Required for prod:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL — used by metadata, OG, sitemap |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Same as `NEXT_PUBLIC_SITE_URL` in prod |
| `ADMIN_EMAIL` | First admin user, seeded once |
| `ADMIN_PASSWORD` | First admin password — hashed at seed time |
| `EMAIL_SERVER` (optional) | SMTP URL for magic-link sign-in. If unset, magic-link disabled |
| `EMAIL_FROM` (optional) | From address for magic-link emails |

---

## Project structure

```
app/
  page.tsx              Public homepage
  layout.tsx            Root layout, fonts, metadata
  globals.css           Tailwind base + tokens
  provider.tsx          ThemeProvider (next-themes)
  api/                  Auth + contact + admin REST endpoints (Phase B+)
  admin/                Auth-gated CMS (Phase D)
  blog/[slug]/          MDX-rendered blog posts (Phase F)
  projects/[slug]/      Project detail pages (Phase E)
  architecture/         Architecture-showcase page (Phase E)
  resume/               Resume page + PDF download (Phase G)

components/
  Hero.tsx              Spotlight + headline + CTA
  Grid.tsx              BentoGrid composition
  RecentProjects.tsx    Pin animation grid of projects
  Clients.tsx           Testimonial marquee + tech-stack strip
  Experience.tsx        Moving-borders cards
  Approach.tsx          Three-phase engineering process (PRD/HLD/LLD → Implementation → Scale)
  Footer.tsx            CTA + social
  signup.tsx            Contact form
  ui/                   Spotlight, BentoGrid, Pin, Globe, MovingBorders, InfiniteCards, etc.

data/
  index.ts              Static content (projects, experience, testimonials, profile)
                        — falls back here when DB is unavailable.

lib/
  utils.ts              cn() helper
  // Phase B+:
  db/                   Mongoose connection
  models/               User, Project, Experience, Lead, BlogPost, Resume schemas
  auth/                 NextAuth options + session helpers
  validations/          Zod schemas for contact, projects, blog, etc.
  mdx/                  MDX components + render pipeline
  seed/                 Admin / projects / experience seed scripts
```

---

## Roadmap

Phased rebuild from the original tutorial scaffold:

- ✅ **Phase 0** — Security cleanup (malware removed from `postcss.config.js`, Sentry stripped, env scaffolded)
- ✅ **Phase A** — Content swap: real projects, experience, testimonials, copy. Design system preserved.
- ✅ **Phase B** — Backend foundation: Mongoose connection, six models (User, Project, Experience, Lead, BlogPost, Resume), NextAuth (credentials + magic link), middleware, seed admin
- ✅ **Phase C** — Contact form persistence: zod-validated `/api/contact`, honeypot + per-IP rate limit, leads collection
- ✅ **Phase D** — Admin panel: login form, dashboard, CRUD for projects / blog / experience / leads / resume
- ✅ **Phase E** — `/projects` index + `/projects/[slug]` detail with sectioned architecture write-ups; `/architecture` showcase
- ✅ **Phase F** — MDX blog at `/blog` and `/blog/[slug]` with shiki-powered syntax highlighting, tags, related posts, RSS feed at `/blog/feed.xml`
- ✅ **Phase G** — Resume page at `/resume`, public PDF endpoint at `/api/resume`, admin upload + version history at `/admin/resume`
- ✅ **Phase H** — SEO: dynamic `app/sitemap.ts`, `app/robots.ts`, edge-rendered `opengraph-image.tsx`, per-page `generateMetadata`, custom `not-found.tsx`

## Routes

### Public
- `/` — homepage (hero, bento grid, projects, testimonials, experience, approach, contact form, footer)
- `/projects` — full project index with status pills
- `/projects/[slug]` — project detail with architecture sections + sticky aside
- `/architecture` — architecture-showcase page (PRD/HLD/LLD pillars, principles)
- `/blog` — blog index with tag list
- `/blog/[slug]` — MDX-rendered post with related links
- `/blog/feed.xml` — RSS feed
- `/resume` — resume preview + download + experience timeline
- `/sitemap.xml` and `/robots.txt` — auto-generated
- `/api/contact` — POST: contact form lead capture
- `/api/resume` — GET: download active PDF (`?download=1` to force attachment)

### Admin (auth-gated, role: `admin` or `editor`)
- `/admin/login` — credentials + magic-link sign-in
- `/admin` — dashboard with counts and recent leads
- `/admin/projects` — list / new / edit
- `/admin/blog` — list / new / edit (MDX editor)
- `/admin/experience` — list / new / edit
- `/admin/leads` — inbox, status filters, detail with notes + status workflow
- `/admin/resume` — upload PDFs, version history, set-active

---

## Security note

This repository previously contained an obfuscated payload in
`postcss.config.js` (commit `135d7d2`). It was removed in commit `203c20a`.
If you fork or clone, run:

```bash
git log --all -S 'String.fromCharCode(127)' -- '*.js' '*.ts'
```

to confirm your tree is clean before installing.

---

## License

UNLICENSED — © Saksham Jain. All rights reserved.
