import { MongoClient, type MongoClientOptions } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global.__mongoClientPromise) {
      global.__mongoClientPromise = new MongoClient(uri, options).connect();
    }
    clientPromise = global.__mongoClientPromise;
  } else {
    clientPromise = new MongoClient(uri, options).connect();
  }
}

/**
 * Native MongoClient promise — used by `@next-auth/mongodb-adapter`.
 * Mongoose has its own connection (lib/db/connect.ts) and the two coexist
 * by design (different drivers, same URI, same database).
 */
export default clientPromise;
