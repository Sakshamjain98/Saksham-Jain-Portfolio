/**
 * Seed experience entries from data/index.ts into MongoDB.
 *
 *   npm run seed:experience
 *
 * Static dates are derived deterministically (most-recent-first). Edit them
 * from /admin/experience after seeding. Pass --force to overwrite.
 */

import mongoose from "mongoose";

import { dbConnect } from "../db/connect";
import { Experience } from "../models";
import { workExperience as staticExperience } from "../../data";

async function main() {
  const force = process.argv.includes("--force");
  await dbConnect();

  if (force) {
    await Experience.deleteMany({});
    console.log("[seed:experience] cleared existing entries (--force)");
  }

  const now = new Date();
  for (const [i, e] of staticExperience.entries()) {
    const exists = await Experience.findOne({ title: e.title });
    if (exists && !force) {
      console.log(`[seed:experience] skipped "${e.title}" (exists)`);
      continue;
    }

    const startDate = new Date(now.getFullYear() - (i + 1), 0, 1);
    const endDate = i === 0 ? null : new Date(now.getFullYear() - i, 0, 1);

    await Experience.create({
      title: e.title,
      company: e.title.split("—")[1]?.trim() || e.title,
      description: e.desc,
      startDate,
      endDate,
      order: e.id,
      thumbnail: e.thumbnail,
      highlights: [],
      technologies: [],
    });
    console.log(`[seed:experience] created "${e.title}"`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed:experience] failed:", err);
  process.exit(1);
});
