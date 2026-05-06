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
# Then fill in MONGODB_URI, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.

# 3. Seed admin user (Phase B+)
npm run seed:admin

# 4. Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
- 🚧 **Phase B** — Backend foundation (DB, models, NextAuth, seed admin, middleware)
- 🚧 **Phase C** — Contact form persistence + lead capture
- 🚧 **Phase D** — Admin panel (projects, blog, experience, leads, resume CRUD)
- 🚧 **Phase E** — Project detail pages, architecture-showcase page
- 🚧 **Phase F** — MDX blog + RSS + search
- 🚧 **Phase G** — Resume PDF upload + download endpoint
- 🚧 **Phase H** — SEO finishing (sitemap, robots, OG image)

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
