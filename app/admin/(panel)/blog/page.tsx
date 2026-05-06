import Link from "next/link";
import { format } from "date-fns";

import { dbConnectSafe } from "@/lib/db/connect";
import { BlogPost } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PrimaryButton } from "@/components/admin/FormPrimitives";

export const dynamic = "force-dynamic";

async function listPostsAdmin() {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  const rows = await BlogPost.find({}).sort({ updatedAt: -1 }).lean();
  return rows.map((r: any) => ({
    id: r._id.toString(),
    slug: r.slug,
    title: r.title,
    status: r.status,
    tags: r.tags ?? [],
    publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : null,
    updatedAt: new Date(r.updatedAt).toISOString(),
    readingTimeMinutes: r.readingTimeMinutes ?? 1,
  }));
}

const statusStyles: Record<string, string> = {
  draft: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  published: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  archived: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
};

export default async function AdminBlogPage() {
  const posts = await listPostsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Blog"
        subtitle="Manage MDX posts."
        action={
          <Link href="/admin/blog/new">
            <PrimaryButton type="button">+ New post</PrimaryButton>
          </Link>
        }
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
          <p className="text-white-100">No posts yet.</p>
          <p className="text-white-200 text-sm mt-2">
            Create your first post — drafts won&apos;t appear on /blog until promoted to{" "}
            <code className="text-purple">published</code>.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[0.65rem] uppercase tracking-widest text-white-200">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Published</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-white">{p.title}</p>
                    <p className="text-[0.65rem] text-white-200 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[0.65rem] uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusStyles[p.status] ?? ""}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white-200 text-xs">
                    {p.publishedAt ? format(new Date(p.publishedAt), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 text-white-200 text-xs">
                    {format(new Date(p.updatedAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="text-purple text-xs hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    {p.status === "published" && (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="text-white-200 text-xs hover:text-white"
                      >
                        View ↗
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
