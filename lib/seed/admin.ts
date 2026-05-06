/**
 * One-shot script to seed the first admin user.
 *
 *   npm run seed:admin
 *
 * Reads ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME from .env.local. If a user
 * with that email already exists, prompts and exits unless `--force` is
 * passed (which rotates the password hash).
 */

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { dbConnect } from "../db/connect";
import { User } from "../models";

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "Saksham Jain").trim();
  const force = process.argv.includes("--force");

  if (!email || !password) {
    console.error(
      "[seed:admin] ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local",
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.warn(
      "[seed:admin] WARNING: admin password is shorter than 12 chars. Consider rotating after first sign-in.",
    );
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing && !force) {
    console.log(
      `[seed:admin] User ${email} already exists (role=${existing.role}). Pass --force to rotate password.`,
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (existing && force) {
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    existing.name = name || existing.name;
    await existing.save();
    console.log(`[seed:admin] Rotated password and ensured admin role for ${email}.`);
  } else {
    await User.create({
      email,
      name,
      passwordHash,
      role: "admin",
    });
    console.log(`[seed:admin] Created admin ${email}.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("[seed:admin] Failed:", err);
  process.exit(1);
});
