import Link from "next/link";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { BlogPost } from "@/lib/models";
import { requireAdmin } from "@/lib/auth/session";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { BlogForm } from "@/components/admin/BlogForm";
import { DeleteConfirmForm } from "@/components/admin/DeleteConfirmForm";
import { deleteBlogPostAction } from "@/lib/actions/blog";
import type { BlogPostView } from "@/lib/cms/types";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireAdmin();
  await dbConnect();
  const row: any = await BlogPost.findById(params.id).lean();
  if (!row) notFound();

  const initial: BlogPostView = {
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

  async function deletePost() {
    "use server";
    await deleteBlogPostAction(params.id);
  }

  return (
    <>
      <AdminPageHeader
        title={`Edit · ${initial.title}`}
        subtitle={`${initial.readingTimeMinutes} min · ${initial.status}`}
        action={
          <Link href="/admin/blog" className="text-sm text-white-200 hover:text-white">
            ← Back
          </Link>
        }
      />

      <BlogForm
        mode={{ kind: "edit", id: params.id }}
        initial={initial}
        defaultAuthorEmail={session.user.email!}
        defaultAuthorName={session.user.name ?? undefined}
      />

      <div className="mt-12 pt-6 border-t border-white/[0.06] max-w-3xl">
        <p className="text-sm text-white-200 mb-3">Danger zone</p>
        <DeleteConfirmForm
          action={deletePost}
          label="Delete post"
          confirmMessage={`Delete "${initial.title}" permanently?`}
        />
      </div>
    </>
  );
}
