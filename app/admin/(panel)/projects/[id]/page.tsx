import Link from "next/link";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Project } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteConfirmForm } from "@/components/admin/DeleteConfirmForm";
import { deleteProjectAction } from "@/lib/actions/projects";
import type { ProjectView } from "@/lib/cms/types";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();
  const row: any = await Project.findById(params.id).lean();
  if (!row) notFound();

  const initial: ProjectView = {
    id: row._id.toString(),
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    liveUrl: row.liveUrl,
    repoUrl: row.repoUrl,
    coverImage: row.coverImage,
    iconLists: row.iconLists ?? [],
    status: row.status,
    isFeatured: row.isFeatured,
    order: row.order ?? 0,
    technologies: row.technologies ?? [],
    sections: (row.sections ?? []).map((s: any) => ({
      kind: s.kind,
      heading: s.heading,
      body: s.body,
      order: s.order ?? 0,
    })),
  };

  async function deleteProject() {
    "use server";
    await deleteProjectAction(params.id);
  }

  return (
    <>
      <AdminPageHeader
        title={`Edit · ${initial.title}`}
        subtitle={`Slug: ${initial.slug}`}
        action={
          <Link
            href="/admin/projects"
            className="text-sm text-white-200 hover:text-white"
          >
            ← Back
          </Link>
        }
      />

      <ProjectForm mode={{ kind: "edit", id: params.id }} initial={initial} />

      <div className="mt-12 pt-6 border-t border-white/[0.06] max-w-3xl">
        <p className="text-sm text-white-200 mb-3">Danger zone</p>
        <DeleteConfirmForm
          action={deleteProject}
          label="Delete project"
          confirmMessage={`Delete project "${initial.title}" permanently?`}
        />
      </div>
    </>
  );
}
