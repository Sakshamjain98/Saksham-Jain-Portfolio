import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminPageHeader
        title="New project"
        subtitle="Add a project to the portfolio."
        action={
          <Link
            href="/admin/projects"
            className="text-sm text-white-200 hover:text-white"
          >
            ← Back
          </Link>
        }
      />
      <ProjectForm mode={{ kind: "create" }} />
    </>
  );
}
