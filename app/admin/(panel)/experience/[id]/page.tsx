import Link from "next/link";
import { notFound } from "next/navigation";

import { dbConnect } from "@/lib/db/connect";
import { Experience } from "@/lib/models";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { DeleteConfirmForm } from "@/components/admin/DeleteConfirmForm";
import { deleteExperienceAction } from "@/lib/actions/experience";
import type { ExperienceView } from "@/lib/cms/types";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  await dbConnect();
  const row: any = await Experience.findById(params.id).lean();
  if (!row) notFound();

  const initial: ExperienceView = {
    id: row._id.toString(),
    title: row.title,
    company: row.company,
    description: row.description,
    location: row.location,
    startDate: new Date(row.startDate).toISOString(),
    endDate: row.endDate ? new Date(row.endDate).toISOString() : null,
    order: row.order ?? 0,
    thumbnail: row.thumbnail,
    highlights: row.highlights ?? [],
    technologies: row.technologies ?? [],
  };

  async function deleteEntry() {
    "use server";
    await deleteExperienceAction(params.id);
  }

  return (
    <>
      <AdminPageHeader
        title={`Edit · ${initial.title}`}
        subtitle={initial.company}
        action={
          <Link href="/admin/experience" className="text-sm text-white-200 hover:text-white">
            ← Back
          </Link>
        }
      />
      <ExperienceForm mode={{ kind: "edit", id: params.id }} initial={initial} />
      <div className="mt-12 pt-6 border-t border-white/[0.06] max-w-3xl">
        <p className="text-sm text-white-200 mb-3">Danger zone</p>
        <DeleteConfirmForm
          action={deleteEntry}
          label="Delete entry"
          confirmMessage={`Delete "${initial.title}" permanently?`}
        />
      </div>
    </>
  );
}
