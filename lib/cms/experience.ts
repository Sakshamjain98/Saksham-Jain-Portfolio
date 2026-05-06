import { dbConnectSafe } from "@/lib/db/connect";
import { Experience } from "@/lib/models";
import { workExperience as staticExperience } from "@/data";
import type { ExperienceView } from "./types";

function staticToView(e: (typeof staticExperience)[number], index: number): ExperienceView {
  // Static rows have no real dates — use a deterministic offset so timeline ordering is stable.
  const now = new Date();
  const start = new Date(now.getFullYear() - (index + 1), 0, 1);
  const end = index === 0 ? null : new Date(now.getFullYear() - index, 0, 1);
  return {
    id: `static-${e.id}`,
    title: e.title,
    company: e.title.split("—")[1]?.trim() || e.title,
    description: e.desc,
    startDate: start.toISOString(),
    endDate: end?.toISOString() ?? null,
    order: e.id,
    thumbnail: e.thumbnail,
    highlights: [],
    technologies: [],
  };
}

function dbToView(row: any): ExperienceView {
  return {
    id: row._id.toString(),
    title: row.title,
    company: row.company,
    description: row.description,
    location: row.location,
    startDate: new Date(row.startDate).toISOString(),
    endDate: row.endDate ? new Date(row.endDate).toISOString() : null,
    order: row.order ?? 0,
    thumbnail: row.thumbnail,
    highlights: row.highlights ?? [],
    technologies: row.technologies ?? [],
  };
}

export async function getAllExperience(): Promise<ExperienceView[]> {
  const conn = await dbConnectSafe();
  if (conn) {
    try {
      const rows = await Experience.find({}).sort({ startDate: -1 }).lean();
      if (rows.length > 0) return rows.map(dbToView);
    } catch {
      /* fall through */
    }
  }
  return staticExperience.map(staticToView);
}
