import { dbConnectSafe } from "@/lib/db/connect";
import { Project } from "@/lib/models";
import { projects as staticProjects } from "@/data";
import type { ProjectSectionView, ProjectStatusView, ProjectView } from "./types";

/** Generate placeholder architecture sections from a static project entry. */
function defaultSections(p: (typeof staticProjects)[number]): ProjectSectionView[] {
  return [
    {
      kind: "overview",
      heading: "Overview",
      order: 0,
      body: p.des,
    },
    {
      kind: "problem",
      heading: "Problem the system solves",
      order: 1,
      body:
        "Real users have a recurring need that current tools handle poorly — friction that costs time, money, or trust. This product turns that friction into a thin, well-modelled API the user never has to think about.",
    },
    {
      kind: "architecture",
      heading: "Architecture (HLD)",
      order: 2,
      body:
        "Server-first Next.js App Router. Strict separation of concerns: presentational components on the edge, validated server actions, a typed data layer behind a single connection helper, and a job-friendly write path so heavy work can be moved off the request thread without rewrites.",
    },
    {
      kind: "stack",
      heading: "Stack",
      order: 3,
      body:
        "TypeScript-strict end-to-end · Next.js · Tailwind · MongoDB / Mongoose · NextAuth · zod for boundary validation · Framer Motion for motion · Vercel for hosting and edge primitives.",
    },
    {
      kind: "scaling",
      heading: "Scaling notes",
      order: 4,
      body:
        "Read-heavy paths are cacheable at the edge with stale-while-revalidate. Write paths are bounded by zod and rate-limited per IP. Queue-friendly extraction points are documented for when synchronous compute starts to crowd the request budget.",
    },
    {
      kind: "outcomes",
      heading: "Outcome",
      order: 5,
      body:
        "Production-grade scaffolding the next engineer can extend without breaking invariants. Architecture documented inline so the system is reviewable as a system, not just a codebase.",
    },
  ];
}

function staticToView(p: (typeof staticProjects)[number]): ProjectView {
  return {
    id: `static-${p.slug}`,
    slug: p.slug,
    title: p.title,
    tagline: p.des.split(".")[0]?.trim() || p.title,
    description: p.des,
    liveUrl: p.link,
    repoUrl: undefined,
    coverImage: p.img,
    iconLists: p.iconLists ?? [],
    status: "live",
    isFeatured: true,
    order: p.id,
    technologies: [],
    sections: defaultSections(p),
  };
}

function dbToView(row: any): ProjectView {
  return {
    id: row._id.toString(),
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    liveUrl: row.liveUrl,
    repoUrl: row.repoUrl,
    coverImage: row.coverImage,
    iconLists: row.iconLists ?? [],
    status: row.status as ProjectStatusView,
    isFeatured: row.isFeatured,
    order: row.order ?? 0,
    technologies: row.technologies ?? [],
    sections: (row.sections ?? []).map((s: any) => ({
      kind: s.kind,
      heading: s.heading,
      body: s.body,
      order: s.order ?? 0,
    })),
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  };
}

export async function getAllProjects(): Promise<ProjectView[]> {
  const conn = await dbConnectSafe();
  if (conn) {
    try {
      const rows = await Project.find({ status: { $ne: "private" } })
        .sort({ order: 1, createdAt: -1 })
        .lean();
      if (rows.length > 0) return rows.map(dbToView);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[cms.projects] DB read failed, falling back:", (err as Error).message);
      }
    }
  }
  return staticProjects.map(staticToView).sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  const conn = await dbConnectSafe();
  if (conn) {
    try {
      const row = await Project.findOne({ slug, status: { $ne: "private" } }).lean();
      if (row) return dbToView(row);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[cms.projects] DB lookup failed, falling back:", (err as Error).message);
      }
    }
  }
  const stat = staticProjects.find((p) => p.slug === slug);
  return stat ? staticToView(stat) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const conn = await dbConnectSafe();
  if (conn) {
    try {
      const rows = await Project.find({ status: { $ne: "private" } }, { slug: 1 }).lean();
      if (rows.length > 0) return rows.map((r) => r.slug);
    } catch {
      /* fall through */
    }
  }
  return staticProjects.map((p) => p.slug);
}
