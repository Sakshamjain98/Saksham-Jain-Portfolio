/**
 * Seed projects from data/index.ts into MongoDB.
 *
 *   npm run seed:projects
 *
 * This is optional — public pages fall back to data/index.ts when the
 * projects collection is empty. Running this seeds the DB so you can edit
 * each project from /admin/projects.
 *
 * Pass --force to overwrite existing rows.
 */

import mongoose from "mongoose";

import { dbConnect } from "../db/connect";
import { Project } from "../models";
import { projects as staticProjects } from "../../data";

const sectionTemplate = (project: (typeof staticProjects)[number]) => [
  { kind: "overview" as const, order: 0, heading: "Overview", body: project.des },
  {
    kind: "problem" as const,
    order: 1,
    heading: "Problem the system solves",
    body: "Real users have a recurring need that current tools handle poorly. The product turns that friction into a thin, well-modelled API.",
  },
  {
    kind: "architecture" as const,
    order: 2,
    heading: "Architecture (HLD)",
    body: "Server-first Next.js App Router. Strict separation of concerns: presentational components on the edge, validated server actions, a typed data layer behind a single connection helper, and a job-friendly write path so heavy work can be moved off the request thread without rewrites.",
  },
  {
    kind: "stack" as const,
    order: 3,
    heading: "Stack",
    body: "TypeScript-strict end-to-end · Next.js · Tailwind · MongoDB / Mongoose · NextAuth · zod · Framer Motion · Vercel.",
  },
  {
    kind: "scaling" as const,
    order: 4,
    heading: "Scaling notes",
    body: "Read-heavy paths cacheable at the edge with stale-while-revalidate. Write paths are zod-validated and rate-limited per IP. Queue-friendly extraction points are documented for compute that crowds the request budget.",
  },
  {
    kind: "outcomes" as const,
    order: 5,
    heading: "Outcome",
    body: "Production-grade scaffolding the next engineer can extend without breaking invariants.",
  },
];

async function main() {
  const force = process.argv.includes("--force");
  await dbConnect();

  for (const p of staticProjects) {
    const exists = await Project.findOne({ slug: p.slug });
    if (exists && !force) {
      console.log(`[seed:projects] skipped ${p.slug} (exists)`);
      continue;
    }

    const doc = {
      slug: p.slug,
      title: p.title,
      tagline: p.des.split(".")[0]?.trim() || p.title,
      description: p.des,
      liveUrl: p.link,
      coverImage: p.img,
      iconLists: p.iconLists ?? [],
      status: "live" as const,
      isFeatured: true,
      order: p.id,
      technologies: [],
      sections: sectionTemplate(p),
    };

    if (exists && force) {
      Object.assign(exists, doc);
      await exists.save();
      console.log(`[seed:projects] updated ${p.slug}`);
    } else {
      await Project.create(doc);
      console.log(`[seed:projects] created ${p.slug}`);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed:projects] failed:", err);
  process.exit(1);
});
