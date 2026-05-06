import mongoose, { type Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";

const cache = (global.__mongooseCache ??= { conn: null, promise: null });

export async function dbConnect(): Promise<Mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local — see .env.example.",
    );
  }

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}

/**
 * Soft-connect — returns null on failure instead of throwing.
 * Used by public pages that should still render with static fallback content
 * when the DB is unreachable.
 */
export async function dbConnectSafe(): Promise<Mongoose | null> {
  try {
    return await dbConnect();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[db] connect failed; falling back:", (err as Error).message);
    }
    return null;
  }
}
