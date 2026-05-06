/**
 * Simple in-memory token bucket. Per-IP, per-key.
 *
 * Caveats:
 *  - Resets on cold start. Fine for low-traffic personal site contact forms.
 *  - Not shared across multiple Vercel function instances (each has its own
 *    map). For stricter limits, swap to Upstash Redis.
 */

type Bucket = { tokens: number; last: number };

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitBuckets: Map<string, Bucket> | undefined;
}

const store = (global.__rateLimitBuckets ??= new Map<string, Bucket>());

export interface RateLimitOptions {
  /** Max tokens (i.e. burst capacity). */
  max: number;
  /** How many seconds for a full refill. */
  windowSeconds: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetSeconds: number;
}

export function rateLimit(
  key: string,
  { max, windowSeconds }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const refillPerMs = max / (windowSeconds * 1000);

  const bucket = store.get(key) ?? { tokens: max, last: now };
  const elapsed = now - bucket.last;
  bucket.tokens = Math.min(max, bucket.tokens + elapsed * refillPerMs);
  bucket.last = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    store.set(key, bucket);
    return {
      ok: true,
      remaining: Math.floor(bucket.tokens),
      resetSeconds: Math.ceil((1 - bucket.tokens) / refillPerMs / 1000),
    };
  }

  store.set(key, bucket);
  return {
    ok: false,
    remaining: 0,
    resetSeconds: Math.ceil((1 - bucket.tokens) / refillPerMs / 1000),
  };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
