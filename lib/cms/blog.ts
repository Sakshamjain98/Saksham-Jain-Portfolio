import { dbConnectSafe } from "@/lib/db/connect";
import { BlogPost } from "@/lib/models";
import type { BlogPostView } from "./types";

function dbToView(row: any): BlogPostView {
  return {
    id: row._id.toString(),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    contentMdx: row.contentMdx,
    coverImage: row.coverImage,
    tags: row.tags ?? [],
    category: row.category,
    status: row.status,
    authorEmail: row.authorEmail,
    authorName: row.authorName,
    readingTimeMinutes: row.readingTimeMinutes ?? 1,
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImage: row.ogImage,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export async function getPublishedPosts(): Promise<BlogPostView[]> {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  try {
    const rows = await BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
    return rows.map(dbToView);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[cms.blog] read failed:", (err as Error).message);
    }
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostView | null> {
  const conn = await dbConnectSafe();
  if (!conn) return null;
  try {
    const row = await BlogPost.findOne({ slug, status: "published" }).lean();
    return row ? dbToView(row) : null;
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  try {
    const rows = await BlogPost.find({ status: "published" }, { slug: 1 }).lean();
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  try {
    const rows = await BlogPost.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);
    return rows.map((r: any) => ({ tag: r._id as string, count: r.count as number }));
  } catch {
    return [];
  }
}
