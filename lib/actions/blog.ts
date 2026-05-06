"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { BlogPost } from "@/lib/models";
import { blogPostInputSchema } from "@/lib/validations/blog";
import { requireAdmin } from "@/lib/auth/session";
import { computeReadingMinutes } from "@/lib/mdx/reading-time";

function parseFromFormData(fd: FormData, authorEmail: string) {
  const status = String(fd.get("status") ?? "draft") as "draft" | "published" | "archived";
  const publishedAtStr = String(fd.get("publishedAt") ?? "");
  return {
    slug: String(fd.get("slug") ?? ""),
    title: String(fd.get("title") ?? ""),
    excerpt: String(fd.get("excerpt") ?? ""),
    contentMdx: String(fd.get("contentMdx") ?? ""),
    coverImage: String(fd.get("coverImage") ?? ""),
    tags: String(fd.get("tags") ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    category: String(fd.get("category") ?? ""),
    status,
    authorEmail,
    authorName: String(fd.get("authorName") ?? ""),
    publishedAt:
      publishedAtStr && status === "published"
        ? publishedAtStr
        : status === "published"
          ? new Date().toISOString()
          : null,
    seoTitle: String(fd.get("seoTitle") ?? ""),
    seoDescription: String(fd.get("seoDescription") ?? ""),
    ogImage: String(fd.get("ogImage") ?? ""),
  };
}

export async function createBlogPostAction(_: unknown, formData: FormData) {
  const session = await requireAdmin();
  await dbConnect();

  const data = parseFromFormData(formData, session.user.email!);
  const parsed = blogPostInputSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const exists = await BlogPost.findOne({ slug: parsed.data.slug });
  if (exists) {
    return { ok: false as const, error: `Slug "${parsed.data.slug}" already exists` };
  }

  await BlogPost.create({
    ...parsed.data,
    readingTimeMinutes: computeReadingMinutes(parsed.data.contentMdx),
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostAction(
  id: string,
  _: unknown,
  formData: FormData,
) {
  const session = await requireAdmin();
  await dbConnect();

  const data = parseFromFormData(formData, session.user.email!);
  const parsed = blogPostInputSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const updated = await BlogPost.findByIdAndUpdate(
    id,
    {
      ...parsed.data,
      readingTimeMinutes: computeReadingMinutes(parsed.data.contentMdx),
    },
    { new: true },
  );
  if (!updated) return { ok: false as const, error: "Not found" };

  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  revalidatePath("/admin/blog");
  return { ok: true as const };
}

export async function deleteBlogPostAction(id: string) {
  await requireAdmin();
  await dbConnect();
  const removed = await BlogPost.findByIdAndDelete(id);
  if (removed) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${removed.slug}`);
    revalidatePath("/admin/blog");
  }
  redirect("/admin/blog");
}
