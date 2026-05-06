import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <>
      <AdminPageHeader
        title="New experience entry"
        action={
          <Link href="/admin/experience" className="text-sm text-white-200 hover:text-white">
            ← Back
          </Link>
        }
      />
      <ExperienceForm mode={{ kind: "create" }} />
    </>
  );
}
