import readingTime from "reading-time";

export function computeReadingMinutes(mdx: string): number {
  const stats = readingTime(mdx);
  return Math.max(1, Math.round(stats.minutes));
}
