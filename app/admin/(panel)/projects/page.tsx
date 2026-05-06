import Link from "next/link";

import { dbConnectSafe } from "@/lib/db/connect";
import { Project } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PrimaryButton } from "@/components/admin/FormPrimitives";

export const dynamic = "force-dynamic";

async function listProjectsAdmin() {
  const conn = await dbConnectSafe();
  if (!conn) return [];
  const rows = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return rows.map((r: any) => ({
    id: r._id.toString(),
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    status: r.status,
    isFeatured: r.isFeatured,
    order: r.order ?? 0,
    updatedAt: new Date(r.updatedAt).toISOString(),
  }));
}

export default async function AdminProjectsPage() {
  const projects = await listProjectsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Projects"
        subtitle="Manage portfolio projects shown on /projects."
        action={
          <Link href="/admin/projects/new">
            <PrimaryButton type="button">+ New project</PrimaryButton>
          </Link>
        }
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-black-200/40 p-12 text-center">
          <p className="text-white-100">
            No projects in the database yet — the public site is currently rendering from{" "}
            <code className="text-purple">data/index.ts</code>.
          </p>
          <p className="text-white-200 text-sm mt-2">
            Create one here and the public pages start serving the DB version automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black-200/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[0.65rem] uppercase tracking-widest text-white-200">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 text-white">{p.title}</td>
                  <td className="px-4 py-3 text-white-200 font-mono text-xs">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className="text-[0.65rem] uppercase tracking-widest text-white-200">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white-200">{p.order}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-purple text-xs hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="text-white-200 text-xs hover:text-white"
                    >
                      View ↗
                    </Link>
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
